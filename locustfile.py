from locust import HttpUser, task, between
import json
import uuid

class CineVividUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Login and get token on start"""
        self.token = None
        try:
            response = self.client.post("/auth/login", data={
                "username": "testuser",
                "password": "testpass"
            })
            if response.status_code == 200:
                self.token = response.json()["access_token"]
                self.client.headers.update({"Authorization": f"Bearer {self.token}"})
        except:
            pass  # Continue without auth for public endpoints

    @task(3)
    def health_check(self):
        """Test health endpoint"""
        self.client.get("/health")

    @task(2)
    def get_root(self):
        """Test root endpoint"""
        self.client.get("/")

    @task(1)
    def enhance_prompt(self):
        """Test prompt enhancement"""
        if self.token:
            self.client.post("/enhance/prompt", json={
                "prompt": "A beautiful sunset over mountains"
            })

    @task(2)
    def generate_text_to_video(self):
        """Test T2V generation (light load)"""
        if self.token:
            prompt = f"A cinematic scene of {uuid.uuid4().hex[:8]}"
            self.client.post("/generate/text-to-video", json={
                "prompt": prompt,
                "duration": 3,  # Shorter for load testing
                "aspect_ratio": "16:9"
            })

    @task(1)
    def get_videos(self):
        """Test getting user videos"""
        if self.token:
            self.client.get("/videos")

    @task(1)
    def get_credits(self):
        """Test getting user credits"""
        if self.token:
            self.client.get("/auth/credits")