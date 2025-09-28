
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database URL for SQLite
DATABASE_URL = "sqlite:///./cinevivid.db"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

# --- ORM Models ---

class User(Base):
    """User model for authentication and credits"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    tier = Column(String, default="free")
    credits = Column(Integer, default=300)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks = relationship("VideoTask", back_populates="owner")

class VideoTask(Base):
    """Model for video generation tasks"""
    __tablename__ = "video_tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String)
    prompt = Column(String)
    enhanced_prompt = Column(String, nullable=True)
    status = Column(String, default="processing")
    progress = Column(Integer, default=0)
    result_url = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Task parameters
    task_type = Column(String) # e.g., "text-to-video", "image-to-video"
    aspect_ratio = Column(String, nullable=True)
    duration = Column(Integer, nullable=True)
    style = Column(String, nullable=True)
    cost = Column(Integer, default=0)

    # Foreign key to User
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")


# --- Database Initialization ---

def init_db():
    """
    Create database tables from the models.
    This should be called once at application startup.
    """
    try:
        print("Initializing database...")
        Base.metadata.create_all(bind=engine)
        print("Database initialized successfully.")
    except Exception as e:
        print(f"An error occurred during database initialization: {e}")

# --- Dependency for FastAPI ---

def get_db():
    """
    FastAPI dependency that provides a database session.
    Ensures the session is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

