from fastapi import APIRouter
from app.core.factory import get_redis_service, get_database_service
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""

    # Test database connection
    db_svc = get_database_service()
    db_healthy = await db_svc.test_connection()
    db_status = "healthy" if db_healthy else "error"

    if db_healthy:
        logger.debug("Database health check passed")
    else:
        logger.error("Database health check failed")

    # Test Redis connection
    redis_svc = get_redis_service()
    redis_healthy = await redis_svc.test_connection()
    redis_status = "healthy" if redis_healthy else "disconnected"

    if not redis_healthy:
        logger.warning("Redis is not connected")

    # Overall status
    overall_status = "healthy" if db_status == "healthy" and redis_status == "healthy" else "degraded"

    return {
        "status": overall_status,
        "database": db_status,
        "redis": redis_status,
        "environment": settings.environment,
        "version": "1.0.0"
    }
