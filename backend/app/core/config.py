from pydantic import SecretStr, EmailStr
from pydantic_settings import BaseSettings
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv
from typing import Optional

load_dotenv()


class Settings(BaseSettings):
    # Core App
    APP_NAME: str = "AI Portfolio API"
    LOG_LEVEL: str = "INFO"

    # OpenAI
    OPENAI_API_KEY: SecretStr

    # Database
    DATABASE_URL: str = "sqlite:///./test.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Email Configuration
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    OWNER_EMAIL: EmailStr

    # --- NEW: LangSmith Configuration ---
    # Set this to 'true' to enable tracing
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_ENDPOINT: Optional[str] = "https://api.smith.langchain.com"
    LANGCHAIN_API_KEY: Optional[SecretStr] = None
    # You can set a project name for better organization in LangSmith
    LANGCHAIN_PROJECT: Optional[str] = "Portfolio Chatbot"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = 'ignore'


# Create a single settings instance
settings = Settings()

# Create the email connection config from the settings instance
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
