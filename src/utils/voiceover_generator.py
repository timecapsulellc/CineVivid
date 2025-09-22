import os
import tempfile
from elevenlabs import ElevenLabs
from typing import Optional

class VoiceoverGenerator:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ELEVENLABS_API_KEY")
        if not self.api_key:
            print("Warning: No ElevenLabs API key provided. Voiceover generation will be disabled.")
            self.client = None
        else:
            self.client = ElevenLabs(api_key=self.api_key)

    def generate_voiceover(self, text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM", model: str = "eleven_monolingual_v1") -> Optional[str]:
        """
        Generate voiceover audio from text using ElevenLabs.

        Args:
            text: The text to convert to speech
            voice_id: ElevenLabs voice ID (default: Rachel)
            model: TTS model to use

        Returns:
            Path to generated audio file, or None if failed
        """
        if not self.client:
            print("ElevenLabs client not initialized. Skipping voiceover generation.")
            return None

        try:
            # Generate audio
            audio_generator = self.client.generate(
                text=text,
                voice=voice_id,
                model=model
            )

            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
                output_path = f.name

            # Write audio data
            with open(output_path, 'wb') as f:
                for chunk in audio_generator:
                    f.write(chunk)

            print(f"Voiceover generated successfully: {output_path}")
            return output_path

        except Exception as e:
            print(f"Failed to generate voiceover: {e}")
            return None

    def get_available_voices(self):
        """Get list of available voices from ElevenLabs."""
        if not self.client:
            return []

        try:
            voices = self.client.voices.get_all()
            return [{"id": voice.voice_id, "name": voice.name} for voice in voices.voices]
        except Exception as e:
            print(f"Failed to get voices: {e}")
            return []