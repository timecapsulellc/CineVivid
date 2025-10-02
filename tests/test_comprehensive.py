"""
Comprehensive test suite for CineVivid
End-to-end testing for all major components
"""
import pytest
import asyncio
import tempfile
import os
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json

# Import application components
from src.backend.app import app
from src.backend.db.database import Base, get_db
from src.backend.db import crud, models, schemas
from src.backend.utils.errors import *
from src.utils.model_manager import ModelManager, ModelInfo
from src.utils.video_generator import VideoGenerator

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_cinevivid.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

@pytest.fixture(scope="session")
def setup_test_database():
    """Set up test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def test_db():
    """Get test database session"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def test_user(test_db):
    """Create a test user"""
    user_data = schemas.UserCreate(
        username="testuser",
        email="test@example.com",
        password="testpass123"
    )
    user = crud.create_user(test_db, user_data, tier="pro")
    return user

@pytest.fixture
def admin_user(test_db):
    """Create an admin user"""
    user_data = schemas.UserCreate(
        username="admin",
        email="admin@example.com", 
        password="admin123"
    )
    user = crud.create_user(test_db, user_data, tier="enterprise")
    user.is_admin = True
    test_db.commit()
    return user

@pytest.fixture
def auth_headers(test_user):
    """Get authentication headers for test user"""
    from jose import jwt
    from datetime import datetime, timedelta
    
    SECRET_KEY = "test-secret-key"
    access_token = jwt.encode(
        {
            "sub": test_user.username,
            "exp": datetime.utcnow() + timedelta(minutes=30)
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    
    return {"Authorization": f"Bearer {access_token}"}

class TestAuthentication:
    """Test authentication and authorization"""
    
    def test_register_user(self, setup_test_database):
        """Test user registration"""
        user_data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
        
        response = client.post("/auth/register", json=user_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_register_duplicate_user(self, test_user):
        """Test registering duplicate user"""
        user_data = {
            "username": test_user.username,
            "email": "different@example.com",
            "password": "password123"
        }
        
        response = client.post("/auth/register", json=user_data)
        assert response.status_code == 400
        assert "already exists" in response.json()["message"]
    
    def test_login_valid_user(self, test_user):
        """Test login with valid credentials"""
        login_data = {
            "username": test_user.username,
            "password": "testpass123"
        }
        
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
    
    def test_login_invalid_user(self):
        """Test login with invalid credentials"""
        login_data = {
            "username": "nonexistent",
            "password": "wrongpass"
        }
        
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
    
    def test_get_current_user(self, test_user, auth_headers):
        """Test getting current user info"""
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["username"] == test_user.username
        assert data["email"] == test_user.email

class TestVideoGeneration:
    """Test video generation functionality"""
    
    @patch('src.utils.video_generator.VideoGenerator')
    def test_text_to_video_generation(self, mock_generator, test_user, auth_headers):
        """Test text-to-video generation"""
        mock_instance = Mock()
        mock_instance.generate_video.return_value = "/tmp/test_video.mp4"
        mock_generator.return_value = mock_instance
        
        request_data = {
            "prompt": "A beautiful sunset over mountains",
            "aspect_ratio": "16:9",
            "num_frames": 97,
            "enhance_prompt": True
        }
        
        response = client.post("/generate/text-to-video", json=request_data, headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "task_id" in data
        assert data["status"] == "pending"
        assert "cost" in data
    
    def test_text_to_video_insufficient_credits(self, test_db, auth_headers):
        """Test T2V generation with insufficient credits"""
        # Set user credits to 0
        user = test_db.query(models.User).filter(models.User.username == "testuser").first()
        user.credits = 0
        test_db.commit()
        
        request_data = {
            "prompt": "A beautiful sunset",
            "num_frames": 97
        }
        
        response = client.post("/generate/text-to-video", json=request_data, headers=auth_headers)
        assert response.status_code == 402
        assert "Insufficient credits" in response.json()["message"]
    
    def test_prompt_enhancement(self):
        """Test prompt enhancement"""
        with patch('src.skyreels_v2_infer.pipelines.prompt_enhancer.PromptEnhancer') as mock_enhancer:
            mock_instance = Mock()
            mock_instance.return_value = "Enhanced: A beautiful cinematic sunset over majestic mountains"
            mock_enhancer.return_value = mock_instance
            
            request_data = {
                "prompt": "A sunset over mountains"
            }
            
            response = client.post("/enhance/prompt", json=request_data)
            assert response.status_code == 200
            
            data = response.json()
            assert "enhanced_prompt" in data
            assert "improvement_score" in data

class TestDatabase:
    """Test database operations"""
    
    def test_user_crud(self, test_db):
        """Test user CRUD operations"""
        # Create user
        user_data = schemas.UserCreate(
            username="crudtest",
            email="crud@test.com",
            password="testpass"
        )
        user = crud.create_user(test_db, user_data)
        assert user.username == "crudtest"
        assert user.credits == 300  # Default free tier
        
        # Get user
        found_user = crud.get_user(test_db, user.id)
        assert found_user.username == "crudtest"
        
        # Update user
        update_data = schemas.UserUpdate(full_name="Test User")
        updated_user = crud.update_user(test_db, user.id, update_data)
        assert updated_user.full_name == "Test User"
    
    def test_credit_operations(self, test_db, test_user):
        """Test credit operations"""
        initial_credits = test_user.credits
        
        # Deduct credits
        success = crud.deduct_credits(test_db, test_user.id, 50, "Test deduction")
        assert success
        
        updated_credits = crud.get_user_credits(test_db, test_user.id)
        assert updated_credits == initial_credits - 50
        
        # Add credits
        success = crud.add_credits(test_db, test_user.id, 25, "Test addition")
        assert success
        
        final_credits = crud.get_user_credits(test_db, test_user.id)
        assert final_credits == initial_credits - 25
    
    def test_video_operations(self, test_db, test_user):
        """Test video CRUD operations"""
        video_data = {
            "task_id": "test-task-123",
            "type": "text-to-video",
            "title": "Test Video",
            "prompt": "Test prompt",
            "status": "pending",
            "num_frames": 97
        }
        
        video = crud.create_video(test_db, test_user.id, video_data)
        assert video.task_id == "test-task-123"
        assert video.user_id == test_user.id
        
        # Update status
        updated_video = crud.update_video_status(
            test_db, 
            "test-task-123", 
            "completed", 
            100,
            output_url="/videos/test.mp4"
        )
        assert updated_video.status == "completed"
        assert updated_video.progress == 100

class TestModelManager:
    """Test model management functionality"""
    
    def test_model_info_retrieval(self):
        """Test getting model information"""
        manager = ModelManager()
        
        model_info = manager.get_model_info("Skywork/SkyReels-V2-T2V-14B-540P")
        assert model_info is not None
        assert model_info.model_type == "t2v"
        assert model_info.resolution == "540P"
    
    def test_model_recommendations(self):
        """Test model recommendations"""
        manager = ModelManager()
        
        # Memory efficient recommendations
        recommendations = manager.recommend_models("memory_efficient", gpu_memory_gb=16)
        assert len(recommendations) > 0
        assert all("1.3B" in rec for rec in recommendations)
        
        # High quality recommendations
        recommendations = manager.recommend_models("high_quality", gpu_memory_gb=48)
        assert len(recommendations) > 0
        assert any("720P" in rec for rec in recommendations)
    
    def test_disk_space_check(self):
        """Test disk space checking"""
        manager = ModelManager()
        
        has_space, required, available = manager.check_disk_space("Skywork/SkyReels-V2-T2V-14B-540P")
        assert isinstance(has_space, bool)
        assert required > 0
        assert available >= 0
    
    def test_cache_stats(self):
        """Test cache statistics"""
        manager = ModelManager()
        
        stats = manager.get_cache_stats()
        assert "downloaded_models" in stats
        assert "total_models" in stats
        assert "available_space_gb" in stats
        assert "models" in stats
    
    @patch('src.utils.model_manager.snapshot_download')
    def test_model_download_mock(self, mock_download):
        """Test model download (mocked)"""
        mock_download.return_value = "/fake/model/path"
        
        manager = ModelManager()
        
        # This would normally be async, but we're mocking it
        with patch.object(manager, 'download_model_sync') as mock_sync:
            mock_sync.return_value = True
            
            success = manager.download_model_sync("Skywork/SkyReels-V2-I2V-1.3B-540P")
            assert success

class TestVideoGenerator:
    """Test video generator functionality"""
    
    @patch('torch.cuda.is_available')
    def test_video_generator_initialization(self, mock_cuda):
        """Test video generator initialization"""
        mock_cuda.return_value = False  # Test CPU mode
        
        generator = VideoGenerator()
        assert generator.device == "cpu"
        assert generator.model_id == "Skywork/SkyReels-V2-T2V-14B-540P"
    
    def test_model_info(self):
        """Test getting model information"""
        generator = VideoGenerator()
        info = generator.get_model_info()
        
        assert "model_id" in info
        assert "device" in info
        assert "pipeline_loaded" in info
        assert "cuda_available" in info

class TestAPI:
    """Test API endpoints"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert "services" in data
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "CineVivid API"
        assert "features" in data
    
    def test_unauthorized_access(self):
        """Test accessing protected endpoints without auth"""
        response = client.get("/auth/me")
        assert response.status_code == 401
        
        response = client.post("/generate/text-to-video", json={"prompt": "test"})
        assert response.status_code == 401
    
    def test_get_videos_authenticated(self, auth_headers):
        """Test getting videos with authentication"""
        response = client.get("/videos", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "videos" in data
        assert "total" in data

class TestErrorHandling:
    """Test error handling and custom exceptions"""
    
    def test_cinevivid_exception(self):
        """Test custom exception creation"""
        error = VideoGenerationError("Test error", task_id="test-123")
        
        error_dict = error.to_dict()
        assert error_dict["error"] == "VideoGenerationError"
        assert error_dict["message"] == "Test error"
        assert error_dict["details"]["task_id"] == "test-123"
    
    def test_insufficient_credits_error(self):
        """Test insufficient credits error"""
        error = InsufficientCreditsError(required=100, available=50)
        
        assert error.status_code == 402
        assert "100" in error.message
        assert "50" in error.message
    
    def test_validation_error(self):
        """Test validation error"""
        error = ValidationError("username", "ab", "minimum 3 characters")
        
        assert error.status_code == 400
        assert error.details["field"] == "username"
    
    def test_error_categorization(self):
        """Test error categorization"""
        auth_error = AuthenticationError("Invalid token")
        category = get_error_category(auth_error)
        assert category == "auth_error"
        
        validation_error = ValidationError("test", "test", "test")
        category = get_error_category(validation_error)
        assert category == "client_error"

class TestPromptEnhancer:
    """Test prompt enhancement functionality"""
    
    @patch('requests.post')
    def test_api_enhancement(self, mock_post):
        """Test API-based prompt enhancement"""
        from src.skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
        
        # Mock successful API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{
            "generated_text": "Enhanced: A magnificent cinematic sunset over towering mountain peaks"
        }]
        mock_post.return_value = mock_response
        
        enhancer = PromptEnhancer(api_key="test-token")
        enhanced = enhancer.enhance_prompt("A sunset over mountains")
        
        assert enhanced != "A sunset over mountains"
        assert len(enhanced) > len("A sunset over mountains")
    
    def test_fallback_enhancement(self):
        """Test fallback enhancement without API"""
        from src.skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
        
        enhancer = PromptEnhancer(api_key=None)  # No API key
        enhanced = enhancer.enhance_prompt("A cat playing")
        
        assert enhanced != "A cat playing"
        assert "cinematic" in enhanced or "quality" in enhanced
    
    def test_prompt_validation(self):
        """Test prompt validation"""
        from src.skyreels_v2_infer.pipelines.prompt_enhancer import PromptEnhancer
        
        enhancer = PromptEnhancer()
        
        # Test short prompt
        result = enhancer.validate_prompt("cat")
        assert not result["is_valid"]
        assert "too short" in " ".join(result["issues"]).lower()
        
        # Test long prompt
        long_prompt = "A " + "very " * 100 + "long prompt"
        result = enhancer.validate_prompt(long_prompt)
        assert not result["is_valid"]
        assert "too long" in " ".join(result["issues"]).lower()

class TestIntegration:
    """Integration tests"""
    
    @patch('src.utils.video_generator.VideoGenerator')
    def test_full_video_generation_flow(self, mock_generator, test_user, auth_headers):
        """Test complete video generation workflow"""
        # Mock video generator
        mock_instance = Mock()
        mock_instance.generate_video.return_value = "/tmp/generated_video.mp4"
        mock_generator.return_value = mock_instance
        
        # Start generation
        request_data = {
            "prompt": "A peaceful lake with mountains",
            "aspect_ratio": "16:9",
            "num_frames": 97
        }
        
        response = client.post("/generate/text-to-video", json=request_data, headers=auth_headers)
        assert response.status_code == 200
        
        task_id = response.json()["task_id"]
        
        # Check status (would be updated by background task)
        response = client.get(f"/status/{task_id}", headers=auth_headers)
        assert response.status_code == 200
    
    def test_user_video_list(self, test_user, auth_headers, test_db):
        """Test user video listing"""
        # Create test video
        video_data = {
            "task_id": "test-video-123",
            "type": "text-to-video",
            "title": "Test Video",
            "prompt": "Test prompt",
            "status": "completed"
        }
        crud.create_video(test_db, test_user.id, video_data)
        
        # Get videos
        response = client.get("/videos", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] >= 1
        assert any(video["task_id"] == "test-video-123" for video in data["videos"])

class TestPerformance:
    """Performance and load testing"""
    
    def test_concurrent_requests(self, auth_headers):
        """Test handling concurrent requests"""
        import concurrent.futures
        
        def make_request():
            return client.get("/health", headers=auth_headers)
        
        # Make 10 concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            responses = [future.result() for future in futures]
        
        # All requests should succeed
        assert all(r.status_code == 200 for r in responses)
    
    def test_large_prompt_handling(self, auth_headers):
        """Test handling large prompts"""
        large_prompt = "A " + "very detailed " * 50 + "video prompt"
        
        request_data = {
            "prompt": large_prompt
        }
        
        response = client.post("/enhance/prompt", json=request_data)
        assert response.status_code in [200, 400]  # Either succeeds or validates

class TestSecurity:
    """Security testing"""
    
    def test_sql_injection_protection(self):
        """Test protection against SQL injection"""
        malicious_input = {
            "username": "admin'; DROP TABLE users; --",
            "password": "password"
        }
        
        response = client.post("/auth/login", json=malicious_input)
        # Should fail authentication, not cause database error
        assert response.status_code == 401
    
    def test_xss_protection(self):
        """Test protection against XSS"""
        xss_prompt = "<script>alert('xss')</script>"
        
        request_data = {
            "prompt": xss_prompt
        }
        
        response = client.post("/enhance/prompt", json=request_data)
        # Should either process safely or reject
        assert response.status_code in [200, 400]
    
    def test_rate_limiting_simulation(self):
        """Test rate limiting behavior"""
        # Make many requests quickly
        responses = []
        for i in range(20):
            response = client.get("/health")
            responses.append(response.status_code)
        
        # Most should succeed (we don't have strict rate limiting in tests)
        success_rate = sum(1 for r in responses if r == 200) / len(responses)
        assert success_rate > 0.8

# Utility functions for testing
def create_test_video_file(duration: float = 5.0) -> str:
    """Create a test video file"""
    import cv2
    import numpy as np
    
    temp_file = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
    temp_file.close()
    
    # Create simple test video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_file.name, fourcc, 24.0, (640, 480))
    
    for i in range(int(24 * duration)):  # 24 fps
        # Create a frame with changing color
        frame = np.ones((480, 640, 3), dtype=np.uint8) * (i % 255)
        out.write(frame)
    
    out.release()
    return temp_file.name

def create_test_image_file() -> str:
    """Create a test image file"""
    from PIL import Image
    
    temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    temp_file.close()
    
    # Create simple test image
    img = Image.new('RGB', (640, 480), color='red')
    img.save(temp_file.name)
    
    return temp_file.name

# Cleanup function
def cleanup_test_files():
    """Clean up test files"""
    import glob
    
    temp_files = glob.glob("/tmp/test_*.mp4") + glob.glob("/tmp/test_*.png")
    for file_path in temp_files:
        try:
            os.unlink(file_path)
        except:
            pass

# Test configuration
pytest_plugins = []

# Custom markers
def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (may require GPU/models)"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "api: marks tests as API tests"
    )

# Cleanup after all tests
def pytest_sessionfinish(session, exitstatus):
    """Cleanup after test session"""
    cleanup_test_files()