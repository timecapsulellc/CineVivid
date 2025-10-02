#!/usr/bin/env python3
"""
Comprehensive AI Functions Testing Script
Tests all CineVivid AI tools for functionality and performance
"""
import requests
import time
import json
import sys
from typing import Dict, Any

class CineVividTester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()
        
    def authenticate(self) -> bool:
        """Authenticate with demo account"""
        try:
            response = self.session.post(f"{self.base_url}/auth/login", json={
                "username": "demo",
                "password": "demo123"
            })
            
            if response.status_code == 200:
                self.token = response.json()["access_token"]
                self.session.headers.update({"Authorization": f"Bearer {self.token}"})
                print("✅ Authentication successful")
                return True
            else:
                print(f"❌ Authentication failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Authentication error: {e}")
            return False
    
    def test_health(self) -> bool:
        """Test system health"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                health = response.json()
                print(f"✅ System Health: {health['status']}")
                print(f"   Database: {health['services']['database']}")
                print(f"   GPU: {health['services'].get('gpu', False)}")
                return health['status'] in ['healthy', 'degraded']
            return False
        except Exception as e:
            print(f"❌ Health check failed: {e}")
            return False
    
    def test_text_to_video(self) -> bool:
        """Test AI Video generation"""
        print("\n🎬 Testing AI Video (Text-to-Video)...")
        
        try:
            response = self.session.post(f"{self.base_url}/generate/text-to-video", json={
                "prompt": "A beautiful sunset over mountains",
                "aspect_ratio": "16:9", 
                "num_frames": 25,  # Short for testing
                "enhance_prompt": True
            })
            
            if response.status_code == 200:
                task_data = response.json()
                print(f"✅ Video generation started: {task_data['task_id']}")
                print(f"   Estimated time: {task_data['estimated_time']}")
                print(f"   Cost: {task_data['cost']} credits")
                return True  # Don't wait for completion in test
            else:
                print(f"❌ Video generation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Video generation error: {e}")
            return False
    
    def test_prompt_enhancement(self) -> bool:
        """Test prompt enhancement"""
        print("\n💡 Testing Prompt Enhancement...")
        
        try:
            response = self.session.post(f"{self.base_url}/enhance/prompt", json={
                "prompt": "A cat playing in garden",
                "style": "cinematic"
            })
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Prompt enhanced successfully")
                print(f"   Original: {result['original_prompt']}")
                print(f"   Enhanced: {result['enhanced_prompt']}")
                return True
            else:
                print(f"❌ Prompt enhancement failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Prompt enhancement error: {e}")
            return False
    
    def run_all_tests(self) -> Dict[str, bool]:
        """Run comprehensive test suite"""
        print("🧪 Starting CineVivid AI Tools Testing...")
        print("=" * 50)
        
        results = {}
        
        # Authentication test
        results['authentication'] = self.authenticate()
        if not results['authentication']:
            print("❌ Cannot proceed without authentication")
            return results
        
        # System health test
        results['health'] = self.test_health()
        results['prompt_enhancement'] = self.test_prompt_enhancement()
        results['text_to_video'] = self.test_text_to_video()
        
        # Print summary
        print("\n" + "=" * 50)
        print("🎯 TESTING RESULTS SUMMARY")
        print("=" * 50)
        
        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name.upper():<20} {status}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed ({passed_tests/total_tests*100:.1f}%)")
        
        return results

if __name__ == "__main__":
    tester = CineVividTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    passed_rate = sum(1 for result in results.values() if result) / len(results)
    sys.exit(0 if passed_rate >= 0.8 else 1)