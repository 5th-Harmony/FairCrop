from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router
from app.database import async_engine, AsyncSessionLocal, Base
from app.services.enam_integration import enam_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables asynchronously
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed benchmark mandi prices for intelligence engine
    async with AsyncSessionLocal() as session:
        await enam_service.seed_initial_market_prices(session)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
    }


# Include unified API v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)
