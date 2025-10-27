import logging
from logging.config import dictConfig

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
        "level": "INFO",
        "handlers": ["console"]
    },
}


def setup_logging():
    dictConfig(logging_config)
