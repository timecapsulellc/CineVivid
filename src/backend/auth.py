"""
Authentication and Authorization for CineVivid
JWT-based authentication with credit system
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory user storage (replace with database in production)
users_db = {}

def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

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

def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Authenticate a user"""
    user = users_db.get(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user

def get_user_credits(username: str) -> int:
    """Get user's current credits"""
    user = users_db.get(username)
    return user.get("credits", 0) if user else 0

def deduct_credits(username: str, amount: int) -> bool:
    """Deduct credits from user account"""
    user = users_db.get(username)
    if not user or user.get("credits", 0) < amount:
        return False

    user["credits"] -= amount
    return True

def add_credits(username: str, amount: int) -> bool:
    """Add credits to user account"""
    user = users_db.get(username)
    if not user:
        return False

    user["credits"] += amount
    return True

def create_user(username: str, email: str, password: str, tier: str = "free") -> dict:
    """Create a new user"""
    if username in users_db:
        raise ValueError("Username already exists")

    # Set initial credits based on tier
    initial_credits = {
        "free": 300,
        "pro": 1000,
        "business": 3000,
        "enterprise": 10000
    }.get(tier, 300)

    user = {
        "id": len(users_db) + 1,
        "username": username,
        "email": email,
        "hashed_password": hash_password(password),
        "tier": tier,
        "credits": initial_credits,
        "created_at": datetime.utcnow().isoformat(),
        "is_active": True,
        "is_admin": False
    }

    users_db[username] = user
    return user

def get_current_user(token: str) -> Optional[dict]:
    """Get current user from JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None

    user = users_db.get(username)
    return user if user and user.get("is_active") else None

def update_user_tier(username: str, new_tier: str) -> bool:
    """Update user subscription tier"""
    user = users_db.get(username)
    if not user:
        return False

    # Update credits based on new tier
    tier_credits = {
        "free": 300,
        "pro": 1000,
        "business": 3000,
        "enterprise": 10000
    }

    old_credits = user.get("credits", 0)
    new_credits = tier_credits.get(new_tier, 300)

    user["tier"] = new_tier
    user["credits"] = new_credits

    return True

def get_user_stats(username: str) -> dict:
    """Get user statistics"""
    user = users_db.get(username)
    if not user:
        return {}

    return {
        "tier": user.get("tier"),
        "credits": user.get("credits"),
        "videos_generated": 0,  # Would need to query from database
        "account_age_days": (datetime.utcnow() - datetime.fromisoformat(user["created_at"])).days,
        "is_admin": user.get("is_admin", False)
    }

# Initialize with demo users
def init_demo_users():
    """Initialize demo users for testing"""
    try:
        create_user("demo", "demo@cinevivid.ai", "demo123", "free")
        create_user("admin", "admin@cinevivid.ai", "admin123", "enterprise")
        users_db["admin"]["is_admin"] = True
        print("Demo users initialized")
    except ValueError:
        pass  # Users already exist

# Call on import
init_demo_users()