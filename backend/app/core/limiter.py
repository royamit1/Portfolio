from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)

def get_user_identifier(request: Request) -> str:
    """
    Custom key function for rate limiting.
    Uses session ID from X-Session-ID header if available, otherwise falls back to IP.
    This allows per-user rate limiting without authentication.
    """
    # Try to get session ID from custom header
    session_id = request.headers.get("X-Session-ID")
    
    if session_id:
        # Use session ID for more accurate per-user tracking
        identifier = f"session:{session_id}"
        # Log first 8 chars for debugging (maintain some privacy)
        logger.info(f"Rate limit key: session:{session_id[:8]}... for {request.url.path}")
        return identifier
    
    # Fallback to IP-based rate limiting
    ip = get_remote_address(request)
    logger.info(f"Rate limit key: ip:{ip} for {request.url.path}")
    return f"ip:{ip}"

# Initialize the global rate limiter with custom key function
limiter = Limiter(key_func=get_user_identifier)
