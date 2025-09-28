"""
Video Generator for CineVivid
Integrates with SkyReels-V2 for AI video generation
"""
import os
import torch
import logging
from pathlib import Path
from typing import Optional, Dict, Any
import tempfile
import shutil

logger = logging.getLogger(__name__)

class VideoGenerator:
    """
    Video generator using SkyReels-V2 models
    """

    def __init__(self, model_id: str = "Skywork/SkyReels-V2-T2V-14B-540P"):
        """
        Initialize the video generator

        Args:
            model_id: HuggingFace model ID for SkyReels-V2
        """
        self.model_id = model_id
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipeline = None
        self.temp_dir = Path("../temp")
        self.temp_dir.mkdir(exist_ok=True)

        logger.info(f"Initializing VideoGenerator with model: {model_id}")
        logger.info(f"Using device: {self.device}")

    def _load_pipeline(self):
        """Lazy load the diffusion pipeline"""
        if self.pipeline is None:
            try:
                from diffusers import SkyReelsV2Pipeline, UniPCMultistepScheduler

                logger.info("Loading SkyReels-V2 pipeline...")
                self.pipeline = SkyReelsV2Pipeline.from_pretrained(
                    self.model_id,
                    torch_dtype=torch.bfloat16 if self.device == "cuda" else torch.float32,
                    safety_checker=None,
                    requires_safety_checker=False
                )

                # Set scheduler
                flow_shift = 8.0  # T2V
                self.pipeline.scheduler = UniPCMultistepScheduler.from_config(
                    self.pipeline.scheduler.config, flow_shift=flow_shift
                )

                if self.device == "cuda":
                    self.pipeline = self.pipeline.to(self.device)

                logger.info("Pipeline loaded successfully")

            except Exception as e:
                logger.error(f"Failed to load pipeline: {e}")
                raise

    def generate_video(
        self,
        prompt: str,
        num_frames: int = 97,
        fps: int = 24,
        aspect_ratio: str = "16:9",
        guidance_scale: float = 6.0,
        **kwargs
    ) -> str:
        """
        Generate video from text prompt

        Args:
            prompt: Text description for video generation
            num_frames: Number of frames (97 for 540P, 121 for 720P)
            fps: Frames per second
            aspect_ratio: Video aspect ratio
            guidance_scale: Classifier-free guidance scale

        Returns:
            Path to generated video file
        """
        try:
            self._load_pipeline()

            # Set dimensions based on aspect ratio
            if aspect_ratio == "16:9":
                height, width = 544, 960  # 540P
            elif aspect_ratio == "9:16":
                height, width = 960, 544  # Portrait
            elif aspect_ratio == "1:1":
                height, width = 544, 544  # Square
            else:
                height, width = 544, 960  # Default

            logger.info(f"Generating video: {prompt[:50]}...")
            logger.info(f"Dimensions: {height}x{width}, Frames: {num_frames}")

            # Generate video
            with torch.no_grad():
                output = self.pipeline(
                    prompt=prompt,
                    num_inference_steps=50,  # Adjust based on quality vs speed
                    height=height,
                    width=width,
                    num_frames=num_frames,
                    guidance_scale=guidance_scale,
                    **kwargs
                )

            # Save video
            output_path = self.temp_dir / f"generated_{torch.randint(0, 1000000, (1,)).item()}.mp4"

            # Export to video (using diffusers built-in export)
            from diffusers.utils import export_to_video
            export_to_video(output.frames[0], str(output_path), fps=fps)

            logger.info(f"Video generated successfully: {output_path}")
            return str(output_path)

        except Exception as e:
            logger.error(f"Video generation failed: {e}")
            raise

    def generate_video_from_image(
        self,
        image_path: str,
        prompt: str,
        num_frames: int = 97,
        fps: int = 24,
        guidance_scale: float = 5.0,
        **kwargs
    ) -> str:
        """
        Generate video from image (Image-to-Video)

        Args:
            image_path: Path to input image
            prompt: Text description for motion
            num_frames: Number of frames to generate
            fps: Frames per second
            guidance_scale: Classifier-free guidance scale

        Returns:
            Path to generated video file
        """
        try:
            from diffusers import SkyReelsV2ImageToVideoPipeline, UniPCMultistepScheduler
            from PIL import Image

            # Load I2V pipeline
            pipeline = SkyReelsV2ImageToVideoPipeline.from_pretrained(
                "Skywork/SkyReels-V2-I2V-14B-540P",
                torch_dtype=torch.bfloat16 if self.device == "cuda" else torch.float32,
                safety_checker=None,
                requires_safety_checker=False
            )

            # Set scheduler
            flow_shift = 5.0  # I2V
            pipeline.scheduler = UniPCMultistepScheduler.from_config(
                pipeline.scheduler.config, flow_shift=flow_shift
            )

            if self.device == "cuda":
                pipeline = pipeline.to(self.device)

            # Load and process image
            image = Image.open(image_path).convert("RGB")

            logger.info(f"Generating I2V video from image: {image_path}")
            logger.info(f"Prompt: {prompt[:50]}...")

            # Generate video
            with torch.no_grad():
                output = pipeline(
                    image=image,
                    prompt=prompt,
                    num_inference_steps=50,
                    num_frames=num_frames,
                    guidance_scale=guidance_scale,
                    **kwargs
                )

            # Save video
            output_path = self.temp_dir / f"i2v_{torch.randint(0, 1000000, (1,)).item()}.mp4"

            from diffusers.utils import export_to_video
            export_to_video(output.frames[0], str(output_path), fps=fps)

            logger.info(f"I2V video generated successfully: {output_path}")
            return str(output_path)

        except Exception as e:
            logger.error(f"I2V generation failed: {e}")
            raise

    def extend_video(
        self,
        video_path: str,
        extension_prompt: str = "",
        additional_frames: int = 97,
        **kwargs
    ) -> str:
        """
        Extend an existing video with additional frames

        Args:
            video_path: Path to input video
            extension_prompt: Description for extension
            additional_frames: Number of frames to add

        Returns:
            Path to extended video file
        """
        try:
            from diffusers import SkyReelsV2DiffusionForcingVideoToVideoPipeline, UniPCMultistepScheduler

            # Load V2V pipeline
            pipeline = SkyReelsV2DiffusionForcingVideoToVideoPipeline.from_pretrained(
                "Skywork/SkyReels-V2-DF-14B-540P",
                torch_dtype=torch.bfloat16 if self.device == "cuda" else torch.float32,
                safety_checker=None,
                requires_safety_checker=False
            )

            # Set scheduler
            flow_shift = 5.0  # V2V
            pipeline.scheduler = UniPCMultistepScheduler.from_config(
                pipeline.scheduler.config, flow_shift=flow_shift
            )

            if self.device == "cuda":
                pipeline = pipeline.to(self.device)

            # Load video
            from diffusers.utils import load_video
            video_frames = load_video(video_path)

            prompt = extension_prompt or "Continue the video seamlessly"

            logger.info(f"Extending video: {video_path}")

            # Generate extension
            with torch.no_grad():
                output = pipeline(
                    video=video_frames,
                    prompt=prompt,
                    num_frames=additional_frames,
                    **kwargs
                )

            # Combine original + extension
            import torch
            combined_frames = torch.cat([video_frames, output.frames[0]], dim=0)

            # Save extended video
            output_path = self.temp_dir / f"extended_{torch.randint(0, 1000000, (1,)).item()}.mp4"

            from diffusers.utils import export_to_video
            export_to_video(combined_frames, str(output_path), fps=24)

            logger.info(f"Video extended successfully: {output_path}")
            return str(output_path)

        except Exception as e:
            logger.error(f"Video extension failed: {e}")
            raise

    def apply_camera_director(
        self,
        prompt: str,
        camera_instructions: str,
        **kwargs
    ) -> str:
        """
        Apply camera director instructions to prompt

        Args:
            prompt: Base prompt
            camera_instructions: Camera movement instructions

        Returns:
            Enhanced prompt with camera directions
        """
        # Enhance prompt with camera instructions
        enhanced_prompt = f"{prompt}. {camera_instructions}"

        # Generate video with enhanced prompt
        return self.generate_video(enhanced_prompt, **kwargs)

    def cleanup_temp_files(self, older_than_hours: int = 24):
        """Clean up temporary files older than specified hours"""
        import time

        current_time = time.time()
        for file_path in self.temp_dir.glob("*"):
            if file_path.is_file():
                file_age = current_time - file_path.stat().st_mtime
                if file_age > (older_than_hours * 3600):
                    try:
                        file_path.unlink()
                        logger.info(f"Cleaned up temp file: {file_path}")
                    except Exception as e:
                        logger.warning(f"Failed to clean up {file_path}: {e}")

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model"""
        return {
            "model_id": self.model_id,
            "device": self.device,
            "pipeline_loaded": self.pipeline is not None,
            "cuda_available": torch.cuda.is_available(),
            "temp_dir": str(self.temp_dir)
        }