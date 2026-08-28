from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.produce import router as produce_router
from app.api.v1.marketplace import router as marketplace_router
from app.api.v1.intelligence import router as intelligence_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.grievances import router as grievances_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(produce_router)
api_router.include_router(marketplace_router)
api_router.include_router(intelligence_router)
api_router.include_router(transactions_router)
api_router.include_router(grievances_router)
