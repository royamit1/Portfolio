from logging.config import dictConfig
from app.core.config import settings


def setup_logging():
    """
    Configures the application-wide logging based on the environment settings.
    """
    # specific fallback to INFO ensures the app doesn't crash on config errors
    log_level = getattr(settings, "LOG_LEVEL", "INFO").upper()

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
                "stream": "ext://sys.stdout",  # Explicitly log to stdout (good for Docker/Cloud)
            }
        },
        "root": {
            "level": log_level,
            "handlers": ["console"]
        },
        # You can add specific logger overrides here (e.g., to silence noisy libraries)
        "loggers": {
            "uvicorn.access": {
                "level": "WARNING",  # Reduce HTTP access log noise in dev
                "propagate": False
            }
        }
    }

    dictConfig(logging_config)
