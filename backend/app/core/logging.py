from logging.config import dictConfig
from app.core.config import settings

LOG_LEVEL = settings.LOG_LEVEL.upper()

logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        }
    },
    "root": {
        "level": LOG_LEVEL,
        "handlers": ["console"]
    },
}


def setup_logging():
    dictConfig(logging_config)
