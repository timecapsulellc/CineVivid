"""
Model Manager for CineVivid
Downloads, caches, and manages SkyReels-V2 models
"""
import os
import logging
import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Callable
import torch
from huggingface_hub import snapshot_download, login
import threading
import time
import hashlib
import json
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class ModelInfo:
    """Model information structure"""
    model_id: str
    model_type: str  # t2v, i2v, df (diffusion forcing)
    resolution: str  # 540P, 720P
    size: str       # 1.3B, 14B
    url: str
    local_path: Optional[str] = None
    is_downloaded: bool = False
    download_progress: float = 0.0
    file_size_gb: Optional[float] = None

class ModelManager:
    """
    Manages SkyReels-V2 model downloads and caching
    """
    
    # Available models configuration
    AVAILABLE_MODELS = {
        # Text-to-Video Models
        "Skywork/SkyReels-V2-T2V-14B-540P": ModelInfo(
            model_id="Skywork/SkyReels-V2-T2V-14B-540P",
            model_type="t2v",
            resolution="540P",
            size="14B",
            url="https://huggingface.co/Skywork/SkyReels-V2-T2V-14B-540P",
            file_size_gb=28.0
        ),
        "Skywork/SkyReels-V2-T2V-14B-720P": ModelInfo(
            model_id="Skywork/SkyReels-V2-T2V-14B-720P", 
            model_type="t2v",
            resolution="720P",
            size="14B",
            url="https://huggingface.co/Skywork/SkyReels-V2-T2V-14B-720P",
            file_size_gb=28.0
        ),
        
        # Image-to-Video Models
        "Skywork/SkyReels-V2-I2V-1.3B-540P": ModelInfo(
            model_id="Skywork/SkyReels-V2-I2V-1.3B-540P",
            model_type="i2v",
            resolution="540P", 
            size="1.3B",
            url="https://huggingface.co/Skywork/SkyReels-V2-I2V-1.3B-540P",
            file_size_gb=2.6
        ),
        "Skywork/SkyReels-V2-I2V-14B-540P": ModelInfo(
            model_id="Skywork/SkyReels-V2-I2V-14B-540P",
            model_type="i2v",
            resolution="540P",
            size="14B", 
            url="https://huggingface.co/Skywork/SkyReels-V2-I2V-14B-540P",
            file_size_gb=28.0
        ),
        "Skywork/SkyReels-V2-I2V-14B-720P": ModelInfo(
            model_id="Skywork/SkyReels-V2-I2V-14B-720P",
            model_type="i2v",
            resolution="720P",
            size="14B",
            url="https://huggingface.co/Skywork/SkyReels-V2-I2V-14B-720P",
            file_size_gb=28.0
        ),
        
        # Diffusion Forcing Models
        "Skywork/SkyReels-V2-DF-1.3B-540P": ModelInfo(
            model_id="Skywork/SkyReels-V2-DF-1.3B-540P",
            model_type="df",
            resolution="540P",
            size="1.3B",
            url="https://huggingface.co/Skywork/SkyReels-V2-DF-1.3B-540P",
            file_size_gb=2.6
        ),
        "Skywork/SkyReels-V2-DF-14B-540P": ModelInfo(
            model_id="Skywork/SkyReels-V2-DF-14B-540P",
            model_type="df",
            resolution="540P", 
            size="14B",
            url="https://huggingface.co/Skywork/SkyReels-V2-DF-14B-540P",
            file_size_gb=28.0
        ),
        "Skywork/SkyReels-V2-DF-14B-720P": ModelInfo(
            model_id="Skywork/SkyReels-V2-DF-14B-720P",
            model_type="df",
            resolution="720P",
            size="14B", 
            url="https://huggingface.co/Skywork/SkyReels-V2-DF-14B-720P",
            file_size_gb=28.0
        )
    }
    
    def __init__(self, cache_dir: str = "./models"):
        """
        Initialize model manager
        
        Args:
            cache_dir: Directory to store downloaded models
        """
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.download_progress = {}
        self.download_locks = {}
        
        # Initialize HuggingFace login
        hf_token = os.getenv("HUGGINGFACE_TOKEN")
        if hf_token:
            try:
                login(token=hf_token)
                logger.info("Logged in to Hugging Face successfully")
            except Exception as e:
                logger.error(f"Failed to login to Hugging Face: {e}")
        else:
            logger.warning("No Hugging Face token provided")
        
        # Load download status
        self._load_download_status()
    
    def _load_download_status(self):
        """Load download status from cache"""
        status_file = self.cache_dir / "download_status.json"
        
        if status_file.exists():
            try:
                with open(status_file, 'r') as f:
                    status_data = json.load(f)
                
                for model_id, status in status_data.items():
                    if model_id in self.AVAILABLE_MODELS:
                        model_info = self.AVAILABLE_MODELS[model_id]
                        model_info.local_path = status.get("local_path")
                        model_info.is_downloaded = status.get("is_downloaded", False)
                        
                        # Verify the model actually exists
                        if model_info.local_path and not Path(model_info.local_path).exists():
                            model_info.is_downloaded = False
                            model_info.local_path = None
                        
                logger.info("Model download status loaded")
                        
            except Exception as e:
                logger.error(f"Failed to load download status: {e}")
    
    def _save_download_status(self):
        """Save download status to cache"""
        status_file = self.cache_dir / "download_status.json"
        
        try:
            status_data = {}
            for model_id, model_info in self.AVAILABLE_MODELS.items():
                status_data[model_id] = {
                    "local_path": model_info.local_path,
                    "is_downloaded": model_info.is_downloaded,
                    "download_progress": model_info.download_progress
                }
            
            with open(status_file, 'w') as f:
                json.dump(status_data, f, indent=2)
                
        except Exception as e:
            logger.error(f"Failed to save download status: {e}")
    
    def get_available_models(self) -> Dict[str, ModelInfo]:
        """Get all available models"""
        return self.AVAILABLE_MODELS.copy()
    
    def get_downloaded_models(self) -> List[ModelInfo]:
        """Get list of downloaded models"""
        return [
            model for model in self.AVAILABLE_MODELS.values()
            if model.is_downloaded
        ]
    
    def get_model_info(self, model_id: str) -> Optional[ModelInfo]:
        """Get information about a specific model"""
        return self.AVAILABLE_MODELS.get(model_id)
    
    def is_model_downloaded(self, model_id: str) -> bool:
        """Check if model is downloaded"""
        model_info = self.get_model_info(model_id)
        return model_info.is_downloaded if model_info else False
    
    def get_model_path(self, model_id: str) -> Optional[str]:
        """Get local path for downloaded model"""
        model_info = self.get_model_info(model_id)
        if model_info and model_info.is_downloaded:
            return model_info.local_path
        return None
    
    def get_download_progress(self, model_id: str) -> float:
        """Get download progress for a model"""
        return self.download_progress.get(model_id, 0.0)
    
    def estimate_download_time(self, model_id: str, bandwidth_mbps: float = 100) -> float:
        """Estimate download time in minutes"""
        model_info = self.get_model_info(model_id)
        if not model_info or not model_info.file_size_gb:
            return 0.0
        
        # Convert GB to Mb (gigabytes to megabits)
        size_mb = model_info.file_size_gb * 8 * 1024
        time_minutes = size_mb / bandwidth_mbps / 60
        
        return time_minutes
    
    def check_disk_space(self, model_id: str) -> Tuple[bool, float, float]:
        """
        Check if there's enough disk space for model
        
        Returns:
            (has_space, required_gb, available_gb)
        """
        model_info = self.get_model_info(model_id)
        if not model_info:
            return False, 0.0, 0.0
        
        required_gb = model_info.file_size_gb or 30.0  # Default estimate
        
        # Check available space
        import shutil
        total, used, free = shutil.disk_usage(self.cache_dir)
        available_gb = free / (1024**3)
        
        # Add 20% buffer for safety
        required_with_buffer = required_gb * 1.2
        
        return available_gb >= required_with_buffer, required_with_buffer, available_gb
    
    async def download_model(
        self,
        model_id: str,
        progress_callback: Optional[Callable[[float], None]] = None,
        force_redownload: bool = False
    ) -> bool:
        """
        Download a model asynchronously
        
        Args:
            model_id: HuggingFace model ID
            progress_callback: Callback for progress updates
            force_redownload: Force redownload even if exists
            
        Returns:
            True if download successful
        """
        model_info = self.get_model_info(model_id)
        if not model_info:
            logger.error(f"Unknown model ID: {model_id}")
            return False
        
        # Check if already downloaded and not forcing redownload
        if model_info.is_downloaded and not force_redownload:
            logger.info(f"Model already downloaded: {model_id}")
            return True
        
        # Check disk space
        has_space, required_gb, available_gb = self.check_disk_space(model_id)
        if not has_space:
            logger.error(f"Insufficient disk space. Required: {required_gb:.1f}GB, Available: {available_gb:.1f}GB")
            return False
        
        # Check if download is already in progress
        if model_id in self.download_locks:
            logger.info(f"Download already in progress for {model_id}")
            return False
        
        # Create download lock
        self.download_locks[model_id] = threading.Lock()
        
        try:
            logger.info(f"Starting download for {model_id}")
            model_info.download_progress = 0.0
            
            # Create model-specific cache directory
            model_cache_dir = self.cache_dir / model_id.replace("/", "_")
            model_cache_dir.mkdir(parents=True, exist_ok=True)
            
            # Progress tracking
            def progress_hook(block_num: int, block_size: int, total_size: int):
                if total_size > 0:
                    progress = min(100.0, (block_num * block_size) / total_size * 100)
                    model_info.download_progress = progress
                    self.download_progress[model_id] = progress
                    
                    if progress_callback:
                        progress_callback(progress)
                    
                    if progress % 10 < 1:  # Log every 10%
                        logger.info(f"Download progress for {model_id}: {progress:.1f}%")
            
            # Download using HuggingFace hub
            download_path = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: snapshot_download(
                    repo_id=model_id,
                    cache_dir=str(model_cache_dir),
                    resume_download=True,
                    token=os.getenv("HUGGINGFACE_TOKEN")
                )
            )
            
            # Update model info
            model_info.local_path = download_path
            model_info.is_downloaded = True
            model_info.download_progress = 100.0
            
            # Save status
            self._save_download_status()
            
            logger.info(f"Successfully downloaded {model_id} to {download_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to download {model_id}: {e}")
            model_info.download_progress = 0.0
            return False
            
        finally:
            # Remove download lock
            if model_id in self.download_locks:
                del self.download_locks[model_id]
    
    def download_model_sync(self, model_id: str, progress_callback: Optional[Callable[[float], None]] = None) -> bool:
        """Synchronous model download"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            return loop.run_until_complete(
                self.download_model(model_id, progress_callback)
            )
        finally:
            loop.close()
    
    def delete_model(self, model_id: str) -> bool:
        """Delete a downloaded model"""
        model_info = self.get_model_info(model_id)
        if not model_info or not model_info.is_downloaded:
            return False
        
        try:
            if model_info.local_path and Path(model_info.local_path).exists():
                import shutil
                shutil.rmtree(model_info.local_path)
                logger.info(f"Deleted model {model_id}")
            
            # Update status
            model_info.local_path = None
            model_info.is_downloaded = False
            model_info.download_progress = 0.0
            
            self._save_download_status()
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete model {model_id}: {e}")
            return False
    
    def get_cache_stats(self) -> Dict[str, any]:
        """Get model cache statistics"""
        downloaded_models = self.get_downloaded_models()
        
        total_size_gb = sum(
            model.file_size_gb for model in downloaded_models 
            if model.file_size_gb
        )
        
        # Check actual disk usage
        try:
            import shutil
            cache_usage = sum(
                sum(f.stat().st_size for f in Path(model.local_path).rglob('*') if f.is_file())
                for model in downloaded_models
                if model.local_path and Path(model.local_path).exists()
            ) / (1024**3)  # Convert to GB
        except:
            cache_usage = 0.0
        
        # Available space
        total, used, free = shutil.disk_usage(self.cache_dir)
        available_gb = free / (1024**3)
        
        return {
            "cache_directory": str(self.cache_dir),
            "downloaded_models": len(downloaded_models),
            "total_models": len(self.AVAILABLE_MODELS),
            "estimated_size_gb": total_size_gb,
            "actual_usage_gb": cache_usage,
            "available_space_gb": available_gb,
            "models": [
                {
                    "model_id": model.model_id,
                    "type": model.model_type,
                    "resolution": model.resolution,
                    "size": model.size,
                    "downloaded": model.is_downloaded,
                    "progress": model.download_progress,
                    "file_size_gb": model.file_size_gb
                }
                for model in self.AVAILABLE_MODELS.values()
            ]
        }
    
    def recommend_models(
        self, 
        use_case: str = "general",
        gpu_memory_gb: Optional[float] = None
    ) -> List[str]:
        """
        Recommend models based on use case and hardware
        
        Args:
            use_case: "general", "high_quality", "fast", "memory_efficient"
            gpu_memory_gb: Available GPU memory
            
        Returns:
            List of recommended model IDs
        """
        recommendations = []
        
        if use_case == "memory_efficient" or (gpu_memory_gb and gpu_memory_gb < 20):
            # Recommend smaller models
            recommendations = [
                "Skywork/SkyReels-V2-I2V-1.3B-540P",
                "Skywork/SkyReels-V2-DF-1.3B-540P"
            ]
            
        elif use_case == "high_quality":
            # Recommend 720P models
            recommendations = [
                "Skywork/SkyReels-V2-T2V-14B-720P",
                "Skywork/SkyReels-V2-I2V-14B-720P",
                "Skywork/SkyReels-V2-DF-14B-720P"
            ]
            
        elif use_case == "fast":
            # Recommend 540P models for faster generation
            recommendations = [
                "Skywork/SkyReels-V2-T2V-14B-540P",
                "Skywork/SkyReels-V2-I2V-14B-540P",
                "Skywork/SkyReels-V2-DF-14B-540P"
            ]
            
        else:  # general
            # Balanced recommendations
            recommendations = [
                "Skywork/SkyReels-V2-T2V-14B-540P",  # Text-to-video
                "Skywork/SkyReels-V2-I2V-14B-540P",  # Image-to-video
            ]
        
        return recommendations
    
    def setup_auto_download(self, model_ids: List[str]):
        """Setup automatic download for specified models"""
        def download_worker():
            for model_id in model_ids:
                if not self.is_model_downloaded(model_id):
                    logger.info(f"Auto-downloading model: {model_id}")
                    success = self.download_model_sync(model_id)
                    if success:
                        logger.info(f"Auto-download completed: {model_id}")
                    else:
                        logger.error(f"Auto-download failed: {model_id}")
        
        # Start download in background thread
        thread = threading.Thread(target=download_worker, daemon=True)
        thread.start()
        
        logger.info(f"Started auto-download for {len(model_ids)} models")
    
    def cleanup_cache(self, keep_models: Optional[List[str]] = None):
        """Clean up model cache, optionally keeping specified models"""
        keep_models = keep_models or []
        deleted_count = 0
        
        for model_id, model_info in self.AVAILABLE_MODELS.items():
            if model_id not in keep_models and model_info.is_downloaded:
                if self.delete_model(model_id):
                    deleted_count += 1
        
        logger.info(f"Cache cleanup completed. Deleted {deleted_count} models")
        return deleted_count
    
    def validate_model_integrity(self, model_id: str) -> bool:
        """Validate downloaded model integrity"""
        model_info = self.get_model_info(model_id)
        if not model_info or not model_info.is_downloaded:
            return False
        
        try:
            model_path = Path(model_info.local_path)
            if not model_path.exists():
                return False
            
            # Check for essential files
            essential_files = [
                "config.json",
                "model_index.json",
                "tokenizer_config.json"
            ]
            
            missing_files = []
            for file_name in essential_files:
                if not (model_path / file_name).exists():
                    missing_files.append(file_name)
            
            if missing_files:
                logger.warning(f"Model {model_id} missing files: {missing_files}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Model integrity check failed for {model_id}: {e}")
            return False
    
    def get_recommended_setup(self) -> Dict[str, any]:
        """Get recommended setup based on system capabilities"""
        try:
            # Check GPU memory
            if torch.cuda.is_available():
                gpu_memory_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                gpu_name = torch.cuda.get_device_name(0)
                use_gpu = True
            else:
                gpu_memory_gb = 0
                gpu_name = "None"
                use_gpu = False
            
            # Check system memory
            try:
                import psutil
                system_memory_gb = psutil.virtual_memory().total / (1024**3)
            except:
                system_memory_gb = 16  # Default estimate
            
            # Recommend based on hardware
            if gpu_memory_gb >= 48:
                tier = "high_end"
                recommended_models = self.recommend_models("high_quality", gpu_memory_gb)
            elif gpu_memory_gb >= 24:
                tier = "mid_range"
                recommended_models = self.recommend_models("general", gpu_memory_gb)
            elif gpu_memory_gb >= 12:
                tier = "entry_level"
                recommended_models = self.recommend_models("memory_efficient", gpu_memory_gb)
            else:
                tier = "cpu_only"
                recommended_models = []
            
            return {
                "hardware_tier": tier,
                "gpu_available": use_gpu,
                "gpu_name": gpu_name,
                "gpu_memory_gb": gpu_memory_gb,
                "system_memory_gb": system_memory_gb,
                "recommended_models": recommended_models,
                "cache_directory": str(self.cache_dir),
                "recommendations": {
                    "use_quantization": gpu_memory_gb < 32,
                    "offload_to_cpu": gpu_memory_gb < 48,
                    "max_concurrent_generations": max(1, int(gpu_memory_gb // 24)),
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to get system recommendations: {e}")
            return {
                "hardware_tier": "unknown",
                "gpu_available": False,
                "recommended_models": [],
                "error": str(e)
            }

# Global model manager instance
model_manager = ModelManager()

# Convenience functions
def get_model_manager() -> ModelManager:
    """Get global model manager instance"""
    return model_manager

def is_model_ready(model_id: str) -> bool:
    """Check if model is ready for use"""
    return model_manager.is_model_downloaded(model_id)

def get_best_model(task_type: str = "t2v", resolution: str = "540P") -> Optional[str]:
    """Get best available model for task"""
    available_models = model_manager.get_downloaded_models()
    
    # Filter by type and resolution
    matching_models = [
        model for model in available_models
        if model.model_type == task_type and model.resolution == resolution
    ]
    
    if not matching_models:
        # Fallback to any downloaded model of the same type
        matching_models = [
            model for model in available_models
            if model.model_type == task_type
        ]
    
    if not matching_models:
        return None
    
    # Prefer larger models for better quality
    best_model = max(matching_models, key=lambda m: float(m.size.replace("B", "")))
    return best_model.model_id

# Export main components
__all__ = [
    'ModelManager',
    'ModelInfo', 
    'model_manager',
    'get_model_manager',
    'is_model_ready',
    'get_best_model'
]