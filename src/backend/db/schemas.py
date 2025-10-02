"""
Pydantic schemas for CineVivid API
Request/response models for API validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enums for better type safety
class UserTier(str, Enum):
    FREE = "free"
    PRO = "pro" 
    BUSINESS = "business"
    ENTERPRISE = "enterprise"

class VideoType(str, Enum):
    TEXT_TO_VIDEO = "text-to-video"
    IMAGE_TO_VIDEO = "image-to-video"
    VIDEO_EDIT = "video-edit"
    VIDEO_EXTENSION = "video-extension"

class VideoStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class TransactionType(str, Enum):
    PURCHASE = "purchase"
    USAGE = "usage"
    REFUND = "refund"
    BONUS = "bonus"

# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    tier: UserTier
    credits: float
    is_active: bool
    is_verified: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserStats(BaseModel):
    videos_generated: int
    credits_used: float
    account_age_days: int
    last_login: Optional[datetime] = None

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Video schemas
class VideoGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=1000)
    aspect_ratio: Optional[str] = Field("16:9", pattern=r"^(16:9|9:16|1:1)$")
    duration: Optional[int] = Field(5, ge=1, le=60)
    style: Optional[str] = "cinematic"
    num_frames: Optional[int] = Field(97, ge=25, le=500)
    guidance_scale: Optional[float] = Field(6.0, ge=1.0, le=20.0)
    enhance_prompt: Optional[bool] = True

class ImageToVideoRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=1000)
    num_frames: Optional[int] = Field(97, ge=25, le=500)
    guidance_scale: Optional[float] = Field(5.0, ge=1.0, le=20.0)
    enhance_prompt: Optional[bool] = True

class VideoEditRequest(BaseModel):
    operation: str = Field(..., pattern=r"^(trim|add_text|add_music|resize|filter)$")
    params: Dict[str, Any]

class VideoResponse(BaseModel):
    id: int
    task_id: str
    title: str
    description: Optional[str]
    type: VideoType
    status: VideoStatus
    progress: int
    prompt: Optional[str]
    output_url: Optional[str]
    duration: Optional[float]
    cost_credits: Optional[float]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class VideoListResponse(BaseModel):
    videos: List[VideoResponse]
    total: int
    page: int
    per_page: int

# Task status schema
class TaskStatus(BaseModel):
    task_id: str
    status: VideoStatus
    progress: int
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    estimated_completion: Optional[datetime] = None

# Prompt enhancement schemas
class PromptEnhancementRequest(BaseModel):
    prompt: str = Field(..., min_length=5, max_length=500)
    context: Optional[Dict[str, Any]] = None
    style: Optional[str] = "cinematic"

class PromptEnhancementResponse(BaseModel):
    original_prompt: str
    enhanced_prompt: str
    improvement_score: float
    suggestions: List[str] = []

# Voiceover schemas
class VoiceoverRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=5000)
    voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM"  # Rachel
    model: Optional[str] = "eleven_monolingual_v1"
    stability: Optional[float] = Field(0.5, ge=0.0, le=1.0)
    similarity_boost: Optional[float] = Field(0.5, ge=0.0, le=1.0)

class VoiceoverResponse(BaseModel):
    audio_url: str
    duration: float
    cost_credits: float
    voice_used: str

# Billing schemas
class PricingPlan(BaseModel):
    name: str
    credits: int
    price: float
    features: List[str]
    stripe_price_id: Optional[str] = None

class BillingPlansResponse(BaseModel):
    plans: Dict[str, PricingPlan]

class CheckoutSessionRequest(BaseModel):
    tier: UserTier
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

class CheckoutSessionResponse(BaseModel):
    session_id: str
    url: str

# Credit transaction schemas
class CreditTransaction(BaseModel):
    id: int
    type: TransactionType
    amount: float
    balance_after: float
    description: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class CreditHistory(BaseModel):
    transactions: List[CreditTransaction]
    current_balance: float
    total_earned: float
    total_spent: float

# API Key schemas
class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    permissions: Dict[str, bool] = {}
    expires_in_days: Optional[int] = Field(None, ge=1, le=365)

class APIKeyResponse(BaseModel):
    id: int
    name: str
    key_preview: str
    is_active: bool
    usage_count: int
    created_at: datetime
    expires_at: Optional[datetime]
    last_used_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class APIKeyGenerated(APIKeyResponse):
    api_key: str  # Only shown once during creation

# Model cache schemas
class ModelStatus(BaseModel):
    model_id: str
    model_type: str
    is_cached: bool
    download_status: str
    download_progress: int
    file_size: Optional[int]
    last_used_at: Optional[datetime]

class ModelCacheResponse(BaseModel):
    models: List[ModelStatus]
    total_cache_size: int
    available_models: List[str]

# System config schemas
class SystemConfigUpdate(BaseModel):
    value: str
    description: Optional[str] = None

class SystemConfigResponse(BaseModel):
    key: str
    value: str
    data_type: str
    description: Optional[str]
    is_public: bool
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Health check schema
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: Dict[str, bool]
    models_loaded: List[str]
    system_info: Dict[str, Any]

# Error schemas
class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Pagination schemas
class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=1, le=100)
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = Field("desc", pattern=r"^(asc|desc)$")

# File upload schemas
class FileUploadResponse(BaseModel):
    filename: str
    file_size: int
    file_type: str
    file_url: str
    upload_id: str

# Admin schemas
class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_videos: int
    processing_videos: int
    total_credits_used: float
    system_load: Dict[str, float]
    storage_used: int

class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    tier: Optional[UserTier] = None
    credits: Optional[float] = None
