import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

logger = logging.getLogger(__name__)


async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """
    Global handler for 429 Rate Limit errors.
    Logs the source IP and returns a user-friendly JSON response.
    """
    client_ip = request.client.host if request.client else "unknown"

    logger.warning(f"Rate limit exceeded: IP={client_ip} Path={request.url.path}")

    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": "You have made too many requests. Please wait a moment and try again."
        },
        # A static 60s retry header is a safe default to prevent client spam
        headers={"Retry-After": "60"}
    )
