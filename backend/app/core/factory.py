from functools import lru_cache
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Core dependencies
from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.database.database import engine
from app.models import models

logger = get_logger(__name__)


def create_app() -> FastAPI:
    """Creates and configures the FastAPI application with all middleware and routes"""

    # Setup logging
    setup_logging(settings.environment)

    # Create database tables
    models.Base.metadata.create_all(bind=engine)

    # Initialize FastAPI app
    app = FastAPI(
        title=settings.app_name,
        description="AI-powered portfolio backend with chatbot",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Import and include routers here to avoid circular imports
    from app.routers import health, projects, profile

    app.include_router(health.router, prefix="/api", tags=["Health"])
    app.include_router(projects.router, prefix="/api", tags=["Projects"])
    app.include_router(profile.router, prefix="/api", tags=["Profile"])

    # Add startup and shutdown events
    app.add_event_handler("startup", startup_handler)
    app.add_event_handler("shutdown", shutdown_handler)

    # Root endpoint
    @app.get("/", tags=["Root"])
    def read_root():
        """Root endpoint with API information"""
        return {
            "message": "Roy's AI Portfolio API",
            "version": "1.0.0",
            "status": "running",
            "environment": settings.environment,
            "docs": "/docs",
            "health": "/api/health",
            "projects": "/api/projects"
        }

    return app


async def startup_handler():
    """Application startup handler"""
    logger.info(f"🚀 {settings.app_name} is starting up!")
    logger.info(f"📊 Database URL: {settings.database_url}")
    logger.info(f"🔄 Redis URL: {settings.redis_url}")
    logger.info(f"🌍 Environment: {settings.environment}")

    # Initialize services
    redis_svc = get_redis_service()
    await redis_svc.test_connection()

    # Test database connection
    db_svc = get_database_service()
    if await db_svc.test_connection():
        logger.info("✅ Database connection successful")
    else:
        logger.error("❌ Database connection failed")


async def shutdown_handler():
    """Application shutdown handler"""
    logger.info("🛑 Application is shutting down...")


# Service factories with caching
@lru_cache()
def get_redis_service():
    """Creates and caches Redis service instance"""
    from app.services.redis_service import RedisService
    return RedisService()


@lru_cache()
def get_github_service():
    """Creates and caches GitHub service instance"""
    from app.services.github_service import GitHubService
    return GitHubService()


@lru_cache()
def get_database_service():
    """Creates and caches Database service instance"""
    from app.services.database_service import DatabaseService
    return DatabaseService()
