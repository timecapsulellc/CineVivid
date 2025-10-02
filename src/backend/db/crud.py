"""
CRUD operations for CineVivid database
Database operations for users, videos, and related entities
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import hashlib
import secrets
from passlib.context import CryptContext

from .models import User, Video, APIKey, CreditTransaction, ModelCache, SystemConfig, AuditLog
from .schemas import UserCreate, UserUpdate, VideoGenerationRequest, APIKeyCreate

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User CRUD operations
def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate, tier: str = "free") -> User:
    """Create new user"""
    # Set initial credits based on tier
    initial_credits = {
        "free": 300,
        "pro": 1000,
        "business": 3000,
        "enterprise": 10000
    }.get(tier, 300)
    
    hashed_password = pwd_context.hash(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        tier=tier,
        credits=initial_credits
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Log user creation
    log_audit_event(db, None, "user_created", {"user_id": db_user.id, "username": user.username})
    
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Update user information"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_user)
    
    return db_user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user"""
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()
    
    return user

# Credit operations
def get_user_credits(db: Session, user_id: int) -> float:
    """Get user's current credits"""
    user = get_user(db, user_id)
    return user.credits if user else 0.0

def deduct_credits(db: Session, user_id: int, amount: float, description: str = "", reference_type: str = "", reference_id: str = "") -> bool:
    """Deduct credits from user account"""
    user = get_user(db, user_id)
    if not user or user.credits < amount:
        return False
    
    user.credits -= amount
    
    # Create transaction record
    transaction = CreditTransaction(
        user_id=user_id,
        type="usage",
        amount=-amount,
        balance_after=user.credits,
        reference_type=reference_type,
        reference_id=reference_id,
        description=description
    )
    db.add(transaction)
    db.commit()
    
    return True

def add_credits(db: Session, user_id: int, amount: float, description: str = "", reference_type: str = "", reference_id: str = "") -> bool:
    """Add credits to user account"""
    user = get_user(db, user_id)
    if not user:
        return False
    
    user.credits += amount
    
    # Create transaction record
    transaction = CreditTransaction(
        user_id=user_id,
        type="purchase",
        amount=amount,
        balance_after=user.credits,
        reference_type=reference_type,
        reference_id=reference_id,
        description=description
    )
    db.add(transaction)
    db.commit()
    
    return True

def get_credit_history(db: Session, user_id: int, limit: int = 50) -> List[CreditTransaction]:
    """Get user's credit transaction history"""
    return db.query(CreditTransaction).filter(
        CreditTransaction.user_id == user_id
    ).order_by(desc(CreditTransaction.created_at)).limit(limit).all()

# Video CRUD operations
def create_video(db: Session, user_id: int, video_data: Dict[str, Any]) -> Video:
    """Create new video record"""
    db_video = Video(
        user_id=user_id,
        **video_data
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    
    return db_video

def get_video(db: Session, video_id: int) -> Optional[Video]:
    """Get video by ID"""
    return db.query(Video).filter(Video.id == video_id).first()

def get_video_by_task_id(db: Session, task_id: str) -> Optional[Video]:
    """Get video by task ID"""
    return db.query(Video).filter(Video.task_id == task_id).first()

def get_user_videos(db: Session, user_id: int, status: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[Video]:
    """Get user's videos"""
    query = db.query(Video).filter(Video.user_id == user_id)
    
    if status and status != "all":
        query = query.filter(Video.status == status)
    
    return query.order_by(desc(Video.created_at)).offset(offset).limit(limit).all()

def update_video_status(db: Session, task_id: str, status: str, progress: int = 0, error_message: str = None, output_url: str = None) -> Optional[Video]:
    """Update video processing status"""
    video = get_video_by_task_id(db, task_id)
    if not video:
        return None
    
    video.status = status
    video.progress = progress
    
    if error_message:
        video.error_message = error_message
    
    if output_url:
        video.output_url = output_url
    
    if status == "completed":
        video.completed_at = datetime.utcnow()
    
    video.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(video)
    
    return video

# API Key operations
def create_api_key(db: Session, user_id: int, api_key_data: APIKeyCreate) -> tuple[APIKey, str]:
    """Create new API key"""
    # Generate API key
    raw_key = f"cvk_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_preview = raw_key[:12] + "..."
    
    db_api_key = APIKey(
        user_id=user_id,
        name=api_key_data.name,
        key_hash=key_hash,
        key_preview=key_preview,
        permissions=api_key_data.permissions,
        expires_at=datetime.utcnow() + timedelta(days=api_key_data.expires_in_days) if api_key_data.expires_in_days else None
    )
    
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    
    return db_api_key, raw_key

def get_api_key_by_hash(db: Session, key_hash: str) -> Optional[APIKey]:
    """Get API key by hash"""
    return db.query(APIKey).filter(
        and_(APIKey.key_hash == key_hash, APIKey.is_active == True)
    ).first()

def validate_api_key(db: Session, raw_key: str) -> Optional[APIKey]:
    """Validate API key and update usage"""
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    api_key = get_api_key_by_hash(db, key_hash)
    
    if not api_key:
        return None
    
    # Check expiration
    if api_key.expires_at and api_key.expires_at < datetime.utcnow():
        return None
    
    # Update usage
    api_key.usage_count += 1
    api_key.last_used_at = datetime.utcnow()
    db.commit()
    
    return api_key

def deactivate_api_key(db: Session, user_id: int, api_key_id: int) -> bool:
    """Deactivate API key"""
    api_key = db.query(APIKey).filter(
        and_(APIKey.id == api_key_id, APIKey.user_id == user_id)
    ).first()
    
    if not api_key:
        return False
    
    api_key.is_active = False
    db.commit()
    
    return True

# Model cache operations
def get_model_cache_status(db: Session, model_id: str) -> Optional[ModelCache]:
    """Get model cache status"""
    return db.query(ModelCache).filter(ModelCache.model_id == model_id).first()

def update_model_cache(db: Session, model_id: str, **kwargs) -> ModelCache:
    """Update or create model cache entry"""
    model_cache = get_model_cache_status(db, model_id)
    
    if not model_cache:
        model_cache = ModelCache(model_id=model_id)
        db.add(model_cache)
    
    for key, value in kwargs.items():
        setattr(model_cache, key, value)
    
    model_cache.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(model_cache)
    
    return model_cache

def get_cached_models(db: Session) -> List[ModelCache]:
    """Get all cached models"""
    return db.query(ModelCache).filter(ModelCache.is_cached == True).all()

# System config operations
def get_system_config(db: Session, key: str) -> Optional[SystemConfig]:
    """Get system configuration"""
    return db.query(SystemConfig).filter(SystemConfig.key == key).first()

def set_system_config(db: Session, key: str, value: str, description: str = "", data_type: str = "string", is_public: bool = False) -> SystemConfig:
    """Set system configuration"""
    config = get_system_config(db, key)
    
    if not config:
        config = SystemConfig(
            key=key,
            value=value,
            description=description,
            data_type=data_type,
            is_public=is_public
        )
        db.add(config)
    else:
        config.value = value
        config.description = description or config.description
        config.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(config)
    
    return config

def get_public_configs(db: Session) -> List[SystemConfig]:
    """Get public system configurations"""
    return db.query(SystemConfig).filter(SystemConfig.is_public == True).all()

# Audit log operations
def log_audit_event(db: Session, user_id: Optional[int], event_type: str, event_data: Dict[str, Any], ip_address: str = "", user_agent: str = ""):
    """Log audit event"""
    audit_log = AuditLog(
        user_id=user_id,
        event_type=event_type,
        event_data=event_data,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    db.add(audit_log)
    db.commit()

def get_audit_logs(db: Session, user_id: Optional[int] = None, event_type: Optional[str] = None, limit: int = 100) -> List[AuditLog]:
    """Get audit logs"""
    query = db.query(AuditLog)
    
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    
    if event_type:
        query = query.filter(AuditLog.event_type == event_type)
    
    return query.order_by(desc(AuditLog.created_at)).limit(limit).all()

# Statistics and analytics
def get_user_stats(db: Session, user_id: int) -> Dict[str, Any]:
    """Get user statistics"""
    user = get_user(db, user_id)
    if not user:
        return {}
    
    videos_count = db.query(Video).filter(Video.user_id == user_id).count()
    completed_videos = db.query(Video).filter(
        and_(Video.user_id == user_id, Video.status == "completed")
    ).count()
    
    total_credits_used = db.query(CreditTransaction).filter(
        and_(CreditTransaction.user_id == user_id, CreditTransaction.type == "usage")
    ).count()
    
    return {
        "tier": user.tier,
        "credits": user.credits,
        "videos_generated": videos_count,
        "completed_videos": completed_videos,
        "account_age_days": (datetime.utcnow() - user.created_at).days,
        "total_credits_used": total_credits_used,
        "is_admin": user.is_admin
    }

def get_system_stats(db: Session) -> Dict[str, Any]:
    """Get system-wide statistics"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_videos = db.query(Video).count()
    processing_videos = db.query(Video).filter(Video.status.in_(["pending", "processing"])).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_videos": total_videos,
        "processing_videos": processing_videos,
        "cached_models": db.query(ModelCache).filter(ModelCache.is_cached == True).count()
    }
