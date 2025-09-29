"""
CineVivid Backend API
FastAPI backend for AI video generation using SkyReels-V2
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import asyncio
import logging
from datetime import datetime, timedelta
from pathlib import Path
import shutil

# Import SkyReels-V2 components
try:
    from ..skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
    prompt_enhancer = PromptEnhancer()
except ImportError:
    prompt_enhancer = None

# Import utilities
from .auth import (
    authenticate_user, create_access_token, get_current_user,
    deduct_credits, get_user_credits, ACCESS_TOKEN_EXPIRE_MINUTES
)
from ..utils.stripe_utils import create_checkout_session, handle_webhook_event, get_pricing_plans

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CineVivid API",
    version="1.0.0",
    description="AI Video Generation Platform powered by SkyReels-V2"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1234", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
VIDEOS_DIR = Path("../models/videos")
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR = Path("../temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files
app.mount("/videos", StaticFiles(directory=str(VIDEOS_DIR)), name="videos")
app.mount("/temp", StaticFiles(directory=str(TEMP_DIR)), name="temp")

# Global video generator (lazy load)
video_generator = None

def get_video_generator():
    """Lazy load video generator"""
    global video_generator
    if video_generator is None:
        try:
            from ..utils.video_generator import VideoGenerator
            video_generator = VideoGenerator()
            logger.info("Video generator loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load video generator: {e}")
            video_generator = None
    return video_generator

# Pydantic models
class VideoGenerationRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "16:9"
    duration: Optional[int] = 5
    style: Optional[str] = "cinematic"
    num_frames: Optional[int] = 97
    guidance_scale: Optional[float] = 6.0
    enhance_prompt: Optional[bool] = True

class ImageToVideoRequest(BaseModel):
    prompt: str
    image_path: str
    num_frames: Optional[int] = 97
    guidance_scale: Optional[float] = 5.0
    enhance_prompt: Optional[bool] = True

class PromptEnhancementRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

class VoiceoverRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM"  # Rachel
    model: Optional[str] = "eleven_monolingual_v1"

class VideoEditRequest(BaseModel):
    video_path: str
    operation: str  # trim, add_text, add_music, etc.
    params: Dict[str, Any]

# In-memory storage (replace with database in production)
videos_db = []
users_db = []

# API Routes

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "CineVivid API",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "text-to-video", "image-to-video", "prompt-enhancement",
            "voiceover", "video-editing", "authentication"
        ]
    }

@app.get("/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "video_generator": video_generator is not None,
            "prompt_enhancer": prompt_enhancer is not None
        }
    }

# Authentication endpoints
@app.post("/auth/login")
async def login(username: str = Form(...), password: str = Form(...)):
    """User login"""
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user["username"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.post("/auth/register")
async def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    """User registration"""
    # Check if user exists
    if any(u["username"] == username for u in users_db):
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create new user
    user = {
        "id": len(users_db) + 1,
        "username": username,
        "email": email,
        "credits": 300,  # Free tier credits
        "tier": "free",
        "created_at": datetime.now().isoformat()
    }
    users_db.append(user)

    access_token = create_access_token(data={"sub": user["username"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@app.get("/auth/credits")
async def get_credits(current_user: dict = Depends(get_current_user)):
    """Get user credits"""
    return {"credits": get_user_credits(current_user["username"])}

# Stripe billing endpoints
@app.get("/billing/plans")
async def get_billing_plans():
    """Get available pricing plans"""
    return get_pricing_plans()

@app.post("/billing/create-checkout-session")
async def create_checkout(tier: str = Form(...), current_user: dict = Depends(get_current_user)):
    """Create Stripe checkout session"""
    session = create_checkout_session(current_user["username"], tier)
    if session:
        return session
    raise HTTPException(status_code=400, detail="Invalid tier or payment setup")

@app.post("/billing/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        # Verify webhook signature (would need webhook secret)
        # stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)

        event = json.loads(payload)
        success = handle_webhook_event(event)

        if success:
            return {"status": "success"}
        else:
            raise HTTPException(status_code=400, detail="Webhook processing failed")

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail="Webhook verification failed")

# Video Generation endpoints

@app.post("/generate/text-to-video")
async def generate_text_to_video(
    request: VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """Generate video from text prompt"""
    try:
        # Check credits
        cost = request.num_frames // 24 * 10  # 10 credits per second
        if not deduct_credits(current_user["username"], cost):
            raise HTTPException(status_code=402, detail="Insufficient credits")

        task_id = str(uuid.uuid4())

        # Enhance prompt if requested
        final_prompt = request.prompt
        if request.enhance_prompt and prompt_enhancer:
            try:
                final_prompt = prompt_enhancer(request.prompt)
                logger.info(f"Enhanced prompt: {final_prompt}")
            except Exception as e:
                logger.warning(f"Prompt enhancement failed: {e}")

        # Create video record
        video_data = {
            "id": len(videos_db) + 1,
            "task_id": task_id,
            "type": "text-to-video",
            "title": f"T2V: {request.prompt[:50]}...",
            "prompt": request.prompt,
            "enhanced_prompt": final_prompt,
            "status": "processing",
            "created_at": datetime.now().isoformat(),
            "user_id": current_user["id"],
            "aspect_ratio": request.aspect_ratio,
            "duration": request.duration,
            "num_frames": request.num_frames,
            "style": request.style,
            "guidance_scale": request.guidance_scale,
            "cost": cost
        }
        videos_db.append(video_data)

        # Start background task
        background_tasks.add_task(process_text_to_video_generation, task_id)

        return {
            "task_id": task_id,
            "status": "processing",
            "message": "Video generation started",
            "estimated_time": "2-5 minutes",
            "cost": cost
        }

    except Exception as e:
        logger.error(f"T2V generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/image-to-video")
async def generate_image_to_video(
    background_tasks: BackgroundTasks,
    prompt: str = Form(...),
    image: UploadFile = File(...),
    num_frames: int = Form(97),
    guidance_scale: float = Form(5.0),
    enhance_prompt: bool = Form(True),
    current_user: dict = Depends(get_current_user)
):
    """Generate video from image"""
    try:
        # Check credits
        cost = num_frames // 24 * 15  # 15 credits per second for I2V
        if not deduct_credits(current_user["username"], cost):
            raise HTTPException(status_code=402, detail="Insufficient credits")

        task_id = str(uuid.uuid4())

        # Save uploaded image
        image_path = TEMP_DIR / f"{task_id}_input.png"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Enhance prompt if requested
        final_prompt = prompt
        if enhance_prompt and prompt_enhancer:
            try:
                final_prompt = prompt_enhancer(prompt)
                logger.info(f"Enhanced prompt: {final_prompt}")
            except Exception as e:
                logger.warning(f"Prompt enhancement failed: {e}")

        # Create video record
        video_data = {
            "id": len(videos_db) + 1,
            "task_id": task_id,
            "type": "image-to-video",
            "title": f"I2V: {prompt[:50]}...",
            "prompt": prompt,
            "enhanced_prompt": final_prompt,
            "status": "processing",
            "created_at": datetime.now().isoformat(),
            "user_id": current_user["id"],
            "image_path": str(image_path),
            "num_frames": num_frames,
            "guidance_scale": guidance_scale,
            "cost": cost
        }
        videos_db.append(video_data)

        # Start background task
        background_tasks.add_task(process_image_to_video_generation, task_id)

        return {
            "task_id": task_id,
            "status": "processing",
            "message": "Image-to-video generation started",
            "estimated_time": "3-7 minutes",
            "cost": cost
        }

    except Exception as e:
        logger.error(f"I2V generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhance/prompt")
async def enhance_prompt_endpoint(request: PromptEnhancementRequest):
    """Enhance a prompt using AI"""
    if not prompt_enhancer:
        raise HTTPException(status_code=503, detail="Prompt enhancer not available")

    try:
        if request.context:
            enhanced = prompt_enhancer.enhance_with_context(request.prompt, request.context)
        else:
            enhanced = prompt_enhancer(request.prompt)

        return {
            "original_prompt": request.prompt,
            "enhanced_prompt": enhanced,
            "improvement": len(enhanced) > len(request.prompt)
        }
    except Exception as e:
        logger.error(f"Prompt enhancement failed: {e}")
        raise HTTPException(status_code=500, detail="Enhancement failed")

@app.post("/generate/voiceover")
async def generate_voiceover(
    request: VoiceoverRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate voiceover audio"""
    try:
        # Check credits (10 credits per minute)
        estimated_cost = max(10, len(request.text) // 150)  # Rough estimate
        if not deduct_credits(current_user["username"], estimated_cost):
            raise HTTPException(status_code=402, detail="Insufficient credits")

        from ..utils.voiceover_generator import VoiceoverGenerator
        generator = VoiceoverGenerator()

        audio_path = generator.generate_voiceover(
            text=request.text,
            voice_id=request.voice_id,
            model=request.model
        )

        if not audio_path:
            raise HTTPException(status_code=500, detail="Voiceover generation failed")

        # Move to videos directory
        final_path = VIDEOS_DIR / f"voiceover_{uuid.uuid4()}.mp3"
        shutil.move(audio_path, final_path)

        return {
            "audio_url": f"/videos/{final_path.name}",
            "cost": estimated_cost
        }

    except Exception as e:
        logger.error(f"Voiceover generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/edit/video")
async def edit_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    operation: str = Form(...),
    params: str = Form(...),  # JSON string
    current_user: dict = Depends(get_current_user)
):
    """Edit video (trim, add text, etc.)"""
    try:
        # Check credits
        cost = 5  # Base cost for editing
        if not deduct_credits(current_user["username"], cost):
            raise HTTPException(status_code=402, detail="Insufficient credits")

        task_id = str(uuid.uuid4())

        # Save uploaded video
        video_path = TEMP_DIR / f"{task_id}_input.mp4"
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        # Parse params
        edit_params = json.loads(params)

        # Create edit record
        edit_data = {
            "id": len(videos_db) + 1,
            "task_id": task_id,
            "type": "video-edit",
            "title": f"Edit: {operation}",
            "status": "processing",
            "created_at": datetime.now().isoformat(),
            "user_id": current_user["id"],
            "input_video": str(video_path),
            "operation": operation,
            "params": edit_params,
            "cost": cost
        }
        videos_db.append(edit_data)

        # Start background task
        background_tasks.add_task(process_video_edit, task_id)

        return {
            "task_id": task_id,
            "status": "processing",
            "message": f"Video {operation} started",
            "cost": cost
        }

    except Exception as e:
        logger.error(f"Video edit failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/videos")
async def get_videos(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = None,
    limit: int = 50
):
    """Get user's videos"""
    user_videos = [v for v in videos_db if v.get("user_id") == current_user["id"]]

    if status and status != "all":
        user_videos = [v for v in user_videos if v.get("status") == status]

    return {
        "videos": user_videos[-limit:],  # Most recent first
        "total": len(user_videos)
    }

@app.get("/status/{task_id}")
async def get_task_status(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get generation task status"""
    task = next((t for t in videos_db if t.get("task_id") == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "task_id": task_id,
        "status": task.get("status"),
        "progress": task.get("progress", 0),
        "result": task.get("result"),
        "error": task.get("error"),
        "created_at": task.get("created_at")
    }

# Background processing functions

async def process_text_to_video_generation(task_id: str):
    """Process T2V generation in background"""
    try:
        # Find task
        task = next((t for t in videos_db if t.get("task_id") == task_id), None)
        if not task:
            return

        task["status"] = "processing"
        task["progress"] = 10

        # Get generator
        generator = get_video_generator()
        if not generator:
            raise Exception("Video generator not available")

        # Generate video
        output_path = generator.generate_video(
            prompt=task["enhanced_prompt"],
            num_frames=task["num_frames"],
            fps=24,
            aspect_ratio=task.get("aspect_ratio", "16:9")
        )

        # Move to videos directory
        final_path = VIDEOS_DIR / f"video_{task_id}.mp4"
        shutil.move(output_path, final_path)

        # Update task
        task["status"] = "completed"
        task["progress"] = 100
        task["result"] = f"/videos/{final_path.name}"

    except Exception as e:
        logger.error(f"T2V processing failed: {e}")
        task = next((t for t in videos_db if t.get("task_id") == task_id), None)
        if task:
            task["status"] = "failed"
            task["error"] = str(e)

async def process_image_to_video_generation(task_id: str):
    """Process I2V generation in background"""
    try:
        # Find task
        task = next((t for t in videos_db if t.get("task_id") == task_id), None)
        if not task:
            return

        task["status"] = "processing"
        task["progress"] = 10

        # Get generator
        generator = get_video_generator()
        if not generator:
            raise Exception("Video generator not available")

        # Generate video
        output_path = generator.generate_video_from_image(
            image_path=task["image_path"],
            prompt=task["enhanced_prompt"],
            num_frames=task["num_frames"],
            fps=24
        )

        # Move to videos directory
        final_path = VIDEOS_DIR / f"i2v_{task_id}.mp4"
        shutil.move(output_path, final_path)

        # Update task
        task["status"] = "completed"
        task["progress"] = 100
        task["result"] = f"/videos/{final_path.name}"

    except Exception as e:
        logger.error(f"I2V processing failed: {e}")
        task = next((t for t in videos_db if t.get("task_id") == task_id), None)
        if task:
            task["status"] = "failed"
            task["error"] = str(e)

async def process_video_edit(task_id: str):
    """Process video editing in background"""
    try:
        # Find task
        task = next((t for t in videos_db if t.get("task_id") == task_id), None)
        if not task:
            return

        task["status"] = "processing"
        task["progress"] = 10

        # Apply edit operation
        input_path = task["input_video"]
        operation = task["operation"]
        params = task["params"]

        # Simple FFmpeg operations (expand as needed)
        import subprocess

        output_path = VIDEOS_DIR / f"edit_{task_id}.mp4"

        if operation == "trim":
            start = params.get("start", 0)
            duration = params.get("duration", 10)
            cmd = [
                "ffmpeg", "-i", input_path,
                "-ss", str(start), "-t", str(duration),
                "-c", "copy", str(output_path)
            ]
        elif operation == "add_text":
            text = params.get("text", "Sample Text")
            cmd = [
                "ffmpeg", "-i", input_path,
                "-vf", f"drawtext=text='{text}':fontsize=24:fontcolor=white:x=10:y=10",
                "-c:a", "copy", str(output_path)
            ]
        else:
            # Default: copy
            cmd = ["ffmpeg", "-i", input_path, "-c", "copy", str(output_path)]

        subprocess.run(cmd, check=True)

        # Update task
        task["status"] = "completed"
        task["progress"] = 100
        task["result"] = f"/videos/{output_path.name}"

    except Exception as e:
        logger.error(f"Video edit processing failed: {e}")
        task = next((t for t in videos_db if t.get("task_id") == task_id), None)
        if task:
            task["status"] = "failed"
            task["error"] = str(e)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)