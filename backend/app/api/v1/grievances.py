from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, UserRole, Grievance, GrievanceStatus, Transaction, TransactionStatus
from app.schemas import GrievanceCreate, GrievanceResponse, GrievanceStatusUpdate
from app.core.rbac import get_current_user, require_admin

router = APIRouter(prefix="/grievances", tags=["Grievances & Quality Disputes"])


@router.post("/", response_model=GrievanceResponse, status_code=status.HTTP_201_CREATED)
async def raise_grievance_ticket(
    grievance_in: GrievanceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """File a quality dispute or payment grievance ticket for a transaction"""
    query_tx = select(Transaction).where(Transaction.id == grievance_in.transaction_id)
    res_tx = await db.execute(query_tx)
    tx = res_tx.scalars().first()

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if tx.buyer_id != current_user.id and tx.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to raise a dispute on this transaction")

    db_grievance = Grievance(
        transaction_id=grievance_in.transaction_id,
        raised_by_id=current_user.id,
        category=grievance_in.category,
        title=grievance_in.title,
        description=grievance_in.description,
        evidence_images=grievance_in.evidence_images,
        status=GrievanceStatus.OPEN
    )
    db.add(db_grievance)

    # Put transaction into DISPUTED state
    tx.status = TransactionStatus.DISPUTED

    await db.commit()
    await db.refresh(db_grievance)

    query_g = select(Grievance).where(Grievance.id == db_grievance.id).options(selectinload(Grievance.raised_by))
    res_g = await db.execute(query_g)
    return res_g.scalars().first()


@router.get("/", response_model=List[GrievanceResponse])
async def list_my_grievances(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List grievances filed by or involving current user, or all for admin"""
    if current_user.role == UserRole.ADMIN:
        query = select(Grievance).options(
            selectinload(Grievance.raised_by)
        ).order_by(Grievance.created_at.desc())
    else:
        query = select(Grievance).where(Grievance.raised_by_id == current_user.id).options(
            selectinload(Grievance.raised_by)
        ).order_by(Grievance.created_at.desc())

    result = await db.execute(query)
    return result.scalars().all()


@router.put("/{grievance_id}/resolve", response_model=GrievanceResponse, dependencies=[Depends(require_admin)])
async def resolve_grievance_ticket(
    grievance_id: int,
    resolve_in: GrievanceStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Admin endpoint to resolve quality dispute tickets and issue escrow decisions"""
    query = select(Grievance).where(Grievance.id == grievance_id).options(selectinload(Grievance.raised_by))
    result = await db.execute(query)
    grievance = result.scalars().first()

    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    grievance.status = resolve_in.status
    if resolve_in.resolution_notes:
        grievance.resolution_notes = resolve_in.resolution_notes

    await db.commit()
    await db.refresh(grievance)
    return grievance
