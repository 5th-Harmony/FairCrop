import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings
    SettingsConfigDict = None


class Settings(BaseSettings):
    PROJECT_NAME: str = "Agritech Market Linkage Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agritech_super_secret_jwt_key_sih_2026_change_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./agritech.db" if os.name == "nt" else "postgresql+asyncpg://postgres:postgres@localhost:5432/agritech_db"
    )

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:19006",
        "http://localhost:8081",
        "http://127.0.0.1:3000",
        "*"
    ]

    if SettingsConfigDict:
        model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")
    else:
        class Config:
            case_sensitive = True
            env_file = ".env"
            extra = "ignore"


settings = Settings()
