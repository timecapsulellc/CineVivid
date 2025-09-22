from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Credit costs (per operation)
CREDIT_COSTS = {
    "video_generation": 50,  # per second of video
    "image_generation": 10,  # per image
    "lip_sync": 30,  # per video
    "talking_avatar": 40,  # per video
    "short_film": 100,  # per scene
    "prompt_enhancement": 5,  # per enhancement
    "video_editing": 20,  # per edit operation
}

# Pricing tiers
PRICING_TIERS = {
    "free": {
        "name": "Free",
        "credits": 300,
        "price": 0,
        "features": ["Basic generation", "Watermarked output", "Community support"]
    },
    "pro": {
        "name": "Pro",
        "credits": 1000,
        "price": 19,
        "features": ["HD generation", "No watermarks", "Priority support", "API access"]
    },
    "business": {
        "name": "Business",
        "credits": 3000,
        "price": 49,
        "features": ["4K generation", "Team collaboration", "Custom models", "Dedicated support"]
    },
    "enterprise": {
        "name": "Enterprise",
        "credits": -1,  # unlimited
        "price": 0,  # custom pricing
        "features": ["Unlimited generation", "White-label", "On-premise deployment", "SLA"]
    }
}

# Mock user database (replace with real database in production)
users_db = {
    "demo@cinevivid.ai": {
        "id": 1,
        "email": "demo@cinevivid.ai",
        "hashed_password": bcrypt.hashpw("demo123".encode(), bcrypt.gensalt()).decode(),
        "tier": "free",
        "credits": 300,
        "created_at": datetime.now().isoformat(),
        "is_active": True
    }
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
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def get_password_hash(password: str) -> str:
    """Hash password"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def authenticate_user(email: str, password: str):
    """Authenticate user credentials"""
    user = users_db.get(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = users_db.get(email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    if not user.get("is_active", False):
        raise HTTPException(status_code=400, detail="Inactive user")

    return user

def deduct_credits(user_email: str, operation: str, amount: Optional[int] = None) -> bool:
    """Deduct credits from user account"""
    user = users_db.get(user_email)
    if not user:
        return False

    # Unlimited credits for enterprise
    if user.get("tier") == "enterprise":
        return True

    cost = amount if amount else CREDIT_COSTS.get(operation, 10)

    if user["credits"] < cost:
        return False

    user["credits"] -= cost
    return True

def add_credits(user_email: str, amount: int) -> bool:
    """Add credits to user account"""
    user = users_db.get(user_email)
    if not user:
        return False

    # Unlimited credits for enterprise - don't add more
    if user.get("tier") == "enterprise":
        return True

    user["credits"] += amount
    return True

def get_user_credits(user_email: str) -> int:
    """Get user's current credit balance"""
    user = users_db.get(user_email)
    if not user:
        return 0

    # Unlimited credits for enterprise
    if user.get("tier") == "enterprise":
        return 999999

    return user.get("credits", 0)

def upgrade_user_tier(user_email: str, new_tier: str) -> bool:
    """Upgrade user to new tier"""
    user = users_db.get(user_email)
    if not user:
        return False

    if new_tier not in PRICING_TIERS:
        return False

    user["tier"] = new_tier

    # Add credits for new tier (if not enterprise)
    if new_tier != "enterprise":
        user["credits"] = PRICING_TIERS[new_tier]["credits"]

    return True

def register_user(email: str, password: str, tier: str = "free") -> dict:
    """Register new user"""
    if email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(password)
    user = {
        "id": len(users_db) + 1,
        "email": email,
        "hashed_password": hashed_password,
        "tier": tier,
        "credits": PRICING_TIERS[tier]["credits"] if tier != "enterprise" else 999999,
        "created_at": datetime.now().isoformat(),
        "is_active": True
    }

    users_db[email] = user
    return user

def get_pricing_info():
    """Get pricing tiers information"""
    return PRICING_TIERS

def calculate_credit_cost(operation: str, params: dict = None) -> int:
    """Calculate credit cost for an operation"""
    base_cost = CREDIT_COSTS.get(operation, 10)

    # Adjust based on parameters
    if params:
        if operation == "video_generation":
            duration = params.get("duration", 5)
            base_cost = base_cost * duration
        elif operation == "short_film":
            scenes = params.get("scenes", 1)
            base_cost = base_cost * scenes

    return base_cost