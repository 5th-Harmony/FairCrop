from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User, UserRole, VerificationStatus
from app.schemas import UserResponse, UserUpdate
from app.core.rbac import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["Users Management"])


@router.get("/", response_model=List[UserResponse], dependencies=[Depends(require_admin)])
async def list_users(
    role: Optional[UserRole] = None,
    verification_status: Optional[VerificationStatus] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Admin user listing with filters"""
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if verification_status:
        query = query.where(User.verification_status == verification_status)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.put("/me", response_model=UserResponse)
async def update_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile info"""
    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)
    return current_user
