import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import logging

logger = logging.getLogger(__name__)

class PromptEnhancer:
    """
    Prompt enhancer using Qwen2.5-32B-Instruct model to improve video generation prompts.
    """

    def __init__(self, model_name="Qwen/Qwen2.5-32B-Instruct", device="auto"):
        """
        Initialize the prompt enhancer.

        Args:
            model_name: HuggingFace model name
            device: Device to run the model on ('auto', 'cuda', 'cpu')
        """
        self.model_name = model_name
        self.device = device if device != "auto" else ("cuda" if torch.cuda.is_available() else "cpu")

        try:
            logger.info(f"Loading prompt enhancer model: {model_name}")
            self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.bfloat16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
                trust_remote_code=True
            )

            if self.device == "cuda":
                self.model = self.model.to(self.device)

            logger.info("Prompt enhancer loaded successfully")

        except Exception as e:
            logger.error(f"Failed to load prompt enhancer: {e}")
            self.model = None
            self.tokenizer = None

    def __call__(self, prompt: str) -> str:
        """
        Enhance a video generation prompt.

        Args:
            prompt: Original user prompt

        Returns:
            Enhanced prompt with more detailed descriptions
        """
        if not self.model or not self.tokenizer:
            logger.warning("Prompt enhancer not available, returning original prompt")
            return prompt

        try:
            # Create enhancement prompt
            enhancement_prompt = f"""You are an expert at writing detailed, cinematic prompts for AI video generation. Take the user's basic prompt and enhance it with:

1. Specific visual details (colors, lighting, composition)
2. Camera angles and movement descriptions
3. Atmospheric elements (mood, time of day, weather)
4. Character descriptions and actions
5. Scene composition and cinematography terms
6. Technical details that improve video quality

Original prompt: "{prompt}"

Enhanced prompt:"""

            # Tokenize
            inputs = self.tokenizer(enhancement_prompt, return_tensors="pt")
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}

            # Generate enhanced prompt
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=200,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9,
                    pad_token_id=self.tokenizer.eos_token_id
                )

            # Decode and extract enhanced prompt
            full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

            # Extract the enhanced prompt part (after "Enhanced prompt:")
            enhanced_part = full_response.split("Enhanced prompt:")[-1].strip()

            # Clean up the response
            enhanced_prompt = enhanced_part.split("\n")[0].strip().strip('"')

            # Fallback if enhancement failed
            if not enhanced_prompt or len(enhanced_prompt) < len(prompt) * 0.5:
                logger.warning("Enhancement failed, returning original prompt")
                return prompt

            logger.info(f"Enhanced prompt: {enhanced_prompt}")
            return enhanced_prompt

        except Exception as e:
            logger.error(f"Prompt enhancement failed: {e}")
            return prompt

    def enhance_with_context(self, prompt: str, context: dict = None) -> str:
        """
        Enhance prompt with additional context information.

        Args:
            prompt: Original prompt
            context: Dictionary with context like {'style': 'cinematic', 'duration': 5, 'aspect_ratio': '16:9'}

        Returns:
            Enhanced prompt incorporating context
        """
        if not context:
            return self(prompt)

        # Add context to the enhancement prompt
        context_str = ", ".join([f"{k}: {v}" for k, v in context.items()])

        enhancement_prompt = f"""You are an expert at writing detailed, cinematic prompts for AI video generation. Take the user's basic prompt and enhance it with:

1. Specific visual details (colors, lighting, composition)
2. Camera angles and movement descriptions
3. Atmospheric elements (mood, time of day, weather)
4. Character descriptions and actions
5. Scene composition and cinematography terms
6. Technical details that improve video quality

Additional context: {context_str}

Original prompt: "{prompt}"

Enhanced prompt:"""

        # Use the same generation logic as __call__
        if not self.model or not self.tokenizer:
            return prompt

        try:
            inputs = self.tokenizer(enhancement_prompt, return_tensors="pt")
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=250,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9,
                    pad_token_id=self.tokenizer.eos_token_id
                )

            full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            enhanced_part = full_response.split("Enhanced prompt:")[-1].strip()
            enhanced_prompt = enhanced_part.split("\n")[0].strip().strip('"')

            if not enhanced_prompt or len(enhanced_prompt) < len(prompt) * 0.5:
                return prompt

            return enhanced_prompt

        except Exception as e:
            logger.error(f"Context-enhanced prompt generation failed: {e}")
            return prompt