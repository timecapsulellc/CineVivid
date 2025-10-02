"""
CineVivid Backend API
FastAPI backend for AI video generation using SkyReels-V2
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
import shutil

# Import database components
from .db.database import get_db, init_database, check_database_connection, DatabaseHealth
from .db import crud, models, schemas
from .db.models import User

# Import error handling and logging
from .utils.logger import initialize_logging, get_logger
from .utils.errors import *
from .middleware.error_handler import (
    ErrorHandlingMiddleware, RequestLoggingMiddleware, SecurityMiddleware,
    HealthChecker, cinevivid_exception_handler, http_exception_handler,
    generic_exception_handler
)

# Import SkyReels-V2 components
try:
    from ..skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
    prompt_enhancer = PromptEnhancer()
except ImportError as e:
    logging.warning(f"Failed to import prompt enhancer: {e}")
    prompt_enhancer = None

# Import utilities
from ..utils.stripe_utils import create_checkout_session, handle_webhook_event, get_pricing_plans
from ..utils.model_manager import get_model_manager

# Initialize logging
loggers = initialize_logging()
logger = get_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CineVivid API",
    version="1.0.0",
    description="AI Video Generation Platform powered by SkyReels-V2",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Store environment for error handling
app.state.environment = os.getenv("ENVIRONMENT", "development")

# Security
security = HTTPBearer()

# Add middleware (order matters!)
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:1234",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://cinevivid.ai",
        "https://*.cinevivid.ai"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app.add_exception_handler(CineVividException, cinevivid_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Create directories
VIDEOS_DIR = Path("./videos")
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR = Path("./temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR = Path("./models")
MODELS_DIR.mkdir(parents=True, exist_ok=True)

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

# Authentication dependency
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        from jose import JWTError, jwt
        
        token = credentials.credentials
        SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        ALGORITHM = "HS256"
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = crud.get_user_by_username(db, username)
        if user is None or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")
        
        return user
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Optional authentication for some endpoints
async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, None otherwise"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.split(" ")[1]
        
        from jose import JWTError, jwt
        SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        ALGORITHM = "HS256"
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None:
            return None
        
        user = crud.get_user_by_username(db, username)
        return user if user and user.is_active else None
        
    except:
        return None

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting CineVivid API...")
    
    # Initialize database
    if not check_database_connection():
        logger.error("Database connection failed")
    else:
        logger.info("Database connected successfully")
        
        # Auto-initialize if needed
        if os.getenv("AUTO_INIT_DB", "true").lower() == "true":
            init_database()

# API Routes

@app.get("/", response_model=Dict[str, Any])
async def root():
    """API root endpoint"""
    return {
        "message": "CineVivid API",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "text-to-video", "image-to-video", "prompt-enhancement",
            "voiceover", "video-editing", "authentication", "database"
        ],
        "docs_url": "/docs"
    }

@app.get("/health", response_model=schemas.HealthCheck)
async def health_check(db: Session = Depends(get_db)):
    """Comprehensive API health check"""
    try:
        # Run comprehensive health checks
        health_results = HealthChecker.comprehensive_health_check()
        
        # Check video generator
        generator = get_video_generator()
        
        # Check model manager
        model_manager = get_model_manager()
        cache_stats = model_manager.get_cache_stats()
        
        # Check models
        models_loaded = []
        if generator:
            try:
                model_info = generator.get_model_info()
                if model_info.get("pipeline_loaded"):
                    models_loaded.append(model_info.get("model_id", "unknown"))
            except:
                pass
        
        return {
            "status": health_results["overall_status"],
            "timestamp": datetime.utcnow(),
            "version": "1.0.0",
            "services": {
                "database": health_results["checks"]["database"]["status"] == "healthy",
                "redis": health_results["checks"]["redis"]["status"] == "healthy",
                "video_generator": generator is not None,
                "prompt_enhancer": prompt_enhancer is not None,
                "gpu": health_results["checks"]["gpu"]["available"]
            },
            "models_loaded": models_loaded,
            "system_info": {
                "health_checks": health_results,
                "model_cache": cache_stats,
                "directories": {
                    "temp": str(TEMP_DIR),
                    "videos": str(VIDEOS_DIR),
                    "models": str(MODELS_DIR)
                }
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow(),
            "version": "1.0.0",
            "services": {},
            "models_loaded": [],
            "system_info": {"error": str(e)}
        }

# Authentication endpoints
@app.post("/auth/register", response_model=schemas.Token)
async def register(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """User registration"""
    # Check if user exists
    if crud.get_user_by_username(db, user_data.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if crud.get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user = crud.create_user(db, user_data, tier="free")
    
    # Create access token
    from jose import jwt
    from datetime import timedelta
    
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {
            "sub": user.username,
            "exp": datetime.utcnow() + access_token_expires
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.post("/auth/login", response_model=schemas.Token)
async def login(
    login_data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """User login"""
    user = crud.authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    from jose import jwt
    from datetime import timedelta
    
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {
            "sub": user.username,
            "exp": datetime.utcnow() + access_token_expires
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@app.get("/auth/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@app.get("/auth/credits")
async def get_credits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user credits and transaction history"""
    credits = crud.get_user_credits(db, current_user.id)
    recent_transactions = crud.get_credit_history(db, current_user.id, limit=10)
    
    return {
        "credits": credits,
        "recent_transactions": recent_transactions
    }

@app.get("/auth/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    stats = crud.get_user_stats(db, current_user.id)
    return stats

# Model management endpoints
@app.get("/models/available")
async def get_available_models(current_user: User = Depends(get_current_user)):
    """Get list of available models"""
    try:
        model_manager = get_model_manager()
        models = model_manager.get_available_models()
        
        return {
            "models": [
                {
                    "model_id": info.model_id,
                    "model_type": info.model_type,
                    "resolution": info.resolution,
                    "size": info.size,
                    "is_downloaded": info.is_downloaded,
                    "download_progress": info.download_progress,
                    "file_size_gb": info.file_size_gb,
                    "url": info.url
                }
                for info in models.values()
            ]
        }
    except Exception as e:
        logger.error(f"Failed to get available models: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve models")

@app.post("/models/download/{model_id}")
async def download_model(
    model_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Download a model"""
    try:
        # Check if user is admin
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Admin access required")
        
        model_manager = get_model_manager()
        model_info = model_manager.get_model_info(model_id)
        
        if not model_info:
            raise HTTPException(status_code=404, detail="Model not found")
        
        # Check disk space
        has_space, required, available = model_manager.check_disk_space(model_id)
        if not has_space:
            raise HTTPException(
                status_code=507,
                detail=f"Insufficient disk space. Required: {required:.1f}GB, Available: {available:.1f}GB"
            )
        
        # Start download in background
        background_tasks.add_task(model_manager.download_model_sync, model_id)
        
        return {
            "message": f"Download started for {model_id}",
            "estimated_time_minutes": model_manager.estimate_download_time(model_id),
            "required_space_gb": required
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Model download failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/cache/stats")
async def get_cache_stats(current_user: User = Depends(get_current_user)):
    """Get model cache statistics"""
    try:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Admin access required")
        
        model_manager = get_model_manager()
        stats = model_manager.get_cache_stats()
        
        return stats
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get cache stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin endpoints
@app.get("/admin/stats")
async def get_admin_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin statistics"""
    try:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Admin access required")
        
        stats = crud.get_system_stats(db)
        model_manager = get_model_manager()
        cache_stats = model_manager.get_cache_stats()
        
        return {
            **stats,
            "model_cache": cache_stats,
            "system_health": HealthChecker.comprehensive_health_check()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get admin stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Video Generation endpoints
@app.post("/generate/text-to-video")
async def generate_text_to_video(
    request: schemas.VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate video from text prompt"""
    try:
        # Calculate cost
        cost = request.num_frames // 24 * 10  # 10 credits per second
        
        # Check and deduct credits
        if not crud.deduct_credits(
            db, current_user.id, cost, 
            description=f"T2V generation: {request.prompt[:50]}...",
            reference_type="video"
        ):
            raise HTTPException(status_code=402, detail="Insufficient credits")
        
        task_id = str(uuid.uuid4())
        
        # Enhance prompt if requested
        final_prompt = request.prompt
        if request.enhance_prompt and prompt_enhancer:
            try:
                final_prompt = prompt_enhancer(request.prompt)
                logger.info(f"Enhanced prompt: {final_prompt[:100]}...")
            except Exception as e:
                logger.warning(f"Prompt enhancement failed: {e}")
        
        # Create video record in database
        video_data = {
            "task_id": task_id,
            "type": "text-to-video",
            "title": f"T2V: {request.prompt[:50]}...",
            "prompt": request.prompt,
            "enhanced_prompt": final_prompt,
            "status": "pending",
            "aspect_ratio": request.aspect_ratio,
            "num_frames": request.num_frames,
            "style": request.style,
            "guidance_scale": request.guidance_scale,
            "cost_credits": cost
        }
        
        video = crud.create_video(db, current_user.id, video_data)
        
        # Start background task
        background_tasks.add_task(process_text_to_video_generation, task_id)
        
        return {
            "task_id": task_id,
            "status": "pending",
            "message": "Video generation started",
            "estimated_time": "2-5 minutes",
            "cost": cost
        }
        
    except HTTPException:
        raise
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate video from image"""
    try:
        # Calculate cost
        cost = num_frames // 24 * 15  # 15 credits per second for I2V
        
        # Check and deduct credits
        if not crud.deduct_credits(
            db, current_user.id, cost,
            description=f"I2V generation: {prompt[:50]}...",
            reference_type="video"
        ):
            raise HTTPException(status_code=402, detail="Insufficient credits")
        
        task_id = str(uuid.uuid4())
        
        # Save uploaded image
        image_path = TEMP_DIR / f"{task_id}_input.{image.filename.split('.')[-1]}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Enhance prompt if requested
        final_prompt = prompt
        if enhance_prompt and prompt_enhancer:
            try:
                final_prompt = prompt_enhancer(prompt)
                logger.info(f"Enhanced prompt: {final_prompt[:100]}...")
            except Exception as e:
                logger.warning(f"Prompt enhancement failed: {e}")
        
        # Create video record
        video_data = {
            "task_id": task_id,
            "type": "image-to-video",
            "title": f"I2V: {prompt[:50]}...",
            "prompt": prompt,
            "enhanced_prompt": final_prompt,
            "status": "pending",
            "image_path": str(image_path),
            "num_frames": num_frames,
            "guidance_scale": guidance_scale,
            "cost_credits": cost
        }
        
        video = crud.create_video(db, current_user.id, video_data)
        
        # Start background task
        background_tasks.add_task(process_image_to_video_generation, task_id)
        
        return {
            "task_id": task_id,
            "status": "pending",
            "message": "Image-to-video generation started",
            "estimated_time": "3-7 minutes",
            "cost": cost
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"I2V generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhance/prompt", response_model=schemas.PromptEnhancementResponse)
async def enhance_prompt_endpoint(
    request: schemas.PromptEnhancementRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Enhance a prompt using AI"""
    if not prompt_enhancer:
        raise HTTPException(status_code=503, detail="Prompt enhancer not available")
    
    try:
        if request.context:
            enhanced = prompt_enhancer.enhance_with_context(request.prompt, request.context)
        else:
            enhanced = prompt_enhancer(request.prompt)
        
        # Calculate improvement score
        improvement_score = min(len(enhanced) / len(request.prompt), 3.0)
        
        # Get suggestions
        suggestions = []
        if len(request.prompt.split()) < 10:
            suggestions.append("Consider adding more descriptive details")
        if "cinematic" not in request.prompt.lower():
            suggestions.append("Add cinematic quality keywords")
        
        return {
            "original_prompt": request.prompt,
            "enhanced_prompt": enhanced,
            "improvement_score": improvement_score,
            "suggestions": suggestions
        }
        
    except Exception as e:
        logger.error(f"Prompt enhancement failed: {e}")
        raise HTTPException(status_code=500, detail="Enhancement failed")

@app.get("/videos", response_model=schemas.VideoListResponse)
async def get_videos(
    status: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's videos with pagination"""
    offset = (page - 1) * per_page
    videos = crud.get_user_videos(db, current_user.id, status, per_page, offset)
    total = db.query(models.Video).filter(models.Video.user_id == current_user.id).count()
    
    return {
        "videos": videos,
        "total": total,
        "page": page,
        "per_page": per_page
    }

@app.get("/status/{task_id}", response_model=schemas.TaskStatus)
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get generation task status"""
    video = crud.get_video_by_task_id(db, task_id)
    if not video:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if video.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "task_id": task_id,
        "status": video.status,
        "progress": video.progress,
        "result": video.output_url,
        "error": video.error_message,
        "created_at": video.created_at,
        "estimated_completion": video.created_at + timedelta(minutes=5) if video.status == "processing" else None
    }

# Background processing functions
async def process_text_to_video_generation(task_id: str):
    """Process T2V generation in background"""
    db = next(get_db())
    
    try:
        # Update status to processing
        video = crud.update_video_status(db, task_id, "processing", 10)
        if not video:
            return
        
        # Get generator
        generator = get_video_generator()
        if not generator:
            crud.update_video_status(db, task_id, "failed", 0, "Video generator not available")
            return
        
        # Generate video
        crud.update_video_status(db, task_id, "processing", 50)
        
        output_path = generator.generate_video(
            prompt=video.enhanced_prompt,
            num_frames=video.num_frames,
            fps=24,
            aspect_ratio=video.aspect_ratio or "16:9"
        )
        
        # Move to videos directory
        final_path = VIDEOS_DIR / f"video_{task_id}.mp4"
        shutil.move(output_path, final_path)
        
        # Update video record
        output_url = f"/videos/{final_path.name}"
        crud.update_video_status(db, task_id, "completed", 100, output_url=output_url)
        
        logger.info(f"T2V generation completed: {task_id}")
        
    except Exception as e:
        logger.error(f"T2V processing failed: {e}")
        crud.update_video_status(db, task_id, "failed", 0, str(e))
    finally:
        db.close()

async def process_image_to_video_generation(task_id: str):
    """Process I2V generation in background"""
    db = next(get_db())
    
    try:
        # Update status to processing
        video = crud.update_video_status(db, task_id, "processing", 10)
        if not video:
            return
        
        # Get generator
        generator = get_video_generator()
        if not generator:
            crud.update_video_status(db, task_id, "failed", 0, "Video generator not available")
            return
        
        # Generate video
        crud.update_video_status(db, task_id, "processing", 50)
        
        output_path = generator.generate_video_from_image(
            image_path=video.image_path,
            prompt=video.enhanced_prompt,
            num_frames=video.num_frames,
            fps=24
        )
        
        # Move to videos directory
        final_path = VIDEOS_DIR / f"i2v_{task_id}.mp4"
        shutil.move(output_path, final_path)
        
        # Update video record
        output_url = f"/videos/{final_path.name}"
        crud.update_video_status(db, task_id, "completed", 100, output_url=output_url)
        
        logger.info(f"I2V generation completed: {task_id}")
        
    except Exception as e:
        logger.error(f"I2V processing failed: {e}")
        crud.update_video_status(db, task_id, "failed", 0, str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)