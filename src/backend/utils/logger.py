"""
Comprehensive logging configuration for CineVivid
Structured logging with multiple handlers and formatters
"""
import logging
import logging.handlers
import os
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
import traceback

# Create logs directory
LOGS_DIR = Path("./logs")
LOGS_DIR.mkdir(exist_ok=True)

class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add extra fields if present
        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id
        
        if hasattr(record, 'task_id'):
            log_entry['task_id'] = record.task_id
        
        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id
        
        # Add exception info if present
        if record.exc_info:
            log_entry['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1]),
                'traceback': traceback.format_exception(*record.exc_info)
            }
        
        return json.dumps(log_entry)

class ColoredConsoleFormatter(logging.Formatter):
    """Colored console formatter for development"""
    
    COLORS = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',  # Yellow
        'ERROR': '\033[31m',    # Red
        'CRITICAL': '\033[35m', # Magenta
    }
    RESET = '\033[0m'
    
    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{color}{record.levelname}{self.RESET}"
        
        formatted = super().format(record)
        
        # Add context if available
        context = []
        if hasattr(record, 'user_id'):
            context.append(f"user:{record.user_id}")
        if hasattr(record, 'task_id'):
            context.append(f"task:{record.task_id}")
        
        if context:
            formatted += f" [{', '.join(context)}]"
        
        return formatted

def setup_logging(
    log_level: str = "INFO",
    log_format: str = "json",
    log_file: str = "cinevivid.log",
    max_bytes: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5
) -> logging.Logger:
    """
    Setup comprehensive logging configuration
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_format: Format type (json, console)
        log_file: Log file name
        max_bytes: Maximum log file size before rotation
        backup_count: Number of backup files to keep
        
    Returns:
        Configured logger
    """
    # Clear existing handlers
    root_logger = logging.getLogger()
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Set log level
    level = getattr(logging, log_level.upper(), logging.INFO)
    root_logger.setLevel(level)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    
    if log_format == "json" or os.getenv("LOG_FORMAT", "").lower() == "json":
        console_formatter = JSONFormatter()
    else:
        console_formatter = ColoredConsoleFormatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler with rotation
    file_handler = logging.handlers.RotatingFileHandler(
        LOGS_DIR / log_file,
        maxBytes=max_bytes,
        backupCount=backup_count
    )
    file_handler.setLevel(level)
    file_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(file_handler)
    
    # Error file handler (only errors and above)
    error_handler = logging.handlers.RotatingFileHandler(
        LOGS_DIR / "error.log",
        maxBytes=max_bytes,
        backupCount=backup_count
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(error_handler)
    
    return root_logger

def get_logger(name: str) -> logging.Logger:
    """Get a logger with the given name"""
    return logging.getLogger(name)

class LogContext:
    """Context manager for adding context to log records"""
    
    def __init__(self, logger: logging.Logger, **context):
        self.logger = logger
        self.context = context
        self.old_factory = None
    
    def __enter__(self):
        self.old_factory = logging.getLogRecordFactory()
        
        def record_factory(*args, **kwargs):
            record = self.old_factory(*args, **kwargs)
            for key, value in self.context.items():
                setattr(record, key, value)
            return record
        
        logging.setLogRecordFactory(record_factory)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.old_factory:
            logging.setLogRecordFactory(self.old_factory)

# Performance monitoring logger
class PerformanceLogger:
    """Logger for performance metrics"""
    
    def __init__(self, logger_name: str = "cinevivid.performance"):
        self.logger = get_logger(logger_name)
    
    def log_request(self, method: str, path: str, duration: float, status_code: int, user_id: Optional[int] = None):
        """Log API request performance"""
        self.logger.info(
            "API Request",
            extra={
                'method': method,
                'path': path,
                'duration_ms': round(duration * 1000, 2),
                'status_code': status_code,
                'user_id': user_id
            }
        )
    
    def log_generation(self, task_type: str, duration: float, frames: int, user_id: int, task_id: str, status: str):
        """Log video generation performance"""
        self.logger.info(
            "Video Generation",
            extra={
                'task_type': task_type,
                'duration_seconds': round(duration, 2),
                'frames': frames,
                'fps': round(frames / duration, 2) if duration > 0 else 0,
                'user_id': user_id,
                'task_id': task_id,
                'status': status
            }
        )
    
    def log_model_load(self, model_id: str, duration: float, success: bool):
        """Log model loading performance"""
        self.logger.info(
            "Model Load",
            extra={
                'model_id': model_id,
                'duration_seconds': round(duration, 2),
                'success': success
            }
        )

# Error tracking
class ErrorTracker:
    """Track and categorize errors"""
    
    def __init__(self, logger_name: str = "cinevivid.errors"):
        self.logger = get_logger(logger_name)
    
    def log_error(
        self, 
        error: Exception, 
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None,
        request_id: Optional[str] = None
    ):
        """Log error with context"""
        error_info = {
            'error_type': type(error).__name__,
            'error_message': str(error),
            'context': context or {}
        }
        
        extra = {}
        if user_id:
            extra['user_id'] = user_id
        if request_id:
            extra['request_id'] = request_id
        
        self.logger.error(
            f"Application Error: {error_info['error_type']}",
            extra=extra,
            exc_info=True
        )
    
    def log_validation_error(self, field: str, value: Any, error: str, user_id: Optional[int] = None):
        """Log validation error"""
        self.logger.warning(
            f"Validation Error: {field}",
            extra={
                'field': field,
                'value': str(value)[:100],  # Truncate long values
                'error': error,
                'user_id': user_id
            }
        )

# Security logger
class SecurityLogger:
    """Logger for security events"""
    
    def __init__(self, logger_name: str = "cinevivid.security"):
        self.logger = get_logger(logger_name)
    
    def log_auth_attempt(self, username: str, success: bool, ip_address: str, user_agent: str = ""):
        """Log authentication attempt"""
        self.logger.info(
            f"Auth Attempt: {'Success' if success else 'Failed'}",
            extra={
                'username': username,
                'success': success,
                'ip_address': ip_address,
                'user_agent': user_agent
            }
        )
    
    def log_suspicious_activity(self, activity: str, details: Dict[str, Any], ip_address: str, user_id: Optional[int] = None):
        """Log suspicious security activity"""
        self.logger.warning(
            f"Suspicious Activity: {activity}",
            extra={
                'activity': activity,
                'details': details,
                'ip_address': ip_address,
                'user_id': user_id
            }
        )
    
    def log_rate_limit_exceeded(self, endpoint: str, ip_address: str, user_id: Optional[int] = None):
        """Log rate limit violation"""
        self.logger.warning(
            f"Rate Limit Exceeded: {endpoint}",
            extra={
                'endpoint': endpoint,
                'ip_address': ip_address,
                'user_id': user_id
            }
        )

# Initialize loggers
def initialize_logging():
    """Initialize all logging components"""
    log_level = os.getenv("LOG_LEVEL", "INFO")
    log_format = os.getenv("LOG_FORMAT", "console")
    
    # Setup main logging
    setup_logging(log_level=log_level, log_format=log_format)
    
    # Create specialized loggers
    performance_logger = PerformanceLogger()
    error_tracker = ErrorTracker()
    security_logger = SecurityLogger()
    
    # Log initialization
    main_logger = get_logger("cinevivid.init")
    main_logger.info("Logging system initialized", extra={
        'log_level': log_level,
        'log_format': log_format,
        'log_directory': str(LOGS_DIR)
    })
    
    return {
        'performance': performance_logger,
        'error_tracker': error_tracker,
        'security': security_logger,
        'main': main_logger
    }

# Export main components
__all__ = [
    'setup_logging',
    'get_logger',
    'LogContext',
    'PerformanceLogger',
    'ErrorTracker',
    'SecurityLogger',
    'initialize_logging'
]