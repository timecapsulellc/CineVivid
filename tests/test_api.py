import pytest
from fastapi.testclient import TestClient
from src.backend.app import app
from src.backend.auth import create_user

client = TestClient(app)

@pytest.fixture
def test_user():
    """Create a test user"""
    user = create_user("testuser", "test@example.com", "testpass")
    return user

def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "CineVivid API" in response.json()["message"]

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_register_user():
    """Test user registration"""
    user_data = {
        "username": "newuser",
        "email": "new@example.com",
        "password": "newpass123"
    }
    response = client.post("/auth/register", data=user_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_user(test_user):
    """Test user login"""
    login_data = {
        "username": "testuser",
        "password": "testpass"
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_enhance_prompt():
    """Test prompt enhancement"""
    prompt_data = {
        "prompt": "A cat playing"
    }
    response = client.post("/enhance/prompt", json=prompt_data)
    assert response.status_code == 200
    assert "enhanced_prompt" in response.json()

def test_get_videos_unauthorized():
    """Test getting videos without auth"""
    response = client.get("/videos")
    assert response.status_code == 401

def test_generate_text_to_video_unauthorized():
    """Test T2V generation without auth"""
    video_data = {
        "prompt": "A beautiful sunset",
        "duration": 5,
        "aspect_ratio": "16:9"
    }
    response = client.post("/generate/text-to-video", json=video_data)
    assert response.status_code == 401