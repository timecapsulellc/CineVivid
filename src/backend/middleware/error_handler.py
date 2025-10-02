"""
Error handling middleware for CineVivid FastAPI application
Comprehensive error handling with logging and monitoring
"""
import logging
import time
import traceback
from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Any
import uuid

from ..utils.errors import CineVividException, create_error_response, get_error_category
from ..utils.logger import get_logger, PerformanceLogger, ErrorTracker, SecurityLogger

logger = get_logger(__name__)
performance_logger = PerformanceLogger()
error_tracker = ErrorTracker()
security_logger = SecurityLogger()

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware for global error handling and monitoring"""
    
    async def dispatch(self, request: Request, call_next):
        # Generate request ID for tracking
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        
        start_time = time.time()
        
        try:
            # Process request
            response = await call_next(request)
            
            # Log successful request
            duration = time.time() - start_time
            performance_logger.log_request(
                method=request.method,
                path=str(request.url.path),
                duration=duration,
                status_code=response.status_code,
                user_id=getattr(request.state, 'user_id', None)
            )
            
            return response
            
        except Exception as exc:
            # Log error
            duration = time.time() - start_time
            
            # Get user info if available
            user_id = getattr(request.state, 'user_id', None)
            client_ip = request.client.host if request.client else "unknown"
            
            # Handle different exception types
            if isinstance(exc, HTTPException):
                return await self._handle_http_exception(exc, request, request_id, duration)
            elif isinstance(exc, CineVividException):
                return await self._handle_cinevivid_exception(exc, request, request_id, duration)
            else:
                return await self._handle_generic_exception(exc, request, request_id, duration)
    
    async def _handle_http_exception(
        self, 
        exc: HTTPException, 
        request: Request, 
        request_id: str, 
        duration: float
    ) -> JSONResponse:
        """Handle FastAPI HTTPException"""
        
        # Log based on status code
        if exc.status_code >= 500:
            logger.error(f"HTTP {exc.status_code}: {exc.detail}")
        elif exc.status_code >= 400:
            logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
        
        # Performance logging
        performance_logger.log_request(
            method=request.method,
            path=str(request.url.path),
            duration=duration,
            status_code=exc.status_code,
            user_id=getattr(request.state, 'user_id', None)
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "HTTPException",
                "message": exc.detail,
                "status_code": exc.status_code,
                "request_id": request_id,
                "path": str(request.url.path)
            }
        )
    
    async def _handle_cinevivid_exception(
        self, 
        exc: CineVividException, 
        request: Request, 
        request_id: str, 
        duration: float
    ) -> JSONResponse:
        """Handle custom CineVivid exceptions"""
        
        user_id = getattr(request.state, 'user_id', None)
        
        # Log error with context
        error_tracker.log_error(
            error=exc,
            context={
                "request_id": request_id,
                "path": str(request.url.path),
                "method": request.method,
                "duration": duration
            },
            user_id=user_id,
            request_id=request_id
        )
        
        # Performance logging
        performance_logger.log_request(
            method=request.method,
            path=str(request.url.path),
            duration=duration,
            status_code=exc.status_code,
            user_id=user_id
        )
        
        # Create response with additional context
        response_data = exc.to_dict()
        response_data.update({
            "request_id": request_id,
            "path": str(request.url.path)
        })
        
        return JSONResponse(
            status_code=exc.status_code,
            content=response_data
        )
    
    async def _handle_generic_exception(
        self, 
        exc: Exception, 
        request: Request, 
        request_id: str, 
        duration: float
    ) -> JSONResponse:
        """Handle unexpected exceptions"""
        
        user_id = getattr(request.state, 'user_id', None)
        
        # Log error with full traceback
        logger.error(
            f"Unhandled exception: {type(exc).__name__}",
            extra={
                "request_id": request_id,
                "user_id": user_id,
                "path": str(request.url.path),
                "method": request.method
            },
            exc_info=True
        )
        
        # Track error
        error_tracker.log_error(
            error=exc,
            context={
                "request_id": request_id,
                "path": str(request.url.path),
                "method": request.method,
                "duration": duration,
                "category": "unhandled_exception"
            },
            user_id=user_id,
            request_id=request_id
        )
        
        # Performance logging
        performance_logger.log_request(
            method=request.method,
            path=str(request.url.path),
            duration=duration,
            status_code=500,
            user_id=user_id
        )
        
        # Don't expose internal errors in production
        is_production = request.app.state.environment == "production"
        
        error_response = {
            "error": "InternalServerError",
            "message": "An internal server error occurred" if is_production else str(exc),
            "request_id": request_id,
            "path": str(request.url.path)
        }
        
        # Add traceback in development
        if not is_production:
            error_response["traceback"] = traceback.format_exc()
        
        return JSONResponse(
            status_code=500,
            content=error_response
        )

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for request/response logging"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log incoming request
        logger.info(
            f"{request.method} {request.url.path}",
            extra={
                "method": request.method,
                "path": str(request.url.path),
                "query_params": str(request.query_params),
                "client_ip": request.client.host if request.client else "unknown",
                "user_agent": request.headers.get("user-agent", "")
            }
        )
        
        response = await call_next(request)
        
        # Log response
        duration = time.time() - start_time
        logger.info(
            f"Response {response.status_code}",
            extra={
                "status_code": response.status_code,
                "duration_ms": round(duration * 1000, 2),
                "content_length": response.headers.get("content-length", "unknown")
            }
        )
        
        return response

class SecurityMiddleware(BaseHTTPMiddleware):
    """Security middleware for threat detection"""
    
    def __init__(self, app):
        super().__init__(app)
        self.suspicious_patterns = [
            "admin", "administrator", "root", "test", "guest",
            "password", "passwd", "pwd", "pass",
            "sql", "union", "select", "drop", "insert", "update", "delete",
            "<script>", "javascript:", "eval(", "alert("
        ]
        self.rate_limit_cache = {}
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "")
        
        # Check for suspicious patterns in URL
        url_path = str(request.url.path).lower()
        query_string = str(request.url.query).lower()
        
        suspicious_activity = []
        
        for pattern in self.suspicious_patterns:
            if pattern in url_path or pattern in query_string:
                suspicious_activity.append(f"Suspicious pattern: {pattern}")
        
        # Check for excessive requests (simple rate limiting)
        current_time = time.time()
        if client_ip in self.rate_limit_cache:
            requests = self.rate_limit_cache[client_ip]
            # Remove old requests (older than 1 minute)
            requests = [req_time for req_time in requests if current_time - req_time < 60]
            
            if len(requests) > 100:  # More than 100 requests per minute
                security_logger.log_rate_limit_exceeded(
                    endpoint=str(request.url.path),
                    ip_address=client_ip,
                    user_id=getattr(request.state, 'user_id', None)
                )
                suspicious_activity.append("Rate limit exceeded")
        else:
            requests = []
        
        requests.append(current_time)
        self.rate_limit_cache[client_ip] = requests
        
        # Log suspicious activity
        if suspicious_activity:
            security_logger.log_suspicious_activity(
                activity="Multiple suspicious patterns detected",
                details={
                    "patterns": suspicious_activity,
                    "url": str(request.url),
                    "method": request.method
                },
                ip_address=client_ip,
                user_id=getattr(request.state, 'user_id', None)
            )
        
        return await call_next(request)

# Error response helpers
def create_validation_error_response(errors: list) -> JSONResponse:
    """Create standardized validation error response"""
    return JSONResponse(
        status_code=422,
        content={
            "error": "ValidationError",
            "message": "Request validation failed",
            "details": {"validation_errors": errors}
        }
    )

def create_not_found_response(resource: str, identifier: str) -> JSONResponse:
    """Create standardized not found response"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "NotFound",
            "message": f"{resource} not found",
            "details": {"resource": resource, "identifier": identifier}
        }
    )

def create_unauthorized_response(message: str = "Authentication required") -> JSONResponse:
    """Create standardized unauthorized response"""
    return JSONResponse(
        status_code=401,
        content={
            "error": "Unauthorized",
            "message": message,
            "details": {"auth_required": True}
        }
    )

# Exception handlers for FastAPI
async def cinevivid_exception_handler(request: Request, exc: CineVividException):
    """Global exception handler for CineVivid exceptions"""
    request_id = getattr(request.state, 'request_id', str(uuid.uuid4())[:8])
    
    response_data = exc.to_dict()
    response_data["request_id"] = request_id
    
    return JSONResponse(
        status_code=exc.status_code,
        content=response_data
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    """Global exception handler for HTTP exceptions"""
    request_id = getattr(request.state, 'request_id', str(uuid.uuid4())[:8])
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP{exc.status_code}",
            "message": exc.detail,
            "request_id": request_id
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unexpected exceptions"""
    request_id = getattr(request.state, 'request_id', str(uuid.uuid4())[:8])
    
    # Log the error
    logger.error(
        "Unhandled exception",
        extra={"request_id": request_id},
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "An internal server error occurred",
            "request_id": request_id
        }
    )

# Health check helper
class HealthChecker:
    """System health checker"""
    
    @staticmethod
    def check_database() -> Dict[str, Any]:
        """Check database health"""
        try:
            from ..db.database import check_database_connection
            return {
                "status": "healthy" if check_database_connection() else "unhealthy",
                "service": "database"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "database",
                "error": str(e)
            }
    
    @staticmethod
    def check_redis() -> Dict[str, Any]:
        """Check Redis health"""
        try:
            import redis
            import os
            
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
            r = redis.from_url(redis_url)
            r.ping()
            
            return {
                "status": "healthy",
                "service": "redis"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "redis",
                "error": str(e)
            }
    
    @staticmethod
    def check_disk_space() -> Dict[str, Any]:
        """Check available disk space"""
        try:
            import shutil
            
            # Check main directory
            total, used, free = shutil.disk_usage(".")
            free_gb = free // (1024**3)
            
            status = "healthy" if free_gb > 5 else "warning"  # Warn if less than 5GB free
            
            return {
                "status": status,
                "service": "disk_space",
                "free_gb": free_gb,
                "warning_threshold": "5GB"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "disk_space",
                "error": str(e)
            }
    
    @staticmethod
    def check_gpu() -> Dict[str, Any]:
        """Check GPU availability"""
        try:
            import torch
            
            if torch.cuda.is_available():
                gpu_count = torch.cuda.device_count()
                current_device = torch.cuda.current_device()
                gpu_name = torch.cuda.get_device_name(current_device)
                
                # Check GPU memory
                memory_allocated = torch.cuda.memory_allocated(current_device) // (1024**3)
                memory_total = torch.cuda.get_device_properties(current_device).total_memory // (1024**3)
                memory_free = memory_total - memory_allocated
                
                return {
                    "status": "healthy",
                    "service": "gpu",
                    "available": True,
                    "count": gpu_count,
                    "name": gpu_name,
                    "memory_gb": {
                        "total": memory_total,
                        "used": memory_allocated,
                        "free": memory_free
                    }
                }
            else:
                return {
                    "status": "warning",
                    "service": "gpu",
                    "available": False,
                    "message": "GPU not available, using CPU"
                }
        except Exception as e:
            return {
                "status": "unhealthy",
                "service": "gpu",
                "error": str(e)
            }
    
    @classmethod
    def comprehensive_health_check(cls) -> Dict[str, Any]:
        """Run all health checks"""
        checks = {
            "database": cls.check_database(),
            "redis": cls.check_redis(),
            "disk_space": cls.check_disk_space(),
            "gpu": cls.check_gpu()
        }
        
        # Determine overall status
        all_healthy = all(check["status"] == "healthy" for check in checks.values())
        has_warnings = any(check["status"] == "warning" for check in checks.values())
        
        overall_status = "healthy" if all_healthy else ("warning" if has_warnings else "unhealthy")
        
        return {
            "overall_status": overall_status,
            "checks": checks,
            "timestamp": time.time()
        }

# Export middleware components
__all__ = [
    'ErrorHandlingMiddleware',
    'RequestLoggingMiddleware',
    'SecurityMiddleware',
    'HealthChecker',
    'cinevivid_exception_handler',
    'http_exception_handler',
    'generic_exception_handler',
    'create_validation_error_response',
    'create_not_found_response',
    'create_unauthorized_response'
]