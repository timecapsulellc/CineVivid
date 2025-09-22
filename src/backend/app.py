from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import asyncio
from datetime import datetime, timedelta
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import authentication
from .auth import (
    authenticate_user, create_access_token, get_current_user,
    deduct_credits, get_user_credits, ACCESS_TOKEN_EXPIRE_MINUTES
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CineVivid API", version="1.0.0")

# Mount static files for videos
videos_dir = os.path.join(os.path.dirname(__file__), "../models/videos")
os.makedirs(videos_dir, exist_ok=True)
app.mount("/videos", StaticFiles(directory=videos_dir), name="videos")

# Import Celery task
from .celery_tasks import generate_video_task

# Global video generator (lazy load)
video_generator = None

def get_video_generator():
    global video_generator
    if video_generator is None:
        from ..utils.video_generator import VideoGenerator
        video_generator = VideoGenerator()
    return video_generator

# Import data storage
from .db import videos_db, lora_models_db

# Import prompt enhancer
try:
    from ...skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
    prompt_enhancer = PromptEnhancer()
except ImportError:
    prompt_enhancer = None
    logger.warning("Prompt enhancer not available")

# Pydantic models for request/response
class VideoGenerationRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "16:9"
    duration: Optional[int] = 5
    style: Optional[str] = "cinematic"

class PromptEnhancementRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

class ImageGenerationRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = ""
    style: Optional[str] = "realistic"
    aspect_ratio: Optional[str] = "1:1"
    quality: Optional[int] = 70

class LipSyncRequest(BaseModel):
    video_file: UploadFile
    audio_text: str
    voice: Optional[str] = "natural"

class ShortFilmRequest(BaseModel):
    title: str
    genre: str
    scenes: List[Dict[str, Any]]

class TalkingAvatarRequest(BaseModel):
    text: str
    voice_id: str
    avatar_id: str
    speed: Optional[float] = 1.0
    pitch: Optional[int] = 0

# CORS middleware (in production, configure properly)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1234", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes

@app.get("/")
async def root():
    return {"message": "SkyReels-V2 API", "version": "1.0.0"}

# Video Library Endpoints
@app.get("/videos")
async def get_videos(search: Optional[str] = None, status: Optional[str] = None):
    """Get user's video library"""
    filtered_videos = videos_db

    if search:
        filtered_videos = [v for v in filtered_videos if search.lower() in v.get('title', '').lower() or search.lower() in v.get('prompt', '').lower()]

    if status and status != 'all':
        filtered_videos = [v for v in filtered_videos if v.get('status') == status]

    return {"videos": filtered_videos}

@app.delete("/videos/{video_id}")
async def delete_video(video_id: int):
    """Delete a video from library"""
    global videos_db
    videos_db = [v for v in videos_db if v.get('id') != video_id]
    return {"message": "Video deleted successfully"}

# Text-to-Video Generation
@app.post("/generate/video")
async def generate_video(request: VideoGenerationRequest):
    """Generate video from text prompt"""
    task_id = str(uuid.uuid4())

    # Mock video generation (in production, integrate with actual model)
    video_data = {
        "id": len(videos_db) + 1,
        "task_id": task_id,
        "title": f"Generated Video {len(videos_db) + 1}",
        "prompt": request.prompt,
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "aspect_ratio": request.aspect_ratio,
        "duration": request.duration,
        "style": request.style,
        "thumbnail": "/placeholder.jpg"
    }

    videos_db.append(video_data)

    # Start Celery task
    generate_video_task.delay(task_id)

    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Video generation started"
    }

# Text-to-Image Generation
@app.post("/generate/image")
async def generate_image(request: ImageGenerationRequest):
    """Generate image from text prompt"""
    task_id = str(uuid.uuid4())

    # Mock image generation
    image_data = {
        "id": len(videos_db) + 1,
        "task_id": task_id,
        "type": "image",
        "prompt": request.prompt,
        "negative_prompt": request.negative_prompt,
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "style": request.style,
        "aspect_ratio": request.aspect_ratio,
        "quality": request.quality,
        "images": []
    }

    videos_db.append(image_data)

    # Simulate async processing
    asyncio.create_task(process_image_generation(task_id))

    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Image generation started"
    }

# Lip Sync Generation
@app.post("/generate/lip-sync")
async def generate_lip_sync(
    video_file: UploadFile = File(...),
    audio_text: str = Form(...),
    voice: str = Form("natural")
):
    """Generate lip sync video"""
    task_id = str(uuid.uuid4())

    # Save uploaded file (mock)
    file_path = f"/tmp/{task_id}_{video_file.filename}"

    # Mock lip sync generation
    video_data = {
        "id": len(videos_db) + 1,
        "task_id": task_id,
        "type": "lip_sync",
        "title": f"Lip Sync Video {len(videos_db) + 1}",
        "audio_text": audio_text,
        "voice": voice,
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "thumbnail": "/placeholder.jpg"
    }

    videos_db.append(video_data)

    # Simulate async processing
    asyncio.create_task(process_lip_sync_generation(task_id))

    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Lip sync generation started"
    }

# Short Film Generation
@app.post("/generate/short-film")
async def generate_short_film(request: ShortFilmRequest):
    """Generate short film from scenes"""
    task_id = str(uuid.uuid4())

    # Mock short film generation
    film_data = {
        "id": len(videos_db) + 1,
        "task_id": task_id,
        "type": "short_film",
        "title": request.title,
        "genre": request.genre,
        "scenes": request.scenes,
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "thumbnail": "/placeholder.jpg",
        "total_scenes": len(request.scenes),
        "estimated_duration": sum(scene.get('duration', 30) for scene in request.scenes)
    }

    videos_db.append(film_data)

    # Simulate async processing
    asyncio.create_task(process_short_film_generation(task_id))

    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Short film generation started"
    }

# Talking Avatar Generation
@app.post("/generate/talking-avatar")
async def generate_talking_avatar(request: TalkingAvatarRequest):
    """Generate talking avatar video"""
    task_id = str(uuid.uuid4())

    # Mock talking avatar generation
    video_data = {
        "id": len(videos_db) + 1,
        "task_id": task_id,
        "type": "talking_avatar",
        "title": f"Talking Avatar {len(videos_db) + 1}",
        "text": request.text,
        "voice_id": request.voice_id,
        "avatar_id": request.avatar_id,
        "speed": request.speed,
        "pitch": request.pitch,
        "status": "processing",
        "created_at": datetime.now().isoformat(),
        "thumbnail": "/placeholder.jpg"
    }

    videos_db.append(video_data)

    # Simulate async processing
    asyncio.create_task(process_talking_avatar_generation(task_id))

    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Talking avatar generation started"
    }

# LoRA Models Endpoints
@app.get("/lora-models")
async def get_lora_models(search: Optional[str] = None, category: Optional[str] = None):
    """Get available LoRA models"""
    filtered_models = lora_models_db

    if search:
        filtered_models = [m for m in filtered_models if search.lower() in m['name'].lower() or search.lower() in m['description'].lower()]

    if category and category != 'all':
        filtered_models = [m for m in filtered_models if m['category'] == category]

    return {"models": filtered_models}

@app.get("/lora-models/{model_id}")
async def get_lora_model(model_id: int):
    """Get specific LoRA model details"""
    model = next((m for m in lora_models_db if m['id'] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

# Task Status Endpoints
@app.get("/status/{task_id}")
async def get_task_status(task_id: str):
    """Get generation task status"""
    video = next((v for v in videos_db if v.get('task_id') == task_id), None)
    if not video:
        raise HTTPException(status_code=404, detail="Task not found")

    return {
        "task_id": task_id,
        "status": video.get('status', 'unknown'),
        "progress": video.get('progress', 0),
        "result": video.get('result'),
        "created_at": video.get('created_at')
    }

# Async processing functions
async def process_video_generation(task_id: str):
    """Real video generation processing"""
    # Find the video request
    video_data = None
    for v in videos_db:
        if v.get('task_id') == task_id:
            video_data = v
            break

    if not video_data:
        return

    try:
        # Update status to processing
        video_data['status'] = 'processing'
        video_data['progress'] = 10

        # Get generator
        generator = get_video_generator()

        # Calculate num_frames from duration (assume 24 fps)
        duration = video_data.get('duration', 5)
        num_frames = duration * 24

        # Generate video with optional voiceover
        voiceover_text = video_data.get('voiceover_text')
        voice_id = video_data.get('voice_id')

        output_path = generator.generate_video(
            prompt=video_data['prompt'],
            num_frames=num_frames,
            fps=24,
            voiceover_text=voiceover_text,
            voice_id=voice_id
        )

        # Update status
        video_data['status'] = 'completed'
        video_data['progress'] = 100
        video_data['result'] = f'/videos/{os.path.basename(output_path)}'

    except Exception as e:
        logger.error(f"Video generation failed: {e}")
        video_data['status'] = 'failed'
        video_data['error'] = str(e)

async def process_image_generation(task_id: str):
    """Mock image generation processing"""
    await asyncio.sleep(2)

    # Update image status
    for image in videos_db:
        if image.get('task_id') == task_id:
            image['status'] = 'completed'
            image['progress'] = 100
            image['images'] = [
                f'/images/{task_id}_1.png',
                f'/images/{task_id}_2.png',
                f'/images/{task_id}_3.png',
                f'/images/{task_id}_4.png'
            ]
            break

async def process_lip_sync_generation(task_id: str):
    """Mock lip sync processing"""
    await asyncio.sleep(4)

    # Update lip sync status
    for video in videos_db:
        if video.get('task_id') == task_id:
            video['status'] = 'completed'
            video['progress'] = 100
            video['result'] = f'/videos/lip_sync_{task_id}.mp4'
            break

async def process_short_film_generation(task_id: str):
    """Mock short film processing"""
    await asyncio.sleep(5)

    # Update short film status
    for film in videos_db:
        if film.get('task_id') == task_id:
            film['status'] = 'completed'
            film['progress'] = 100
            film['result'] = f'/videos/film_{task_id}.mp4'
            break

async def process_talking_avatar_generation(task_id: str):
    """Mock talking avatar processing"""
    await asyncio.sleep(6)

    # Update talking avatar status
    for avatar in videos_db:
        if avatar.get('task_id') == task_id:
            avatar['status'] = 'completed'
            avatar['progress'] = 100
            avatar['result'] = f'/videos/avatar_{task_id}.mp4'
            break

# Prompt Enhancement
@app.post("/enhance/prompt")
async def enhance_prompt(request: PromptEnhancementRequest):
    """Enhance a prompt using AI for better video generation results"""
    if not prompt_enhancer:
        raise HTTPException(status_code=503, detail="Prompt enhancer not available")

    try:
        if request.context:
            enhanced_prompt = prompt_enhancer.enhance_with_context(request.prompt, request.context)
        else:
            enhanced_prompt = prompt_enhancer(request.prompt)

        return {
            "original_prompt": request.prompt,
            "enhanced_prompt": enhanced_prompt,
            "improvement": len(enhanced_prompt) > len(request.prompt)
        }

    except Exception as e:
        logger.error(f"Prompt enhancement failed: {e}")
        raise HTTPException(status_code=500, detail="Prompt enhancement failed")

# Health check
@app.get("/health")
async def health_check():
    """API health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}