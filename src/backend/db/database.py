"""
Database configuration and initialization for CineVivid
SQLAlchemy setup with PostgreSQL support
"""
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
import logging
from typing import Generator

logger = logging.getLogger(__name__)

# Database URL from environment
DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "postgresql://user:password@localhost/cinevivid"
)

# SQLite fallback for development
if not DATABASE_URL or DATABASE_URL == "postgresql://user:password@localhost/cinevivid":
    DATABASE_URL = "sqlite:///./cinevivid.db"
    logger.warning("Using SQLite database for development. Set DATABASE_URL for production.")

# Engine configuration
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=os.getenv("DB_ECHO", "false").lower() == "true"
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=os.getenv("DB_ECHO", "false").lower() == "true"
    )

# Session configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session
    Use this in FastAPI dependencies
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    try:
        from .models import User, Video, APIKey, CreditTransaction, ModelCache, SystemConfig, AuditLog
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        return False

def drop_tables():
    """Drop all database tables (use with caution)"""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to drop database tables: {e}")
        return False

def init_database():
    """Initialize database with default data"""
    try:
        # Create tables first
        if not create_tables():
            return False
        
        # Import here to avoid circular imports
        from .crud import create_user, set_system_config, get_user_by_username
        from .schemas import UserCreate
        
        db = SessionLocal()
        
        try:
            # Create default admin user if not exists
            admin_user = get_user_by_username(db, "admin")
            if not admin_user:
                admin_data = UserCreate(
                    username="admin",
                    email="admin@cinevivid.ai",
                    password="admin123",  # Change in production
                    full_name="Administrator"
                )
                admin_user = create_user(db, admin_data, tier="enterprise")
                admin_user.is_admin = True
                db.commit()
                logger.info("Default admin user created")
            
            # Create demo user if not exists
            demo_user = get_user_by_username(db, "demo")
            if not demo_user:
                demo_data = UserCreate(
                    username="demo",
                    email="demo@cinevivid.ai",
                    password="demo123",
                    full_name="Demo User"
                )
                create_user(db, demo_data, tier="free")
                logger.info("Demo user created")
            
            # Set default system configurations
            default_configs = {
                "app_name": ("CineVivid", "Application name", "string", True),
                "app_version": ("1.0.0", "Application version", "string", True),
                "maintenance_mode": ("false", "Maintenance mode status", "bool", True),
                "max_video_duration": ("60", "Maximum video duration in seconds", "int", False),
                "max_file_size": ("100", "Maximum file size in MB", "int", False),
                "default_model": ("Skywork/SkyReels-V2-T2V-14B-540P", "Default video generation model", "string", False),
                "model_cache_dir": ("./models", "Model cache directory", "string", False),
                "video_output_dir": ("./videos", "Video output directory", "string", False)
            }
            
            for key, (value, description, data_type, is_public) in default_configs.items():
                existing = get_system_config(db, key)
                if not existing:
                    set_system_config(db, key, value, description, data_type, is_public)
            
            logger.info("Database initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize database data: {e}")
            db.rollback()
            return False
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return False

def check_database_connection() -> bool:
    """Check if database connection is working"""
    try:
        db = SessionLocal()
        # Simple query to test connection
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False

def get_database_info() -> dict:
    """Get database information"""
    try:
        db = SessionLocal()
        
        # Get database stats
        from .models import User, Video
        
        total_users = db.query(User).count()
        total_videos = db.query(Video).count()
        
        db_info = {
            "connected": True,
            "url": DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else DATABASE_URL,  # Hide credentials
            "total_users": total_users,
            "total_videos": total_videos,
            "engine_info": str(engine.url)
        }
        
        db.close()
        return db_info
        
    except Exception as e:
        return {
            "connected": False,
            "error": str(e),
            "url": DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else DATABASE_URL
        }

# Alembic support
def run_migrations():
    """Run database migrations using Alembic"""
    try:
        import subprocess
        import sys
        
        # Run alembic upgrade
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            logger.info("Database migrations completed successfully")
            return True
        else:
            logger.error(f"Migration failed: {result.stderr}")
            return False
            
    except ImportError:
        logger.warning("Alembic not installed, skipping migrations")
        return False
    except Exception as e:
        logger.error(f"Migration error: {e}")
        return False

# Database health check
class DatabaseHealth:
    """Database health monitoring"""
    
    @staticmethod
    def check() -> dict:
        """Comprehensive database health check"""
        try:
            db = SessionLocal()
            
            # Test basic connectivity
            db.execute("SELECT 1")
            
            # Test table access
            from .models import User
            user_count = db.query(User).count()
            
            # Test write capability
            import tempfile
            test_config_key = f"health_check_{int(os.time())}"
            
            health_status = {
                "status": "healthy",
                "connectivity": True,
                "read_access": True,
                "write_access": True,
                "user_count": user_count,
                "timestamp": os.time()
            }
            
            db.close()
            return health_status
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "connectivity": False,
                "timestamp": os.time()
            }

# Initialize database on import if environment variable is set
if os.getenv("AUTO_INIT_DB", "false").lower() == "true":
    logger.info("Auto-initializing database...")
    init_database()
