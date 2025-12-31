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
        extra="ignore",
        case_sensitive=True
    )

    # =========================================================
    # 1. PORTFOLIO IDENTITY
    # =========================================================
    # Defaults allow you to run without .env, but .env overrides them.
    PORTFOLIO_OWNER: str = "Roy Amit"
    RESUME_LINK: str = ""

    # =========================================================
    # 2. SECURITY & NETWORKING
    # =========================================================
    # Default is localhost only. .env adds production domains.
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    ENVIRONMENT: str = "development"

    # =========================================================
    # 3. DATABASE
    # =========================================================
    # Required for Production (Neon)
    DATABASE_URL: Optional[str] = None

    # Required for Local Docker (Defaults provided)
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "portfolio_db"

    # =========================================================
    # 4. AI & RAG
    # =========================================================
    OPENAI_API_KEY: SecretStr
    OPENAI_MODEL: str = "gpt-4o-mini"
    VECTOR_DB_COLLECTION: str = "portfolio_documents_v2"

    # =========================================================
    # 5. CACHING (REDIS)
    # =========================================================
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # =========================================================
    # 6. EMAIL
    # =========================================================
    MAIL_USERNAME: str
    MAIL_PASSWORD: SecretStr
    MAIL_FROM: EmailStr
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    OWNER_EMAIL: EmailStr

    # =========================================================
    # 7. SOCIAL DATA
    # =========================================================
    GITHUB_USERNAME: Optional[str] = None
    GITHUB_TOKEN: Optional[SecretStr] = None
    LINKEDIN_USERNAME: Optional[str] = None
    DEVTO_USERNAME: Optional[str] = None
    USER_AGENT: str = "PortfolioBot/1.0"

    # =========================================================
    # 8. DEBUGGING (LANGSMITH)
    # =========================================================
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGCHAIN_API_KEY: Optional[SecretStr] = None

    # Internal App Config (Not in .env, but good to have)
    APP_NAME: str = "AI Portfolio API"
    LOG_LEVEL: str = "INFO"
    LANGCHAIN_PROJECT: str = "Portfolio Chatbot"

    # --- COMPUTED PROPERTIES ---

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
