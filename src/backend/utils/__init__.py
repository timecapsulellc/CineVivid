"""
Backend utilities for CineVivid
"""
from .logger import initialize_logging, get_logger, LogContext, PerformanceLogger, ErrorTracker, SecurityLogger
from .errors import (
    CineVividException, AuthenticationError, AuthorizationError, InvalidTokenError,
    InsufficientCreditsError, UserNotFoundError, UserAlreadyExistsError,
    VideoGenerationError, ModelNotLoadedError, ValidationError,
    get_error_category, create_error_response, require_authentication, require_credits
)

__all__ = [
    # Logging
    'initialize_logging', 'get_logger', 'LogContext', 'PerformanceLogger', 'ErrorTracker', 'SecurityLogger',
    
    # Errors
    'CineVividException', 'AuthenticationError', 'AuthorizationError', 'InvalidTokenError',
    'InsufficientCreditsError', 'UserNotFoundError', 'UserAlreadyExistsError',
    'VideoGenerationError', 'ModelNotLoadedError', 'ValidationError',
    'get_error_category', 'create_error_response', 'require_authentication', 'require_credits'
]