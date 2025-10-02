"""
Database models for CineVivid
SQLAlchemy models for users, videos, and related entities
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    """User model with authentication and billing"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile information
    full_name = Column(String(255))
    avatar_url = Column(String(500))
    bio = Column(Text)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # Billing and subscription
    tier = Column(String(20), default="free")  # free, pro, business, enterprise
    credits = Column(Float, default=300.0)
    stripe_customer_id = Column(String(255))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login_at = Column(DateTime(timezone=True))
    
    # Relationships
    videos = relationship("Video", back_populates="user")
    api_keys = relationship("APIKey", back_populates="user")


class Video(Base):
    """Video generation records"""
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(36), unique=True, index=True, nullable=False)
    
    # User relationship
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="videos")
    
    # Video details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)  # text-to-video, image-to-video, video-edit
    
    # Generation parameters
    prompt = Column(Text)
    enhanced_prompt = Column(Text)
    image_path = Column(String(500))
    num_frames = Column(Integer, default=97)
    fps = Column(Integer, default=24)
    aspect_ratio = Column(String(10), default="16:9")
    guidance_scale = Column(Float, default=6.0)
    style = Column(String(50))
    
    # Processing status
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    progress = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Output
    output_path = Column(String(500))
    output_url = Column(String(500))
    file_size = Column(Integer)  # bytes
    duration = Column(Float)  # seconds
    
    # Metadata
    generation_time = Column(Float)  # seconds
    model_used = Column(String(100))
    cost_credits = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))


class APIKey(Base):
    """API keys for programmatic access"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="api_keys")
    
    name = Column(String(100), nullable=False)
    key_hash = Column(String(255), nullable=False, unique=True)
    key_preview = Column(String(20))  # First few chars for display
    
    is_active = Column(Boolean, default=True)
    
    # Usage tracking
    usage_count = Column(Integer, default=0)
    last_used_at = Column(DateTime(timezone=True))
    
    # Permissions
    permissions = Column(JSON)  # {"video_generation": true, "admin": false}
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))


class CreditTransaction(Base):
    """Credit usage and purchase history"""
    __tablename__ = "credit_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Transaction details
    type = Column(String(20), nullable=False)  # purchase, usage, refund, bonus
    amount = Column(Float, nullable=False)  # positive for credit, negative for usage
    balance_after = Column(Float, nullable=False)
    
    # Reference
    reference_type = Column(String(50))  # video, subscription, refund
    reference_id = Column(String(100))
    
    # Payment details (if applicable)
    stripe_payment_intent_id = Column(String(255))
    
    description = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ModelCache(Base):
    """Model download and caching status"""
    __tablename__ = "model_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    
    model_id = Column(String(255), unique=True, nullable=False)
    model_type = Column(String(50))  # t2v, i2v, diffusion_forcing
    
    # Cache status
    is_cached = Column(Boolean, default=False)
    cache_path = Column(String(500))
    file_size = Column(Integer)  # bytes
    
    # Download tracking
    download_status = Column(String(20), default="pending")  # pending, downloading, completed, failed
    download_progress = Column(Integer, default=0)
    download_speed = Column(Float)  # MB/s
    
    # Usage stats
    usage_count = Column(Integer, default=0)
    last_used_at = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SystemConfig(Base):
    """System configuration and settings"""
    __tablename__ = "system_config"
    
    id = Column(Integer, primary_key=True, index=True)
    
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text)
    data_type = Column(String(20), default="string")  # string, int, float, bool, json
    
    description = Column(Text)
    is_public = Column(Boolean, default=False)  # Can be accessed by frontend
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AuditLog(Base):
    """Audit log for important system events"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Event details
    event_type = Column(String(50), nullable=False)
    event_data = Column(JSON)
    
    # Request details
    ip_address = Column(String(45))
    user_agent = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
