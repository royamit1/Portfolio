import logging
import sys
from typing import Optional


def setup_logging(environment: str = "development") -> None:
    """Setup logging configuration"""
    # Map environment to logging level
    level_mapping = {
        "development": "DEBUG",
        "staging": "INFO",
        "production": "WARNING"
    }

    # Get the appropriate logging level, default to INFO
    log_level = level_mapping.get(environment.lower(), "INFO")

    logging.basicConfig(
        level=getattr(logging, log_level),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """Get a logger instance"""
    if not name:
        name = __name__
    return logging.getLogger(name)
