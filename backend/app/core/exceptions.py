from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
import logging

logger = logging.getLogger(__name__)

async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded exceptions.
    Logs the incident and returns a user-friendly JSON response.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.warning(
        f"Rate limit exceeded for IP {client_ip} on path {request.url.path}"
    )

    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": "You've made too many requests. Please wait a moment and try again.",
            "path": str(request.url.path),
        },
        headers={
            "Retry-After": "60"  # Suggests client wait 60 seconds
        }
    )
