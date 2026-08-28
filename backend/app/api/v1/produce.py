from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, UserRole, ProduceLot, ProduceStatus, ProduceGrade
from app.schemas import ProduceLotCreate, ProduceLotUpdate, ProduceLotResponse
from app.core.rbac import get_current_user, require_farmer

router = APIRouter(prefix="/produce", tags=["Produce Lots"])


@router.post("/", response_model=ProduceLotResponse, status_code=status.HTTP_201_CREATED)
async def create_produce_lot(
    lot_in: ProduceLotCreate,
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """Farmer / FPO endpoint to list a new harvest produce lot"""
    db_lot = ProduceLot(
        farmer_id=current_user.id,
        crop_name=lot_in.crop_name,
        variety=lot_in.variety,
        quantity_kg=lot_in.quantity_kg,
        price_per_kg_expected=lot_in.price_per_kg_expected,
        grade=lot_in.grade,
        moisture_percentage=lot_in.moisture_percentage,
        harvest_date=lot_in.harvest_date,
        expiry_date=lot_in.expiry_date,
        storage_location=lot_in.storage_location,
        state=lot_in.state,
        district=lot_in.district,
        image_urls=lot_in.image_urls,
        status=ProduceStatus.AVAILABLE,
    )
    db.add(db_lot)
    await db.commit()
    await db.refresh(db_lot)
    return db_lot


@router.get("/my-lots", response_model=List[ProduceLotResponse])
async def get_my_produce_lots(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all produce lots listed by the current farmer/FPO or all for admin"""
    if current_user.role == UserRole.ADMIN:
        query = select(ProduceLot).options(selectinload(ProduceLot.farmer)).order_by(ProduceLot.created_at.desc())
    else:
        query = select(ProduceLot).where(ProduceLot.farmer_id == current_user.id).options(selectinload(ProduceLot.farmer)).order_by(ProduceLot.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{lot_id}", response_model=ProduceLotResponse)
async def get_produce_lot_by_id(
    lot_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get single produce lot details"""
    query = select(ProduceLot).where(ProduceLot.id == lot_id).options(selectinload(ProduceLot.farmer))
    result = await db.execute(query)
    lot = result.scalars().first()
    if not lot:
        raise HTTPException(status_code=404, detail="Produce lot not found")
    return lot


@router.put("/{lot_id}", response_model=ProduceLotResponse)
async def update_produce_lot(
    lot_id: int,
    lot_in: ProduceLotUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update produce lot (only by owner farmer or Admin)"""
    query = select(ProduceLot).where(ProduceLot.id == lot_id)
    result = await db.execute(query)
    lot = result.scalars().first()

    if not lot:
        raise HTTPException(status_code=404, detail="Produce lot not found")
    if lot.farmer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to modify this produce lot")

    update_data = lot_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lot, field, value)

    await db.commit()
    await db.refresh(lot)
    return lot
