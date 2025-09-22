"""
Audio library for sound effects and music
"""
import os
from typing import List, Dict, Any
from pathlib import Path

# Mock audio library (in production, this would be a database)
AUDIO_LIBRARY = {
    "sound_effects": [
        {
            "id": "se_001",
            "name": "Applause",
            "category": "crowd",
            "duration": 3.2,
            "tags": ["applause", "cheer", "positive"],
            "url": "/audio/sound_effects/applause.mp3",
            "preview_url": "/audio/previews/applause_preview.mp3"
        },
        {
            "id": "se_002",
            "name": "Explosion",
            "category": "action",
            "duration": 1.8,
            "tags": ["explosion", "boom", "action"],
            "url": "/audio/sound_effects/explosion.mp3",
            "preview_url": "/audio/previews/explosion_preview.mp3"
        },
        {
            "id": "se_003",
            "name": "Magic Sparkle",
            "category": "fantasy",
            "duration": 2.1,
            "tags": ["magic", "sparkle", "fantasy"],
            "url": "/audio/sound_effects/magic.mp3",
            "preview_url": "/audio/previews/magic_preview.mp3"
        },
        {
            "id": "se_004",
            "name": "Footsteps",
            "category": "movement",
            "duration": 4.5,
            "tags": ["footsteps", "walking", "movement"],
            "url": "/audio/sound_effects/footsteps.mp3",
            "preview_url": "/audio/previews/footsteps_preview.mp3"
        },
        {
            "id": "se_005",
            "name": "Door Knock",
            "category": "household",
            "duration": 1.2,
            "tags": ["door", "knock", "household"],
            "url": "/audio/sound_effects/door_knock.mp3",
            "preview_url": "/audio/previews/door_knock_preview.mp3"
        }
    ],
    "music": [
        {
            "id": "bgm_001",
            "name": "Epic Cinematic",
            "category": "cinematic",
            "duration": 120.0,
            "bpm": 120,
            "mood": "epic",
            "tags": ["epic", "cinematic", "orchestral"],
            "url": "/audio/music/epic_cinematic.mp3",
            "preview_url": "/audio/previews/epic_cinematic_preview.mp3"
        },
        {
            "id": "bgm_002",
            "name": "Upbeat Pop",
            "category": "pop",
            "duration": 180.0,
            "bpm": 128,
            "mood": "energetic",
            "tags": ["pop", "upbeat", "energetic"],
            "url": "/audio/music/upbeat_pop.mp3",
            "preview_url": "/audio/previews/upbeat_pop_preview.mp3"
        },
        {
            "id": "bgm_003",
            "name": "Ambient Corporate",
            "category": "ambient",
            "duration": 240.0,
            "bpm": 90,
            "mood": "professional",
            "tags": ["ambient", "corporate", "professional"],
            "url": "/audio/music/ambient_corporate.mp3",
            "preview_url": "/audio/previews/ambient_corporate_preview.mp3"
        },
        {
            "id": "bgm_004",
            "name": "Happy Acoustic",
            "category": "acoustic",
            "duration": 150.0,
            "bpm": 110,
            "mood": "happy",
            "tags": ["acoustic", "happy", "uplifting"],
            "url": "/audio/music/happy_acoustic.mp3",
            "preview_url": "/audio/previews/happy_acoustic_preview.mp3"
        },
        {
            "id": "bgm_005",
            "name": "Suspense Thriller",
            "category": "suspense",
            "duration": 200.0,
            "bpm": 95,
            "mood": "tense",
            "tags": ["suspense", "thriller", "tense"],
            "url": "/audio/music/suspense_thriller.mp3",
            "preview_url": "/audio/previews/suspense_thriller_preview.mp3"
        }
    ]
}

def get_sound_effects(category: str = None, search: str = None) -> List[Dict[str, Any]]:
    """Get sound effects, optionally filtered by category or search term"""
    effects = AUDIO_LIBRARY["sound_effects"]

    if category:
        effects = [e for e in effects if e["category"] == category]

    if search:
        search_lower = search.lower()
        effects = [e for e in effects if
                  search_lower in e["name"].lower() or
                  any(search_lower in tag for tag in e["tags"])]

    return effects

def get_music_tracks(category: str = None, mood: str = None, search: str = None) -> List[Dict[str, Any]]:
    """Get music tracks, optionally filtered by category, mood, or search term"""
    tracks = AUDIO_LIBRARY["music"]

    if category:
        tracks = [t for t in tracks if t["category"] == category]

    if mood:
        tracks = [t for t in tracks if t["mood"] == mood]

    if search:
        search_lower = search.lower()
        tracks = [t for t in tracks if
                 search_lower in t["name"].lower() or
                 any(search_lower in tag for tag in t["tags"])]

    return tracks

def get_audio_categories() -> Dict[str, List[str]]:
    """Get available categories for sound effects and music"""
    se_categories = list(set(e["category"] for e in AUDIO_LIBRARY["sound_effects"]))
    music_categories = list(set(t["category"] for t in AUDIO_LIBRARY["music"]))
    music_moods = list(set(t["mood"] for t in AUDIO_LIBRARY["music"]))

    return {
        "sound_effects": se_categories,
        "music_categories": music_categories,
        "music_moods": music_moods
    }

def get_audio_by_id(audio_id: str) -> Dict[str, Any]:
    """Get audio file by ID"""
    # Search in sound effects
    for effect in AUDIO_LIBRARY["sound_effects"]:
        if effect["id"] == audio_id:
            return effect

    # Search in music
    for track in AUDIO_LIBRARY["music"]:
        if track["id"] == audio_id:
            return track

    return None

def search_audio(query: str, audio_type: str = "all") -> List[Dict[str, Any]]:
    """Search audio files by query"""
    results = []

    if audio_type in ["all", "sound_effects"]:
        results.extend(get_sound_effects(search=query))

    if audio_type in ["all", "music"]:
        results.extend(get_music_tracks(search=query))

    return results