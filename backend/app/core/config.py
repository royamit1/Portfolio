from pydantic import SecretStr, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

# Load environment variables explicitly (optional but safe)
load_dotenv()


class Settings(BaseSettings):
    # This configures Pydantic to read your .env file automatically
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # --- Core App ---
    APP_NAME: str = "AI Portfolio API"
    LOG_LEVEL: str = "INFO"

    # --- Redis Configuration ---
    # Default to "localhost" for local development (fixes the Windows crash).
    # When running in Docker, you can set REDIS_HOST=redis in your .env file.
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # --- OpenAI ---
    OPENAI_API_KEY: SecretStr

    # --- Email Configuration ---
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    OWNER_EMAIL: EmailStr

    # --- LangSmith Configuration ---
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_ENDPOINT: Optional[str] = "https://api.smith.langchain.com"
    LANGCHAIN_API_KEY: Optional[SecretStr] = None
    LANGCHAIN_PROJECT: Optional[str] = "Portfolio Chatbot"

    # --- Computed Properties ---
    @property
    def REDIS_URL(self) -> str:
        """
        Constructs the full Redis URL from the host and port.
        This ensures compatibility with the rest of your app that expects settings.REDIS_URL.
        """
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"


# Create a single settings instance
settings = Settings()

# Create the email connection config
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
