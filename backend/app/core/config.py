import os
from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig

load_dotenv()

# Ensure required environment variables exist
required_vars = [
    "MAIL_USERNAME", "MAIL_PASSWORD", "MAIL_FROM",
    "MAIL_PORT", "MAIL_SERVER", "OWNER_EMAIL", "DATABASE_URL", "OPENAI_API_KEY"
]
for var in required_vars:
    if not os.getenv(var):
        raise ValueError(f"Missing env var: {var}")

EMAIL_CONF = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

OWNER_EMAIL = os.getenv("OWNER_EMAIL")
DATABASE_URL = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
