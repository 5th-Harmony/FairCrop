from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, UserRole, Transaction, TransactionStatus, ProduceLot, ProduceStatus, TradeOffer
from app.schemas import TransactionResponse, TransactionStatusUpdate
from app.core.rbac import get_current_user

router = APIRouter(prefix="/transactions", tags=["Escrow & Transactions"])


def get_transaction_options():
    return [
        selectinload(Transaction.buyer),
        selectinload(Transaction.seller),
        selectinload(Transaction.trade_offer).selectinload(TradeOffer.buyer),
        selectinload(Transaction.trade_offer).selectinload(TradeOffer.produce_lot).selectinload(ProduceLot.farmer)
    ]


@router.get("/", response_model=List[TransactionResponse])
async def list_user_transactions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List transactions for the authenticated buyer, seller, logistics, or admin"""
    if current_user.role in [UserRole.ADMIN, UserRole.LOGISTICS]:
        query = select(Transaction).options(*get_transaction_options()).order_by(Transaction.created_at.desc())
    else:
        query = select(Transaction).where(
            (Transaction.buyer_id == current_user.id) | (Transaction.seller_id == current_user.id)
        ).options(*get_transaction_options()).order_by(Transaction.created_at.desc())

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction_details(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get single transaction escrow state and details"""
    query = select(Transaction).where(Transaction.id == transaction_id).options(*get_transaction_options())
    result = await db.execute(query)
    tx = result.scalars().first()

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if tx.buyer_id != current_user.id and tx.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to view this transaction")

    return tx


@router.put("/{transaction_id}/status", response_model=TransactionResponse)
async def update_escrow_status(
    transaction_id: int,
    status_in: TransactionStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update transaction escrow state machine (e.g. deposit funds, dispatch, mark delivered, release escrow, cancel)"""
    query = select(Transaction).where(Transaction.id == transaction_id).options(*get_transaction_options())
    result = await db.execute(query)
    tx = result.scalars().first()

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if tx.buyer_id != current_user.id and tx.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to update this transaction")

    tx.status = status_in.status
    if status_in.payment_reference:
        tx.payment_reference = status_in.payment_reference

    # Handle ProduceLot status based on transaction outcome
    if tx.trade_offer:
        query_lot = select(ProduceLot).where(ProduceLot.id == tx.trade_offer.produce_lot_id)
        res_lot = await db.execute(query_lot)
        lot = res_lot.scalars().first()
        if lot:
            if status_in.status == TransactionStatus.ESCROW_RELEASED:
                lot.status = ProduceStatus.SOLD
            elif status_in.status == TransactionStatus.CANCELLED:
                lot.status = ProduceStatus.AVAILABLE

    await db.commit()
    await db.refresh(tx)
    return tx
