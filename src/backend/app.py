from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from celery import Celery
import torch
from diffusers import DiffusionPipeline, SkyReelsV2DiffusionForcingImageToVideoPipeline
from diffusers.utils import load_image, export_to_video
import uuid
from PIL import Image
import io
from skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
from elevenlabs import generate, set_api_key
import os
import ffmpeg
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

from .db import crud, models, schemas
from .db.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
celery = Celery('tasks', broker='redis://localhost:6379')

# Security
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Set ElevenLabs API key
set_api_key(os.environ.get("ELEVENLABS_API_KEY"))

# Initialize T2V pipeline
t2v_pipe = DiffusionPipeline.from_pretrained("Skywork/SkyReels-V2-DF-14B-540P", torch_dtype=torch.float16).to("cuda")

# Initialize I2V pipeline
i2v_pipe = SkyReelsV2DiffusionForcingImageToVideoPipeline.from_pretrained(
    "Skywork/SkyReels-V2-DF-14B-540P-Diffusers",
    torch_dtype=torch.float16
).to("cuda")

# Initialize Prompt Enhancer
prompt_enhancer = PromptEnhancer()

# --- Auth --- 

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

# --- Celery Tasks ---

@celery.task
def generate_t2v(prompt: str, num_frames: int = 120, voiceover_path: str = None, user_id: int = None, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user.credits < 50:
        return {"error": "Insufficient credits"}
    crud.update_user_credits(db, user_id, user.credits - 50)

    frames = t2v_pipe(prompt, num_frames=num_frames, guidance_scale=7.5).frames[0]
    video_path = f"/tmp/{uuid.uuid4()}.mp4"
    export_to_video(frames, video_path, fps=24)

    if voiceover_path:
        output_path = f"/tmp/{uuid.uuid4()}.mp4"
        input_video = ffmpeg.input(video_path)
        input_audio = ffmpeg.input(voiceover_path)
        ffmpeg.concat(input_video, input_audio, v=1, a=1).output(output_path).run()
        return output_path
    return video_path

@celery.task
def generate_i2v(image_bytes: bytes, prompt: str, num_frames: int = 97, voiceover_path: str = None, user_id: int = None, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user.credits < 50:
        return {"error": "Insufficient credits"}
    crud.update_user_credits(db, user_id, user.credits - 50)

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    output = i2v_pipe(
        image=image,
        prompt=prompt,
        num_inference_steps=30,
        height=544,
        width=960,
        guidance_scale=5.0,
        num_frames=num_frames,
    ).frames[0]
    video_path = f"/tmp/{uuid.uuid4()}.mp4"
    export_to_video(output, video_path, fps=24)

    if voiceover_path:
        output_path = f"/tmp/{uuid.uuid4()}.mp4"
        input_video = ffmpeg.input(video_path)
        input_audio = ffmpeg.input(voiceover_path)
        ffmpeg.concat(input_video, input_audio, v=1, a=1).output(output_path).run()
        return output_path
    return video_path

# --- API Endpoints ---

@app.post("/api/t2v")
async def t2v(prompt: str, num_frames: int = 120, voiceover_text: str = None, voice_id: str = None, current_user: schemas.User = Depends(get_current_user)):
    voiceover_path = None
    if voiceover_text and voice_id:
        audio = generate(text=voiceover_text, voice=voice_id)
        voiceover_path = f"/tmp/{uuid.uuid4()}.mp3"
        with open(voiceover_path, "wb") as f:
            f.write(audio)
    task = generate_t2v.delay(prompt, num_frames, voiceover_path, current_user.id)
    return {"task_id": task.id}

@app.post("/api/i2v")
async def i2v(file: UploadFile = File(...), prompt: str = "A video generated from an image", num_frames: int = 97, voiceover_text: str = None, voice_id: str = None, current_user: schemas.User = Depends(get_current_user)):
    image_bytes = await file.read()
    voiceover_path = None
    if voiceover_text and voice_id:
        audio = generate(text=voiceover_text, voice=voice_id)
        voiceover_path = f"/tmp/{uuid.uuid4()}.mp3"
        with open(voiceover_path, "wb") as f:
            f.write(audio)
    task = generate_i2v.delay(image_bytes, prompt, num_frames, voiceover_path, current_user.id)
    return {"task_id": task.id}

@app.post("/api/enhance")
async def enhance(prompt: str, current_user: schemas.User = Depends(get_current_user)):
    enhanced_prompt = prompt_enhancer(prompt)
    return {"enhanced_prompt": enhanced_prompt}

@app.post("/api/voiceover")
async def voiceover(text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM", current_user: schemas.User = Depends(get_current_user)):
    audio = generate(text=text, voice=voice_id)
    path = f"/tmp/{uuid.uuid4()}.mp3"
    with open(path, "wb") as f:
        f.write(audio)
    return {"path": path}

@app.post("/api/edit")
async def edit(file: UploadFile = File(...), trim_start: int = 0, trim_end: int = 0, fade_in: int = 0, fade_out: int = 0, current_user: schemas.User = Depends(get_current_user)):
    video_path = f"/tmp/{uuid.uuid4()}.mp4"
    with open(video_path, "wb") as f:
        f.write(await file.read())

    input_video = ffmpeg.input(video_path)
    if trim_end > 0:
        input_video = input_video.trim(start=trim_start, end=trim_end)
    if fade_in > 0:
        input_video = input_video.filter('fade', type='in', start_time=0, duration=fade_in)
    if fade_out > 0:
        input_video = input_video.filter('fade', type='out', start_time=trim_end - fade_out, duration=fade_out)

    output_path = f"/tmp/{uuid.uuid4()}.mp4"
    input_video.output(output_path).run()
    return {"path": output_path}