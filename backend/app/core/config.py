from pydantic import SecretStr, EmailStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # --- 1. Portfolio Identity (Template Magic) ---
    # This defaults to "Roy Amit" so it keeps working for you locally,
    # but other users can override it in their .env file.
    PORTFOLIO_OWNER: str = "Roy Amit"

    # --- 2. RAG Configuration ---
    # Allows users (and you) to version-up the DB by changing one string
    # Default is the one currently in your production
    VECTOR_DB_COLLECTION: str = "portfolio_documents_v2"

    # Core App
    APP_NAME: str = "AI Portfolio API"
    LOG_LEVEL: str = "INFO"

    # --- 3. CORS Configuration ---
    # Default includes your specific domains.
    # Template users will override this string in their .env.
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,https://royamit.vercel.app,https://www.royamit.vercel.app"

    # --- Redis Configuration ---
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # --- PostgreSQL Configuration ---
    DATABASE_URL: Optional[str] = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "portfolio_db"

    # OpenAI
    OPENAI_API_KEY: SecretStr

    # Email Configuration
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    OWNER_EMAIL: EmailStr

    # LangSmith Configuration
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_ENDPOINT: Optional[str] = "https://api.smith.langchain.com"
    LANGCHAIN_API_KEY: Optional[SecretStr] = None
    LANGCHAIN_PROJECT: Optional[str] = "Portfolio Chatbot"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parses the comma-separated CORS string into a list."""
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @model_validator(mode='after')
    def assemble_urls(self):
        """
        Prioritizes the full URL environment variables (for Render).
        If missing, constructs them from the individual components (for Localhost).
        """
        # 1. Handle Redis
        if not self.REDIS_URL:
            self.REDIS_URL = f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"

        # 2. Handle Postgres
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

        return self


# Create a single settings instance
settings = Settings()

EMAIL_CONF = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD.get_secret_value(),
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
