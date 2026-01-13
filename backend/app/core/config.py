from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Union
from pydantic import field_validator
import json


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "NovaVote API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database (asyncpg)
    DATABASE_URL: str = "postgresql+asyncpg://novavote:novavote_secure_pass@db:5432/novavote"
    
    # Redis
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Auth
    SECRET_KEY: str = "YOUR_SECRET_KEY_CHANGE_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MAGIC_LINK_EXPIRE_MINUTES: int = 15
    
    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3001", "http://web:3001"]
    
    # Public URL (for generating links in emails)
    PUBLIC_URL: str = "http://localhost:3001"
    
    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(',')]
        return v
    
    # Crypto
    CRYPTO_KEY_SIZE: int = 2048
    
    # Storage (IPFS mock for MVP)
    STORAGE_MODE: str = "local"  # "local" or "ipfs"
    STORAGE_PATH: str = "/app/storage"
    
    # Email
    MAIL_ENABLED: bool = True
    MAIL_FROM: str = "noreply@novavote.local"
    MAIL_FROM_NAME: str = "NovaVote Platform"
    MAIL_SERVER: str = "mailhog"
    MAIL_PORT: int = 1025
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_USE_TLS: bool = False
    MAIL_USE_SSL: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
