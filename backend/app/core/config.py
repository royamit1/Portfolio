from pydantic import SecretStr, EmailStr
from pydantic_settings import BaseSettings
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Core App
    APP_NAME: str = "AI Portfolio API"
    LOG_LEVEL: str = "INFO"

    # OpenAI
    OPENAI_API_KEY: SecretStr

    # Database (kept for potential future use, but not required by the app currently)
    DATABASE_URL: str = "sqlite:///./test.db" # Default to a safe value

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Email Configuration
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    OWNER_EMAIL: EmailStr

    class Config:
        # This tells Pydantic to read variables from the .env file
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = 'ignore'

# Create a single settings instance
settings = Settings()

# Create the email connection config from the settings instance
# .get_secret_value() is used to access the actual string from a SecretStr
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
