#!/usr/bin/env python3
"""
Comprehensive Testing Script for CineVivid Platform
Tests all major features: API endpoints, video generation, image generation, drama creation
"""

import requests
import json
import time
import sys
import os
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8001"
FRONTEND_URL = "http://localhost:1234"

class CineVividTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []

    def log_test(self, test_name: str, success: bool, message: str = "", response: Dict = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if message:
            print(f"   {message}")
        if response and not success:
            print(f"   Response: {json.dumps(response, indent=2)}")

        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response": response
        })

    def test_health_check(self):
        """Test health endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected status: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {e}")
            return False

    def test_video_generation(self):
        """Test video generation endpoint"""
        try:
            data = {
                "prompt": "A beautiful butterfly landing on a flower in a sunny garden",
                "duration": 5,
                "aspect_ratio": "16:9",
                "style": "cinematic"
            }

            response = self.session.post(
                f"{BASE_URL}/generate/video",
                json=data,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                result = response.json()
                if "task_id" in result and "status" in result:
                    task_id = result["task_id"]
                    self.log_test("Video Generation", True, f"Task created: {task_id}")
                    return task_id
                else:
                    self.log_test("Video Generation", False, "Missing task_id or status", result)
                    return None
            else:
                self.log_test("Video Generation", False, f"HTTP {response.status_code}", response.text)
                return None

        except Exception as e:
            self.log_test("Video Generation", False, f"Exception: {e}")
            return None

    def test_status_checking(self, task_id: str):
        """Test status checking for a task"""
        try:
            response = self.session.get(f"{BASE_URL}/status/{task_id}")

            if response.status_code == 200:
                result = response.json()
                status = result.get("status", "unknown")
                progress = result.get("progress", 0)

                self.log_test("Status Check", True, f"Status: {status}, Progress: {progress}%")

                # Check if task completed
                if status in ["completed", "failed"]:
                    if status == "completed" and "result" in result:
                        video_url = result["result"]
                        self.log_test("Video Completion", True, f"Video ready: {video_url}")
                        return True, video_url
                    elif status == "failed":
                        self.log_test("Video Completion", False, f"Generation failed: {result.get('error', 'Unknown error')}")
                        return False, None
                    else:
                        self.log_test("Video Completion", False, "Completed but no result URL")
                        return False, None
                else:
                    return None, None  # Still processing

            else:
                self.log_test("Status Check", False, f"HTTP {response.status_code}")
                return False, None

        except Exception as e:
            self.log_test("Status Check", False, f"Exception: {e}")
            return False, None

    def test_image_generation(self):
        """Test image generation endpoint"""
        try:
            data = {
                "prompt": "A majestic lion standing on a rock at sunset, photorealistic",
                "negative_prompt": "blurry, low quality, distorted",
                "style": "photorealistic",
                "aspect_ratio": "16:9"
            }

            response = self.session.post(
                f"{BASE_URL}/generate/image",
                json=data,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                result = response.json()
                if "task_id" in result:
                    self.log_test("Image Generation", True, f"Task created: {result['task_id']}")
                    return result["task_id"]
                else:
                    self.log_test("Image Generation", False, "Missing task_id", result)
                    return None
            else:
                self.log_test("Image Generation", False, f"HTTP {response.status_code}")
                return None

        except Exception as e:
            self.log_test("Image Generation", False, f"Exception: {e}")
            return None

    def test_drama_generation(self):
        """Test drama/short film generation"""
        try:
            data = {
                "title": "A Moment of Reflection",
                "genre": "drama",
                "scenes": [
                    {
                        "description": "A young woman sits by a window, looking thoughtful",
                        "duration": 8
                    },
                    {
                        "description": "Flashback shows her walking through an empty house",
                        "duration": 10
                    },
                    {
                        "description": "She finds an old photograph and smiles",
                        "duration": 7
                    }
                ]
            }

            response = self.session.post(
                f"{BASE_URL}/generate/short-film",
                json=data,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                result = response.json()
                if "task_id" in result:
                    self.log_test("Drama Generation", True, f"Drama task created: {result['task_id']}")
                    return result["task_id"]
                else:
                    self.log_test("Drama Generation", False, "Missing task_id", result)
                    return None
            else:
                self.log_test("Drama Generation", False, f"HTTP {response.status_code}")
                return None

        except Exception as e:
            self.log_test("Drama Generation", False, f"Exception: {e}")
            return None

    def test_video_library(self):
        """Test video library endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/videos")

            if response.status_code == 200:
                result = response.json()
                videos = result.get("videos", [])
                self.log_test("Video Library", True, f"Found {len(videos)} videos")
                return True
            else:
                self.log_test("Video Library", False, f"HTTP {response.status_code}")
                return False

        except Exception as e:
            self.log_test("Video Library", False, f"Exception: {e}")
            return False

    def test_lora_models(self):
        """Test LoRA models endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/lora-models")

            if response.status_code == 200:
                result = response.json()
                models = result.get("models", [])
                self.log_test("LoRA Models", True, f"Found {len(models)} models")
                return True
            else:
                self.log_test("LoRA Models", False, f"HTTP {response.status_code}")
                return False

        except Exception as e:
            self.log_test("LoRA Models", False, f"Exception: {e}")
            return False

    def wait_for_completion(self, task_id: str, max_wait: int = 300):
        """Wait for a task to complete"""
        print(f"\n⏳ Waiting for task {task_id} to complete...")

        for i in range(max_wait // 5):
            completed, result = self.test_status_checking(task_id)

            if completed is True:
                return True, result
            elif completed is False:
                return False, None

            time.sleep(5)

        self.log_test("Task Timeout", False, f"Task {task_id} timed out after {max_wait} seconds")
        return False, None

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🎬 CINEVID PLATFORM COMPREHENSIVE TESTING")
        print("=" * 50)

        # Test 1: Health Check
        print("\n🏥 Testing API Health...")
        if not self.test_health_check():
            print("❌ API is not healthy. Stopping tests.")
            return

        # Test 2: Video Library
        print("\n📚 Testing Video Library...")
        self.test_video_library()

        # Test 3: LoRA Models
        print("\n🤖 Testing LoRA Models...")
        self.test_lora_models()

        # Test 4: Video Generation
        print("\n🎥 Testing Video Generation...")
        video_task_id = self.test_video_generation()

        if video_task_id:
            print(f"\n🎥 Waiting for video generation (Task: {video_task_id})...")
            video_completed, video_url = self.wait_for_completion(video_task_id, 60)  # 1 minute timeout for demo

            if video_completed and video_url:
                print(f"✅ Video generated successfully: {BASE_URL}{video_url}")

                # Test video file access
                try:
                    response = self.session.head(f"{BASE_URL}{video_url}")
                    if response.status_code == 200:
                        self.log_test("Video File Access", True, "Video file is accessible")
                    else:
                        self.log_test("Video File Access", False, f"HTTP {response.status_code}")
                except Exception as e:
                    self.log_test("Video File Access", False, f"Exception: {e}")

        # Test 5: Image Generation
        print("\n🖼️ Testing Image Generation...")
        image_task_id = self.test_image_generation()

        if image_task_id:
            print(f"\n🖼️ Waiting for image generation (Task: {image_task_id})...")
            image_completed, _ = self.wait_for_completion(image_task_id, 30)  # 30 second timeout

            if image_completed:
                print("✅ Image generated successfully")

        # Test 6: Drama Generation
        print("\n🎭 Testing Drama Generation...")
        drama_task_id = self.test_drama_generation()

        if drama_task_id:
            print(f"\n🎭 Waiting for drama generation (Task: {drama_task_id})...")
            drama_completed, _ = self.wait_for_completion(drama_task_id, 120)  # 2 minute timeout

            if drama_completed:
                print("✅ Drama generated successfully")

        # Summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)

        total_tests = len(self.test_results)
        passed_tests = sum(1 for test in self.test_results if test["success"])
        failed_tests = total_tests - passed_tests

        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(".1f")

        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for test in self.test_results:
                if not test["success"]:
                    print(f"   • {test['test']}: {test['message']}")

        print("\n🎯 Next Steps:")
        if passed_tests == total_tests:
            print("   ✅ All tests passed! Your CineVivid platform is working perfectly.")
            print("   🚀 Ready for production deployment.")
        else:
            print("   🔧 Some tests failed. Check the error messages above.")
            print("   📖 Review the troubleshooting guide in the README.")

        print(f"\n🌐 Frontend: {FRONTEND_URL}")
        print(f"🔗 API Docs: {BASE_URL}/docs")
        print(f"❤️ Health Check: {BASE_URL}/health")


def main():
    """Main testing function"""
    print("🎬 CineVivid Platform Tester")
    print("Testing all features: Video, Image, Drama generation, API endpoints")
    print()

    # Check if services are running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print("❌ Backend API is not responding. Please start the backend:")
            print("   cd SkyReels-V2 && source .venv/bin/activate")
            print(f"   PYTHONPATH=/Users/dadou/cinevividn Ai/SkyReels-V2 uvicorn src.backend.app:app --reload --port 8000")
            return
    except:
        print("❌ Cannot connect to backend API. Please ensure it's running on port 8000")
        return

    # Run tests
    tester = CineVividTester()
    tester.run_all_tests()


if __name__ == "__main__":
    main()