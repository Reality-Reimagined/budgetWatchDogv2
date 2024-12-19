from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
import redis

class CacheManager:

    @staticmethod
    def initialize_cache():
        redis_client = redis.Redis(host="localhost", port=6379, db=0)
        FastAPICache.init(RedisBackend(redis_client), prefix="financial_watchdog")
