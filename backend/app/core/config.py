from typing import List, Optional
from pydantic import SecretStr, EmailStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """
    Application configuration settings.
    Prioritizes environment variables (from .env or system) over default values.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

    # --- Identity & App Config ---
    APP_NAME: str = "AI Portfolio API"
    PORTFOLIO_OWNER: str = "Roy Amit"
    RESUME_LINK: str = ""
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    USER_AGENT: str = "PortfolioBot/1.0"

    # --- Security ---
    # Comma-separated list of allowed origins (e.g., frontend URLs)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # --- Database (Postgres) ---
    # If DATABASE_URL is set (Production), it takes precedence over individual components.
    DATABASE_URL: Optional[str] = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "portfolio_db"

    # --- AI & RAG ---
    OPENAI_API_KEY: SecretStr
    OPENAI_MODEL: str = "gpt-4o-mini"
    VECTOR_DB_COLLECTION: str = "portfolio_documents_v2"

    # --- Caching (Redis) ---
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # --- Email Service (Resend) ---
    RESEND_API_KEY: SecretStr
    RESEND_FROM: str = "onboarding@resend.dev"
    OWNER_EMAIL: EmailStr

    # --- Social Platforms ---
    GITHUB_USERNAME: Optional[str] = None
    GITHUB_TOKEN: Optional[SecretStr] = None
    LINKEDIN_USERNAME: Optional[str] = None
    DEVTO_USERNAME: Optional[str] = None

    # --- Debugging (LangSmith) ---
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGCHAIN_API_KEY: Optional[SecretStr] = None
    LANGCHAIN_PROJECT: str = "Portfolio Chatbot"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parses the CORS_ORIGINS string into a list for FastAPI."""
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @model_validator(mode='after')
    def assemble_connection_urls(self):
        """
        Constructs full connection URLs for Redis and Postgres if they aren't explicitly provided.
        This simplifies switching between local Docker setups and production cloud URLs.
        """
        if not self.REDIS_URL:
            self.REDIS_URL = f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"

        if not self.DATABASE_URL:
            # Using postgresql+psycopg for async SQLAlchemy compatibility
            self.DATABASE_URL = (
                f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )

        return self


# Initialize global settings instance
settings = Settings()
