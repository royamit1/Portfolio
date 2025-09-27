from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://portfolio_user:portfolio_password@localhost:5432/portfolio_db"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # GitHub
    github_username: str = "royamit1"
    github_token: Optional[str] = None

    # AI Service
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None

    # Security
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # App
    app_name: str = "Roy's AI Portfolio"
    environment: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
