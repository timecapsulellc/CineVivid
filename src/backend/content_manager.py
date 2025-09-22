"""
Content Management System for CineVivid
Handles dynamic content for landing page, dashboard, tools, etc.
"""
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

CONTENT_DIR = Path("content")
CONTENT_DIR.mkdir(exist_ok=True)

# Default preview content (royalty-free assets for demo)
DEFAULT_CONTENT = {
    "landing": {
        "hero": {
            "title": "🎬 AI Video Creation Made Simple",
            "subtitle": "Transform your wildest ideas into cinematic masterpieces with AI-powered video generation and camera controls. Create professional content in minutes, not hours.",
            "background_image": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop",
            "cta_primary": "Start Creating Free",
            "cta_secondary": "Watch Demo"
        },
        "stats": [
            {"value": "10K+", "label": "Videos Created", "icon": "VideoLibrary"},
            {"value": "50K+", "label": "Happy Users", "icon": "People"},
            {"value": "99%", "label": "Success Rate", "icon": "CheckCircle"},
            {"value": "24/7", "label": "AI Processing", "icon": "TrendingUp"}
        ],
        "features": [
            {
                "icon": "VideoLibrary",
                "title": "🎬 Text to Video",
                "description": "Transform your wildest ideas into cinematic masterpieces with AI-powered video generation and camera controls",
                "popular": True
            },
            {
                "icon": "Image",
                "title": "🎭 Image to Video",
                "description": "Bring static photos to life with natural motion, perfect for social media magic",
                "popular": True
            },
            {
                "icon": "Mic",
                "title": "🎤 Voiceover & Lip Sync",
                "description": "Add professional voiceovers and perfect lip sync with 100+ AI voices",
                "popular": True
            },
            {
                "icon": "Movie",
                "title": "🎭 Short Film Creator",
                "description": "Craft complete short films with AI scene planning, character development, and cinematic storytelling",
                "popular": False
            },
            {
                "icon": "PlayArrow",
                "title": "🎭 Talking Avatar",
                "description": "Create animated avatars that speak your text with natural expressions and voice cloning",
                "popular": False
            },
            {
                "icon": "Edit",
                "title": "✂️ Video Editor",
                "description": "Professional video editing with trim, transitions, text overlays, and export options",
                "popular": False
            }
        ],
        "testimonials": [
            {
                "name": "Sarah Chen",
                "role": "🎬 Content Creator",
                "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                "content": "🚀 CineVivid transformed my content creation workflow! What used to take hours now takes minutes. The AI quality is absolutely incredible! 🎨",
                "rating": 5,
                "company": "YouTube Creator"
            },
            {
                "name": "Marcus Johnson",
                "role": "📈 Marketing Director",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                "content": "💼 Our marketing team creates 10x more video content now! The camera director feature gives us cinematic quality every single time. Game-changer! 🎯",
                "rating": 5,
                "company": "TechCorp Inc."
            },
            {
                "name": "Elena Rodriguez",
                "role": "🎭 Filmmaker",
                "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                "content": "🎪 As a filmmaker, I was skeptical about AI video tools. CineVivid proved me completely wrong! The short film creator is an absolute game-changer. 🎬",
                "rating": 5,
                "company": "Independent Films"
            }
        ],
        "recent_creations": [
            {
                "id": 1,
                "title": "🚀 Futuristic Cityscape Animation",
                "thumbnail": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
                "duration": "00:15",
                "views": "12.1K",
                "likes": 892,
                "creator": "Alex Chen"
            },
            {
                "id": 2,
                "title": "🌅 Majestic Mountain Sunrise",
                "thumbnail": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                "duration": "00:20",
                "views": "25.2K",
                "likes": 1234,
                "creator": "Sarah Mitchell"
            },
            {
                "id": 3,
                "title": "🏙️ Neon Night City Exploration",
                "thumbnail": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop",
                "duration": "00:12",
                "views": "18.8K",
                "likes": 756,
                "creator": "Marcus Rodriguez"
            }
        ]
    },
    "dashboard": {
        "welcome_message": "Welcome back! Ready to create amazing videos?",
        "stats": {
            "total_videos": 0,
            "total_views": 0,
            "total_likes": 0,
            "storage_used": "0 MB"
        },
        "sample_videos": [
            {
                "id": 1,
                "title": "🦅 Majestic Eagle Soaring",
                "thumbnail": "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=300&fit=crop",
                "status": "completed",
                "duration": "5s",
                "createdAt": "2024-01-15",
                "prompt": "A majestic eagle soaring through mountain peaks at sunset",
                "likes": 42,
                "views": "1.2K"
            },
            {
                "id": 2,
                "title": "🏙️ Urban Cityscape Dreams",
                "thumbnail": "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop",
                "status": "completed",
                "duration": "10s",
                "createdAt": "2024-01-14",
                "prompt": "Urban cityscape at night with neon lights and flying cars",
                "likes": 89,
                "views": "3.5K"
            }
        ]
    },
    "tools": {
        "page_title": "All Tools",
        "page_subtitle": "Powerful AI tools for every creator",
        "tools": [
            {
                "id": "to-video",
                "title": "🎬 Text to Video",
                "description": "Transform your wildest ideas into cinematic masterpieces with AI-powered video generation and camera controls",
                "icon": "VideoLibrary",
                "image": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
                "path": "/home/tools/to-video",
                "category": "Video Generation",
                "featured": True,
                "users": "50K+",
                "rating": 4.9
            },
            {
                "id": "lip-sync",
                "title": "🎤 Lip Sync Pro",
                "description": "Create hyper-realistic lip-sync videos with perfect audio-visual synchronization",
                "icon": "Mic",
                "image": "https://images.unsplash.com/photo-1489599735734-79b4dfe3b22a?w=400&h=300&fit=crop",
                "path": "/home/tools/lip-sync",
                "category": "Audio/Video",
                "featured": True,
                "users": "25K+",
                "rating": 4.8
            }
        ]
    },
    "pricing": {
        "title": "Choose Your Plan",
        "subtitle": "Start free and upgrade as you grow",
        "tiers": {
            "free": {
                "name": "Free",
                "price": 0,
                "credits": 300,
                "features": ["Basic generation", "Watermarked output", "Community support"],
                "popular": False
            },
            "pro": {
                "name": "Pro",
                "price": 19,
                "credits": 1000,
                "features": ["HD generation", "No watermarks", "Priority support", "API access"],
                "popular": True
            },
            "business": {
                "name": "Business",
                "price": 49,
                "credits": 3000,
                "features": ["4K generation", "Team collaboration", "Custom models", "Dedicated support"],
                "popular": False
            }
        }
    }
}

def get_content_section(section: str) -> Dict[str, Any]:
    """Get content for a specific section"""
    file_path = CONTENT_DIR / f"{section}.json"

    # Try to load custom content first
    if file_path.exists():
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading custom content for {section}: {e}")

    # Fall back to default preview content
    return DEFAULT_CONTENT.get(section, {})

def save_content_section(section: str, content: Dict[str, Any]) -> bool:
    """Save custom content for a section"""
    try:
        file_path = CONTENT_DIR / f"{section}.json"

        # Add metadata
        content['_metadata'] = {
            'last_updated': datetime.now().isoformat(),
            'version': '1.0'
        }

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, indent=2, ensure_ascii=False)

        return True
    except Exception as e:
        print(f"Error saving content for {section}: {e}")
        return False

def get_all_content() -> Dict[str, Any]:
    """Get all content sections"""
    sections = ['landing', 'dashboard', 'tools', 'pricing']
    return {section: get_content_section(section) for section in sections}

def reset_content_section(section: str) -> bool:
    """Reset a section to default preview content"""
    try:
        file_path = CONTENT_DIR / f"{section}.json"
        if file_path.exists():
            file_path.unlink()  # Delete custom content file
        return True
    except Exception as e:
        print(f"Error resetting content for {section}: {e}")
        return False

def backup_content() -> str:
    """Create a backup of all custom content"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = CONTENT_DIR / f"backup_{timestamp}.json"

    try:
        all_content = get_all_content()
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(all_content, f, indent=2, ensure_ascii=False)
        return str(backup_file)
    except Exception as e:
        print(f"Error creating backup: {e}")
        return ""

def restore_content(backup_file: str) -> bool:
    """Restore content from backup"""
    try:
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)

        for section, content in backup_data.items():
            save_content_section(section, content)

        return True
    except Exception as e:
        print(f"Error restoring backup: {e}")
        return False

def validate_content(section: str, content: Dict[str, Any]) -> tuple[bool, str]:
    """Validate content structure"""
    if section not in DEFAULT_CONTENT:
        return False, f"Unknown section: {section}"

    default_structure = DEFAULT_CONTENT[section]

    # Basic validation - check if required top-level keys exist
    for key in default_structure.keys():
        if key not in content:
            return False, f"Missing required key: {key}"

    return True, "Content is valid"