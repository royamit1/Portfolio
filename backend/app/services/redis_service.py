import json
import redis
from typing import Optional, Any
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class RedisService:
    def __init__(self):
        self.client: Optional[redis.Redis] = None
        self._connect()

    def _connect(self) -> None:
        """Initialize Redis connection"""
        try:
            self.client = redis.from_url(settings.redis_url, decode_responses=True)
            self.client.ping()
            logger.info("✅ Connected to Redis")
        except Exception as e:
            logger.error(f"❌ Redis connection failed: {e}")
            self.client = None

    async def test_connection(self) -> bool:
        """Test Redis connection"""
        if not self.client:
            return False
        try:
            return self.client.ping()
        except Exception as e:
            logger.error(f"Redis connection test failed: {e}")
            return False

    def set_cache(self, key: str, value: Any, expiration: int = 3600) -> bool:
        """Set cache value with expiration"""
        if not self.client:
            return False
        try:
            serialized_value = json.dumps(value) if not isinstance(value, str) else value
            self.client.setex(key, expiration, serialized_value)
            return True
        except Exception as e:
            logger.error(f"Failed to set cache for key {key}: {e}")
            return False

    def get_cache(self, key: str) -> Optional[Any]:
        """Get cache value"""
        if not self.client:
            return None
        try:
            value = self.client.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
        except Exception as e:
            logger.error(f"Failed to get cache for key {key}: {e}")
            return None

    def delete_cache(self, key: str) -> bool:
        """Delete cache value"""
        if not self.client:
            return False
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            logger.error(f"Failed to delete cache for key {key}: {e}")
            return False

    def is_connected(self) -> bool:
        """Check if Redis is connected"""
        return self.client is not None


# Global Redis service instance
redis_service = RedisService()
