# Global data storage (in production, use database)
videos_db = []
lora_models_db = [
    {
        "id": 1,
        "name": "Realistic Portrait v2.1",
        "description": "High-quality realistic portrait generation with natural lighting",
        "category": "portraits",
        "author": "SkyReels Team",
        "downloads": 15420,
        "rating": 4.8,
        "tags": ["realistic", "portrait", "photography"],
        "baseModel": "SDXL 1.0",
        "triggerWords": "photorealistic, detailed face, natural lighting"
    },
    {
        "id": 2,
        "name": "Anime Style Pro",
        "description": "Professional anime and manga style character generation",
        "category": "anime",
        "author": "AnimeMaster",
        "downloads": 8920,
        "rating": 4.6,
        "tags": ["anime", "manga", "characters"],
        "baseModel": "SDXL 1.0",
        "triggerWords": "anime style, detailed eyes, vibrant colors"
    }
]