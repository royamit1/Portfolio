from pydantic import SecretStr, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Core App
    APP_NAME: str = "AI Portfolio API"
    LOG_LEVEL: str = "INFO"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # --- PostgreSQL Configuration ---
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
    def REDIS_URL(self) -> str:
        """Constructs the full Redis URL."""
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"

    @property
    def DATABASE_URL(self) -> str:
        """
        Constructs the PostgreSQL connection string.
        We use the 'postgresql+psycopg' driver which is standard for LangChain/SQLAlchemy.
        """
        return f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


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
