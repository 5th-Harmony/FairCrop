from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.security import decode_access_token
from app.models import User, UserRole
from app.schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    token_data = TokenData(user_id=int(user_id), role=payload.get("role"))

    result = await db.execute(select(User).where(User.id == token_data.user_id))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")

    return user


class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {[r.value for r in self.allowed_roles]}"
            )
        return current_user


# Helper dependencies
require_farmer = RoleChecker([UserRole.FARMER, UserRole.FPO])
require_buyer = RoleChecker([UserRole.BUYER])
require_logistics = RoleChecker([UserRole.LOGISTICS])
require_admin = RoleChecker([UserRole.ADMIN])
require_farmer_or_buyer = RoleChecker([UserRole.FARMER, UserRole.FPO, UserRole.BUYER])
