import os
from typing import AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.core.config import settings

# Single source of truth from configuration settings
DATABASE_URL = settings.DATABASE_URL

# Convert standard postgresql:// to postgresql+asyncpg:// if needed
if DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    ASYNC_DATABASE_URL = DATABASE_URL

# Sync engine for migrations/fallback
SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://").replace("sqlite+aiosqlite://", "sqlite://")
if SYNC_DATABASE_URL.startswith("sqlite"):
    sync_engine = create_engine(SYNC_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    try:
        sync_engine = create_engine(SYNC_DATABASE_URL, pool_pre_ping=True)
    except Exception:
        sync_engine = create_engine("sqlite:///./agritech.db", connect_args={"check_same_thread": False})

# Async Engine for FastAPI async requests
if "sqlite" in ASYNC_DATABASE_URL:
    async_engine = create_async_engine(ASYNC_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=False, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI Async DB Dependency"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
