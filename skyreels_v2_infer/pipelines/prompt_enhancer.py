"""
Prompt Enhancer for CineVivid
Enhances video generation prompts using Qwen2.5-32B-Instruct
"""
import os
import logging
from typing import Optional, Dict, Any
import requests
import json

logger = logging.getLogger(__name__)

class PromptEnhancer:
    """
    Prompt enhancer using Qwen2.5-32B-Instruct for video generation prompts
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize prompt enhancer
        
        Args:
            api_key: Hugging Face API key for model access
        """
        self.api_key = api_key or os.getenv("HUGGINGFACE_TOKEN")
        self.model_id = "Qwen/Qwen2.5-32B-Instruct"
        self.base_url = "https://api-inference.huggingface.co/models"
        
        if not self.api_key:
            logger.warning("No Hugging Face API key provided. Prompt enhancement will be limited.")
    
    def __call__(self, prompt: str) -> str:
        """
        Enhance a prompt for video generation
        
        Args:
            prompt: Original prompt text
            
        Returns:
            Enhanced prompt with more cinematic details
        """
        return self.enhance_prompt(prompt)
    
    def enhance_prompt(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Enhance a basic prompt with cinematic details
        
        Args:
            prompt: Original prompt
            context: Additional context for enhancement
            
        Returns:
            Enhanced prompt
        """
        if not self.api_key:
            # Fallback enhancement without API
            return self._fallback_enhance(prompt)
        
        try:
            enhanced = self._api_enhance(prompt, context)
            if enhanced:
                return enhanced
        except Exception as e:
            logger.warning(f"API enhancement failed: {e}")
        
        # Fallback to rule-based enhancement
        return self._fallback_enhance(prompt)
    
    def _api_enhance(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> Optional[str]:
        """
        Enhance prompt using Qwen2.5 API
        
        Args:
            prompt: Original prompt
            context: Additional context
            
        Returns:
            Enhanced prompt or None if failed
        """
        system_prompt = """You are a professional video production assistant specializing in creating detailed, cinematic prompts for AI video generation. Transform basic descriptions into rich, detailed prompts that include:

1. Visual composition (camera angles, shots, framing)
2. Lighting and atmosphere
3. Motion and dynamics
4. Style and aesthetic
5. Technical details for professional quality

Keep the enhancement under 200 words and maintain the original intent."""

        user_prompt = f"Enhance this video prompt for professional AI video generation: '{prompt}'"
        
        if context:
            user_prompt += f"\nAdditional context: {json.dumps(context)}"

        payload = {
            "inputs": {
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            },
            "parameters": {
                "max_new_tokens": 200,
                "temperature": 0.7,
                "top_p": 0.9
            }
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/{self.model_id}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    enhanced = result[0].get("generated_text", "")
                    # Extract just the enhanced prompt
                    if "Enhanced prompt:" in enhanced:
                        enhanced = enhanced.split("Enhanced prompt:")[-1].strip()
                    return enhanced
            else:
                logger.warning(f"API request failed: {response.status_code}")
                
        except Exception as e:
            logger.error(f"API enhancement error: {e}")
            
        return None
    
    def _fallback_enhance(self, prompt: str) -> str:
        """
        Fallback rule-based prompt enhancement
        
        Args:
            prompt: Original prompt
            
        Returns:
            Enhanced prompt using rules
        """
        # Basic enhancement templates
        cinematic_elements = [
            "cinematic composition",
            "professional cinematography", 
            "high-quality video",
            "smooth camera movement",
            "dramatic lighting",
            "rich colors",
            "detailed textures"
        ]
        
        # Check if prompt is very short and basic
        if len(prompt.split()) < 10:
            # Add more descriptive elements
            enhanced = f"{prompt}, {', '.join(cinematic_elements[:3])}, 4K resolution"
        else:
            # Just add cinematic quality markers
            enhanced = f"{prompt}, cinematic quality, professional video production"
        
        return enhanced
    
    def enhance_with_context(self, prompt: str, context: Dict[str, Any]) -> str:
        """
        Enhance prompt with specific context
        
        Args:
            prompt: Original prompt
            context: Context including style, mood, etc.
            
        Returns:
            Context-aware enhanced prompt
        """
        style = context.get("style", "cinematic")
        mood = context.get("mood", "neutral")
        duration = context.get("duration", 5)
        aspect_ratio = context.get("aspect_ratio", "16:9")
        
        # Build context-aware enhancement
        enhancements = []
        
        if style == "cinematic":
            enhancements.append("cinematic style with professional camera work")
        elif style == "documentary":
            enhancements.append("documentary style with natural lighting")
        elif style == "artistic":
            enhancements.append("artistic composition with creative cinematography")
        
        if mood == "dramatic":
            enhancements.append("dramatic lighting and intense atmosphere")
        elif mood == "peaceful":
            enhancements.append("soft lighting and calm atmosphere")
        elif mood == "energetic":
            enhancements.append("dynamic movement and vibrant colors")
        
        if duration > 10:
            enhancements.append("smooth transitions and continuous motion")
        
        enhanced_prompt = f"{prompt}, {', '.join(enhancements)}"
        
        return self.enhance_prompt(enhanced_prompt, context)

    def get_enhancement_suggestions(self, prompt: str) -> Dict[str, str]:
        """
        Get multiple enhancement suggestions for a prompt
        
        Args:
            prompt: Original prompt
            
        Returns:
            Dictionary of different enhancement styles
        """
        suggestions = {}
        
        # Different enhancement styles
        contexts = {
            "cinematic": {"style": "cinematic", "mood": "dramatic"},
            "natural": {"style": "documentary", "mood": "peaceful"},
            "artistic": {"style": "artistic", "mood": "creative"},
            "commercial": {"style": "commercial", "mood": "professional"}
        }
        
        for style, context in contexts.items():
            try:
                suggestions[style] = self.enhance_with_context(prompt, context)
            except Exception as e:
                logger.warning(f"Failed to create {style} suggestion: {e}")
                suggestions[style] = prompt
        
        return suggestions

    def validate_prompt(self, prompt: str) -> Dict[str, Any]:
        """
        Validate and analyze a prompt for video generation
        
        Args:
            prompt: Prompt to validate
            
        Returns:
            Validation results and suggestions
        """
        issues = []
        suggestions = []
        
        # Check prompt length
        if len(prompt) < 10:
            issues.append("Prompt too short - may not provide enough detail")
            suggestions.append("Add more descriptive elements")
        elif len(prompt) > 500:
            issues.append("Prompt too long - may cause confusion")
            suggestions.append("Simplify and focus on key elements")
        
        # Check for technical terms
        technical_terms = ["4K", "HD", "fps", "resolution", "quality"]
        if not any(term.lower() in prompt.lower() for term in technical_terms):
            suggestions.append("Consider adding quality indicators")
        
        # Check for motion descriptions
        motion_words = ["moving", "walking", "flying", "flowing", "spinning"]
        if not any(word in prompt.lower() for word in motion_words):
            suggestions.append("Consider adding motion descriptions")
        
        return {
            "is_valid": len(issues) == 0,
            "issues": issues,
            "suggestions": suggestions,
            "word_count": len(prompt.split()),
            "estimated_enhancement": len(prompt) < 50
        }