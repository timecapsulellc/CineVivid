
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Database imports
from .db import get_db, User

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

# Credit costs & Pricing Tiers (can be moved to a config file)
CREDIT_COSTS = {
    "video_generation": 10,  # per second
    "image_generation": 5,
}
PRICING_TIERS = {
    "free": {"name": "Free", "credits": 300, "price": 0},
    "pro": {"name": "Pro", "credits": 1000, "price": 19},
}

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash password"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate user credentials against the database"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get current authenticated user from the database via JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except (jwt.PyJWTError, AttributeError):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def register_user(db: Session, email: str, password: str, tier: str = "free") -> User:
    """Register a new user in the database"""
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(password)
    credits = PRICING_TIERS.get(tier, {}).get("credits", 300)
    
    new_user = User(
        email=email,
        hashed_password=hashed_password,
        tier=tier,
        credits=credits
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def deduct_credits(db: Session, user_email: str, cost: int) -> bool:
    """Deduct credits from a user's account in the database"""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        return False

    if user.tier == "enterprise": # Unlimited credits
        return True

    if user.credits < cost:
        return False

    user.credits -= cost
    db.commit()
    return True

def add_credits(db: Session, user_email: str, amount: int) -> bool:
    """Add credits to a user's account in the database"""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        return False

    if user.tier != "enterprise":
        user.credits += amount
        db.commit()
    return True

def get_user_credits(db: Session, user_email: str) -> int:
    """Get a user's current credit balance from the database"""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        return 0

    if user.tier == "enterprise":
        return 999999

    return user.credits

def get_pricing_info():
    """Get pricing tiers information"""
    return PRICING_TIERS

