from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User, UserRole, VerificationStatus
from app.schemas import UserCreate, UserResponse, Token, UserVerificationUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.rbac import get_current_user, require_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new Farmer, FPO, Buyer, or Logistics provider"""
    # Check if email exists
    result_email = await db.execute(select(User).where(User.email == user_in.email))
    if result_email.scalars().first():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Check if phone number exists
    result_phone = await db.execute(select(User).where(User.phone_number == user_in.phone_number))
    if result_phone.scalars().first():
        raise HTTPException(status_code=400, detail="User with this phone number already exists")

    # Auto-verify farmers & admins for ease, PENDING for Institutional Buyers / FPOs
    auto_verify = VerificationStatus.VERIFIED if user_in.role in (UserRole.FARMER, UserRole.ADMIN) else VerificationStatus.PENDING

    db_user = User(
        email=user_in.email,
        phone_number=user_in.phone_number,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        verification_status=auto_verify,
        fpo_name=user_in.fpo_name,
        company_name=user_in.company_name,
        gstin_or_registration=user_in.gstin_or_registration,
        state=user_in.state,
        district=user_in.district,
        sub_district=user_in.sub_district,
        village=user_in.village,
        pincode=user_in.pincode,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """OAuth2 compatible login endpoint (username can be email or phone number)"""
    # Query user by email or phone
    query = select(User).where((User.email == form_data.username) | (User.phone_number == form_data.username))
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id, role=user.role.value)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get profile of current authenticated user"""
    return current_user


@router.put("/users/{user_id}/verify", response_model=UserResponse, dependencies=[Depends(require_admin)])
async def verify_user_account(
    user_id: int,
    verify_in: UserVerificationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Admin endpoint to verify or reject FPO / Buyer registration"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.verification_status = verify_in.verification_status
    await db.commit()
    await db.refresh(user)
    return user
