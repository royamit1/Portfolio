from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)


def get_session_key(request: Request) -> str:
    """
    Session-based key for fine-grained per-user limiting.
    Uses X-Session-ID header if available, falls back to IP.
    """
    session_id = request.headers.get("X-Session-ID")

    if session_id:
        identifier = f"session:{session_id}"
        logger.info(f"Rate limit key: session:{session_id[:8]}... for {request.url.path}")
        return identifier

    ip = get_remote_address(request)
    logger.info(f"Rate limit key: ip:{ip} for {request.url.path}")
    return f"ip:{ip}"


def get_ip_key(request: Request) -> str:
    """
    IP-based key for hard limits that can't be bypassed by rotating session IDs.
    This is the anti-abuse backstop.
    """
    ip = get_remote_address(request)
    return f"ip-hard:{ip}"


# Session-based limiter — for normal per-user UX limits
limiter = Limiter(key_func=get_session_key)

# IP-based limiter — hard ceiling that can't be bypassed
ip_limiter = Limiter(key_func=get_ip_key)

