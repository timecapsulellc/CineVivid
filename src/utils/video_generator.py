import os
import sys
import torch
import imageio
from diffusers.utils import load_image
import subprocess
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add path to skyreels_v2_infer
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

try:
    from skyreels_v2_infer import DiffusionForcingPipeline
    from skyreels_v2_infer.modules import download_model
    try:
        from skyreels_v2_infer.pipelines import PromptEnhancer
    except ImportError:
        logger.warning("PromptEnhancer not available, using fallback")
        PromptEnhancer = None
    SKYREELS_AVAILABLE = True
except ImportError as e:
    logger.error(f"SkyReels-V2 not available: {e}")
    SKYREELS_AVAILABLE = False
    DiffusionForcingPipeline = None
    PromptEnhancer = None

from .voiceover_generator import VoiceoverGenerator

class VideoGenerator:
    def __init__(self, model_id="Skywork/SkyReels-V2-DF-1.3B-540P", resolution="540P", device="auto"):
        self.model_id = model_id
        self.resolution = resolution
        self.available = SKYREELS_AVAILABLE

        if device == "auto":
            if torch.cuda.is_available():
                device = "cuda"
            elif torch.backends.mps.is_available():
                device = "mps"
            else:
                device = "cpu"

        self.device = torch.device(device)
        self.dtype = torch.bfloat16 if device != "cpu" else torch.float32

        if self.available:
            try:
                logger.info(f"Loading SkyReels-V2 model {model_id} on {self.device}")
                # Note: Requires Hugging Face authentication. Run 'huggingface-cli login' with your token.
                downloaded_model = download_model(model_id)

                self.pipe = DiffusionForcingPipeline(
                    downloaded_model,
                    dit_path=downloaded_model,
                    device=self.device,
                    weight_dtype=self.dtype,
                    use_usp=False,  # Disable USP for simplicity
                    offload=False,
                )
                logger.info("SkyReels-V2 model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load SkyReels-V2 model: {e}")
                self.available = False
                self.pipe = None
        else:
            logger.warning("SkyReels-V2 not available, using mock generation")
            self.pipe = None

        # Optional: load prompt enhancer
        self.prompt_enhancer = None
        if PromptEnhancer:
            try:
                self.prompt_enhancer = PromptEnhancer()
                logger.info("Prompt enhancer loaded successfully")
            except Exception as e:
                logger.warning(f"Prompt enhancer not available: {e}")

        # Initialize voiceover generator
        try:
            self.voiceover_generator = VoiceoverGenerator()
            logger.info("Voiceover generator initialized")
        except Exception as e:
            logger.error(f"Voiceover generator failed: {e}")
            self.voiceover_generator = None

    def enhance_prompt(self, prompt):
        if self.prompt_enhancer:
            return self.prompt_enhancer(prompt)
        return prompt

    def generate_video(self, prompt, num_frames=97, fps=24, seed=None, guidance_scale=6.0, image=None, voiceover_text=None, voice_id=None):
        # Check if SkyReels-V2 is available
        if not self.available or not self.pipe:
            logger.warning("SkyReels-V2 not available, generating mock video")
            return self._generate_mock_video(prompt, num_frames, fps, voiceover_text, voice_id)

        if self.resolution == "540P":
            height, width = 544, 960
        elif self.resolution == "720P":
            height, width = 720, 1280
        else:
            height, width = 544, 960

        enhanced_prompt = self.enhance_prompt(prompt)
        logger.info(f"Generating video for prompt: {enhanced_prompt[:100]}...")

        if seed is None:
            import random
            import time
            random.seed(time.time())
            seed = int(random.randrange(4294967294))

        generator = torch.Generator(device=self.device).manual_seed(seed)

        negative_prompt = "色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走"

        if image:
            try:
                image = load_image(image)
                from skyreels_v2_infer.pipelines.image2video_pipeline import resizecrop
                image = resizecrop(image, height, width).convert("RGB")
                logger.info("Image loaded and processed for I2V generation")
            except Exception as e:
                logger.error(f"Failed to process image: {e}")
                image = None

        try:
            with torch.no_grad():
                video_frames = self.pipe(
                    prompt=enhanced_prompt,
                    negative_prompt=negative_prompt,
                    image=image,
                    height=height,
                    width=width,
                    num_frames=num_frames,
                    num_inference_steps=30,
                    guidance_scale=guidance_scale,
                    generator=generator,
                )[0]
            logger.info("Video generation completed successfully")
        except Exception as e:
            logger.error(f"Video generation failed: {e}")
            return self._generate_mock_video(prompt, num_frames, fps, voiceover_text, voice_id)

        # Save to videos directory
        videos_dir = os.path.join(os.path.dirname(__file__), "../models/videos")
        os.makedirs(videos_dir, exist_ok=True)

        import time
        current_time = time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())
        video_filename = f"{prompt[:50].replace('/', '').replace(' ', '_')}_{seed}_{current_time}.mp4"
        output_path = os.path.join(videos_dir, video_filename)

        # Create video without audio first
        temp_video_path = output_path.replace('.mp4', '_temp.mp4')
        imageio.mimwrite(temp_video_path, video_frames, fps=fps, quality=8, output_params=["-loglevel", "error"])

        # Add voiceover if requested
        if voiceover_text and self.voiceover_generator:
            audio_path = self.voiceover_generator.generate_voiceover(voiceover_text, voice_id or "21m00Tcm4TlvDq8ikWAM")
            if audio_path:
                # Merge video and audio using FFmpeg
                try:
                    result = subprocess.run([
                        'ffmpeg', '-y', '-i', temp_video_path, '-i', audio_path,
                        '-c:v', 'copy', '-c:a', 'aac', '-shortest', output_path
                    ], capture_output=True, text=True)

                    if result.returncode == 0:
                        print(f"Successfully added voiceover to video: {output_path}")
                        # Clean up temp files
                        os.remove(temp_video_path)
                        os.remove(audio_path)
                    else:
                        print(f"FFmpeg failed: {result.stderr}")
                        # Fallback to video without audio
                        os.rename(temp_video_path, output_path)
                        os.remove(audio_path)
                except Exception as e:
                    print(f"Failed to merge audio: {e}")
                    # Fallback to video without audio
                    os.rename(temp_video_path, output_path)
            else:
                # No audio generated, use video as-is
                os.rename(temp_video_path, output_path)
        else:
            # No voiceover requested, use video as-is
            os.rename(temp_video_path, output_path)

        return output_path

    def _generate_mock_video(self, prompt, num_frames, fps, voiceover_text=None, voice_id=None):
        """Generate a mock video when SkyReels-V2 is not available"""
        logger.info("Generating mock video for demonstration purposes")

        # Create a simple animated video (color gradient animation)
        import numpy as np

        height, width = 544, 960  # 540P resolution
        frames = []

        for i in range(num_frames):
            # Create a gradient that changes over time
            gradient = np.zeros((height, width, 3), dtype=np.uint8)

            # Create animated gradient
            r = int(255 * (0.5 + 0.5 * np.sin(i / 10)))
            g = int(255 * (0.5 + 0.5 * np.sin(i / 10 + 2)))
            b = int(255 * (0.5 + 0.5 * np.sin(i / 10 + 4)))

            for y in range(height):
                for x in range(width):
                    gradient[y, x] = [r, g, b]

            # Add some text overlay (mock)
            # For simplicity, we'll just use the gradient

            frames.append(gradient)

        # Save to videos directory
        videos_dir = os.path.join(os.path.dirname(__file__), "../models/videos")
        os.makedirs(videos_dir, exist_ok=True)

        import time
        current_time = time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())
        video_filename = f"mock_{prompt[:30].replace(' ', '_')}_{current_time}.mp4"
        output_path = os.path.join(videos_dir, video_filename)

        # Create video without audio first
        temp_video_path = output_path.replace('.mp4', '_temp.mp4')
        imageio.mimwrite(temp_video_path, frames, fps=fps, quality=8, output_params=["-loglevel", "error"])

        # Add voiceover if requested
        if voiceover_text and self.voiceover_generator:
            audio_path = self.voiceover_generator.generate_voiceover(voiceover_text, voice_id or "21m00Tcm4TlvDq8ikWAM")
            if audio_path:
                # Merge video and audio using FFmpeg
                try:
                    result = subprocess.run([
                        'ffmpeg', '-y', '-i', temp_video_path, '-i', audio_path,
                        '-c:v', 'copy', '-c:a', 'aac', '-shortest', output_path
                    ], capture_output=True, text=True)

                    if result.returncode == 0:
                        logger.info(f"Successfully added voiceover to mock video: {output_path}")
                        # Clean up temp files
                        os.remove(temp_video_path)
                        os.remove(audio_path)
                    else:
                        logger.warning(f"FFmpeg failed for mock video: {result.stderr}")
                        # Fallback to video without audio
                        os.rename(temp_video_path, output_path)
                        os.remove(audio_path)
                except Exception as e:
                    logger.error(f"Failed to merge audio to mock video: {e}")
                    # Fallback to video without audio
                    os.rename(temp_video_path, output_path)
            else:
                # No audio generated, use video as-is
                os.rename(temp_video_path, output_path)
        else:
            # No voiceover requested, use video as-is
            os.rename(temp_video_path, output_path)

        logger.info(f"Mock video generated: {output_path}")
        return output_path