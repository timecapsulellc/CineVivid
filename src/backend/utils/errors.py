"""
Custom exception classes and error handling for CineVivid
Comprehensive error management with proper HTTP status codes
"""
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

class CineVividException(Exception):
    """Base exception for CineVivid application"""
    
    def __init__(
        self,
        message: str,
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        status_code: int = 500
    ):
        self.message = message
        self.error_code = error_code or self.__class__.__name__
        self.details = details or {}
        self.status_code = status_code
        self.timestamp = datetime.utcnow()
        self.error_id = str(uuid.uuid4())[:8]
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": self.error_code,
            "message": self.message,
            "details": self.details,
            "error_id": self.error_id,
            "timestamp": self.timestamp.isoformat()
        }

# Authentication & Authorization Errors
class AuthenticationError(CineVividException):
    """Authentication failed"""
    def __init__(self, message: str = "Authentication failed", **kwargs):
        super().__init__(message, status_code=401, **kwargs)

class AuthorizationError(CineVividException):
    """Authorization failed"""
    def __init__(self, message: str = "Access denied", **kwargs):
        super().__init__(message, status_code=403, **kwargs)

class InvalidTokenError(AuthenticationError):
    """Invalid or expired token"""
    def __init__(self, message: str = "Invalid or expired token", **kwargs):
        super().__init__(message, **kwargs)

class InsufficientCreditsError(CineVividException):
    """User has insufficient credits"""
    def __init__(self, required: float, available: float, **kwargs):
        message = f"Insufficient credits. Required: {required}, Available: {available}"
        details = {"required_credits": required, "available_credits": available}
        super().__init__(message, details=details, status_code=402, **kwargs)

# User & Account Errors
class UserNotFoundError(CineVividException):
    """User not found"""
    def __init__(self, identifier: str, **kwargs):
        message = f"User not found: {identifier}"
        details = {"identifier": identifier}
        super().__init__(message, details=details, status_code=404, **kwargs)

class UserAlreadyExistsError(CineVividException):
    """User already exists"""
    def __init__(self, field: str, value: str, **kwargs):
        message = f"User with {field} '{value}' already exists"
        details = {"field": field, "value": value}
        super().__init__(message, details=details, status_code=409, **kwargs)

class AccountSuspendedError(CineVividException):
    """User account is suspended"""
    def __init__(self, reason: str = "Account suspended", **kwargs):
        super().__init__(reason, status_code=403, **kwargs)

# Video Generation Errors
class VideoGenerationError(CineVividException):
    """Video generation failed"""
    def __init__(self, message: str, task_id: Optional[str] = None, **kwargs):
        details = {"task_id": task_id} if task_id else {}
        super().__init__(message, details=details, status_code=500, **kwargs)

class ModelNotLoadedError(VideoGenerationError):
    """AI model not loaded or unavailable"""
    def __init__(self, model_id: str, **kwargs):
        message = f"Model not loaded: {model_id}"
        details = {"model_id": model_id}
        super().__init__(message, details=details, status_code=503, **kwargs)

class InvalidPromptError(CineVividException):
    """Invalid prompt provided"""
    def __init__(self, reason: str, prompt: str = "", **kwargs):
        message = f"Invalid prompt: {reason}"
        details = {"reason": reason, "prompt": prompt[:100]}  # Truncate long prompts
        super().__init__(message, details=details, status_code=400, **kwargs)

class GenerationTimeoutError(VideoGenerationError):
    """Video generation timed out"""
    def __init__(self, timeout_seconds: int, task_id: Optional[str] = None, **kwargs):
        message = f"Generation timed out after {timeout_seconds} seconds"
        details = {"timeout_seconds": timeout_seconds, "task_id": task_id}
        super().__init__(message, details=details, status_code=408, **kwargs)

class UnsupportedFormatError(CineVividException):
    """Unsupported file format"""
    def __init__(self, format_type: str, supported_formats: list, **kwargs):
        message = f"Unsupported format: {format_type}"
        details = {
            "provided_format": format_type,
            "supported_formats": supported_formats
        }
        super().__init__(message, details=details, status_code=400, **kwargs)

# API & Validation Errors
class ValidationError(CineVividException):
    """Request validation failed"""
    def __init__(self, field: str, value: Any, constraint: str, **kwargs):
        message = f"Validation failed for {field}: {constraint}"
        details = {
            "field": field,
            "value": str(value)[:100],  # Truncate long values
            "constraint": constraint
        }
        super().__init__(message, details=details, status_code=400, **kwargs)

class RateLimitExceededError(CineVividException):
    """Rate limit exceeded"""
    def __init__(self, limit: int, window: str, retry_after: int = 60, **kwargs):
        message = f"Rate limit exceeded: {limit} requests per {window}"
        details = {
            "limit": limit,
            "window": window,
            "retry_after": retry_after
        }
        super().__init__(message, details=details, status_code=429, **kwargs)

class FileTooLargeError(CineVividException):
    """Uploaded file too large"""
    def __init__(self, file_size: int, max_size: int, **kwargs):
        message = f"File too large: {file_size} bytes (max: {max_size})"
        details = {"file_size": file_size, "max_size": max_size}
        super().__init__(message, details=details, status_code=413, **kwargs)

class InvalidFileTypeError(CineVividException):
    """Invalid file type"""
    def __init__(self, file_type: str, allowed_types: list, **kwargs):
        message = f"Invalid file type: {file_type}"
        details = {"file_type": file_type, "allowed_types": allowed_types}
        super().__init__(message, details=details, status_code=400, **kwargs)

# System & Resource Errors
class DatabaseError(CineVividException):
    """Database operation failed"""
    def __init__(self, operation: str, table: str = "", **kwargs):
        message = f"Database error during {operation}"
        details = {"operation": operation}
        if table:
            details["table"] = table
        super().__init__(message, details=details, status_code=500, **kwargs)

class ExternalServiceError(CineVividException):
    """External service unavailable"""
    def __init__(self, service: str, status_code: Optional[int] = None, **kwargs):
        message = f"External service error: {service}"
        details = {"service": service}
        if status_code:
            details["service_status"] = status_code
        super().__init__(message, details=details, status_code=503, **kwargs)

class StorageError(CineVividException):
    """File storage error"""
    def __init__(self, operation: str, path: str = "", **kwargs):
        message = f"Storage error during {operation}"
        details = {"operation": operation}
        if path:
            details["path"] = path
        super().__init__(message, details=details, status_code=500, **kwargs)

class ResourceNotFoundError(CineVividException):
    """Requested resource not found"""
    def __init__(self, resource_type: str, identifier: str, **kwargs):
        message = f"{resource_type} not found: {identifier}"
        details = {"resource_type": resource_type, "identifier": identifier}
        super().__init__(message, details=details, status_code=404, **kwargs)

class ConfigurationError(CineVividException):
    """Configuration error"""
    def __init__(self, setting: str, issue: str, **kwargs):
        message = f"Configuration error - {setting}: {issue}"
        details = {"setting": setting, "issue": issue}
        super().__init__(message, details=details, status_code=500, **kwargs)

# Business Logic Errors
class TaskNotFoundError(ResourceNotFoundError):
    """Task not found"""
    def __init__(self, task_id: str, **kwargs):
        super().__init__("Task", task_id, **kwargs)

class VideoNotFoundError(ResourceNotFoundError):
    """Video not found"""
    def __init__(self, video_id: str, **kwargs):
        super().__init__("Video", video_id, **kwargs)

class DuplicateTaskError(CineVividException):
    """Duplicate task submission"""
    def __init__(self, task_id: str, **kwargs):
        message = f"Duplicate task detected: {task_id}"
        details = {"task_id": task_id}
        super().__init__(message, details=details, status_code=409, **kwargs)

class MaintenanceModeError(CineVividException):
    """System in maintenance mode"""
    def __init__(self, message: str = "System is under maintenance", **kwargs):
        super().__init__(message, status_code=503, **kwargs)

# Error Categories for monitoring
ERROR_CATEGORIES = {
    # User errors (4xx)
    "client_error": [
        ValidationError,
        InvalidPromptError,
        UnsupportedFormatError,
        FileTooLargeError,
        InvalidFileTypeError,
        UserAlreadyExistsError
    ],
    
    # Authentication errors (401/403)
    "auth_error": [
        AuthenticationError,
        AuthorizationError,
        InvalidTokenError,
        AccountSuspendedError
    ],
    
    # Business logic errors
    "business_error": [
        InsufficientCreditsError,
        UserNotFoundError,
        TaskNotFoundError,
        VideoNotFoundError,
        DuplicateTaskError
    ],
    
    # System errors (5xx)
    "system_error": [
        DatabaseError,
        StorageError,
        ConfigurationError,
        MaintenanceModeError
    ],
    
    # External service errors
    "service_error": [
        ExternalServiceError,
        ModelNotLoadedError
    ],
    
    # Generation errors
    "generation_error": [
        VideoGenerationError,
        GenerationTimeoutError
    ]
}

def get_error_category(error: Exception) -> str:
    """Get the category of an error for monitoring purposes"""
    for category, error_types in ERROR_CATEGORIES.items():
        if any(isinstance(error, error_type) for error_type in error_types):
            return category
    return "unknown_error"

def create_error_response(error: Exception) -> Dict[str, Any]:
    """Create standardized error response"""
    if isinstance(error, CineVividException):
        return error.to_dict()
    
    # Handle standard exceptions
    return {
        "error": type(error).__name__,
        "message": str(error),
        "details": {},
        "error_id": str(uuid.uuid4())[:8],
        "timestamp": datetime.utcnow().isoformat()
    }

# Convenience functions for common error scenarios
def require_authentication(user = None):
    """Raise AuthenticationError if user is not provided"""
    if not user:
        raise AuthenticationError("Authentication required")

def require_credits(user_credits: float, required_credits: float):
    """Raise InsufficientCreditsError if user doesn't have enough credits"""
    if user_credits < required_credits:
        raise InsufficientCreditsError(required_credits, user_credits)

def validate_file_size(file_size: int, max_size: int):
    """Validate file size"""
    if file_size > max_size:
        raise FileTooLargeError(file_size, max_size)

def validate_file_type(file_type: str, allowed_types: list):
    """Validate file type"""
    if file_type not in allowed_types:
        raise InvalidFileTypeError(file_type, allowed_types)

# Export all error classes
__all__ = [
    'CineVividException',
    'AuthenticationError',
    'AuthorizationError', 
    'InvalidTokenError',
    'InsufficientCreditsError',
    'UserNotFoundError',
    'UserAlreadyExistsError',
    'AccountSuspendedError',
    'VideoGenerationError',
    'ModelNotLoadedError',
    'InvalidPromptError',
    'GenerationTimeoutError',
    'UnsupportedFormatError',
    'ValidationError',
    'RateLimitExceededError',
    'FileTooLargeError',
    'InvalidFileTypeError',
    'DatabaseError',
    'ExternalServiceError',
    'StorageError',
    'ResourceNotFoundError',
    'ConfigurationError',
    'TaskNotFoundError',
    'VideoNotFoundError',
    'DuplicateTaskError',
    'MaintenanceModeError',
    'get_error_category',
    'create_error_response',
    'require_authentication',
    'require_credits',
    'validate_file_size',
    'validate_file_type'
]