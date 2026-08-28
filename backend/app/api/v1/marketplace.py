from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, UserRole, ProduceLot, ProduceStatus, ProduceGrade, TradeOffer, OfferStatus, Transaction, TransactionStatus
from app.schemas import (
    ProduceLotResponse, TradeOfferCreate, TradeOfferResponse, TradeOfferUpdate, TransactionResponse
)
from app.core.rbac import get_current_user, require_buyer, require_farmer_or_buyer
from app.services.matchmaking import matchmaking_engine

router = APIRouter(prefix="/marketplace", tags=["Marketplace & Bidding"])


@router.get("/lots", response_model=List[ProduceLotResponse])
async def search_produce_marketplace(
    crop_name: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    min_quantity_kg: Optional[float] = None,
    max_price_per_kg: Optional[float] = None,
    grade: Optional[ProduceGrade] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Marketplace discovery feed with multi-criteria filtering"""
    query = select(ProduceLot).where(ProduceLot.status == ProduceStatus.AVAILABLE).options(selectinload(ProduceLot.farmer))

    if crop_name:
        query = query.where(ProduceLot.crop_name.ilike(f"%{crop_name}%"))
    if state:
        query = query.where(ProduceLot.state.ilike(f"%{state}%"))
    if district:
        query = query.where(ProduceLot.district.ilike(f"%{district}%"))
    if min_quantity_kg:
        query = query.where(ProduceLot.quantity_kg >= min_quantity_kg)
    if max_price_per_kg:
        query = query.where(ProduceLot.price_per_kg_expected <= max_price_per_kg)
    if grade:
        query = query.where(ProduceLot.grade == grade)

    query = query.order_by(ProduceLot.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/matchmaking")
async def smart_matchmaking_search(
    crop_name: str,
    desired_min_qty: Optional[float] = None,
    desired_max_price: Optional[float] = None,
    preferred_grade: Optional[ProduceGrade] = None,
    preferred_state: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Smart algorithmic matchmaking returning ranked produce lots by compatibility score"""
    query = select(ProduceLot).where(ProduceLot.status == ProduceStatus.AVAILABLE).options(selectinload(ProduceLot.farmer))
    result = await db.execute(query)
    all_lots = result.scalars().all()

    ranked = matchmaking_engine.match_produce_for_buyer(
        lots=all_lots,
        desired_crop=crop_name,
        desired_min_qty=desired_min_qty,
        desired_max_price=desired_max_price,
        preferred_grade=preferred_grade,
        preferred_state=preferred_state
    )

    formatted_response = []
    for item in ranked:
        lot = item["produce_lot"]
        formatted_response.append({
            "match_score_percentage": item["match_score_percentage"],
            "produce_lot": ProduceLotResponse.model_validate(lot)
        })
    return formatted_response


@router.post("/offers", response_model=TradeOfferResponse, status_code=status.HTTP_201_CREATED)
async def place_trade_offer(
    offer_in: TradeOfferCreate,
    current_user: User = Depends(require_buyer),
    db: AsyncSession = Depends(get_db)
):
    """Institutional Buyer endpoint to place a bid on a produce lot"""
    query = select(ProduceLot).where(ProduceLot.id == offer_in.produce_lot_id)
    result = await db.execute(query)
    lot = result.scalars().first()

    if not lot:
        raise HTTPException(status_code=404, detail="Produce lot not found")
    if lot.status != ProduceStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Produce lot is no longer available for offers")

    total_value = offer_in.offered_price_per_kg * offer_in.offered_quantity_kg

    db_offer = TradeOffer(
        produce_lot_id=offer_in.produce_lot_id,
        buyer_id=current_user.id,
        offered_price_per_kg=offer_in.offered_price_per_kg,
        offered_quantity_kg=offer_in.offered_quantity_kg,
        total_offer_value=total_value,
        message=offer_in.message,
        valid_until=offer_in.valid_until,
        status=OfferStatus.PENDING,
    )
    db.add(db_offer)
    await db.commit()
    await db.refresh(db_offer)

    # Load relations for response
    query_offer = select(TradeOffer).where(TradeOffer.id == db_offer.id).options(
        selectinload(TradeOffer.buyer),
        selectinload(TradeOffer.produce_lot).selectinload(ProduceLot.farmer)
    )
    res_offer = await db.execute(query_offer)
    return res_offer.scalars().first()


@router.get("/offers/incoming", response_model=List[TradeOfferResponse])
async def get_incoming_offers_for_farmer(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Farmer / FPO view of incoming buyer bids on their produce lots, or all for admin"""
    if current_user.role == UserRole.ADMIN:
        query = select(TradeOffer).options(
            selectinload(TradeOffer.buyer),
            selectinload(TradeOffer.produce_lot).selectinload(ProduceLot.farmer)
        ).order_by(TradeOffer.created_at.desc())
    else:
        query = select(TradeOffer).join(ProduceLot).where(ProduceLot.farmer_id == current_user.id).options(
            selectinload(TradeOffer.buyer),
            selectinload(TradeOffer.produce_lot).selectinload(ProduceLot.farmer)
        ).order_by(TradeOffer.created_at.desc())

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/offers/my-bids", response_model=List[TradeOfferResponse])
async def get_my_bids_for_buyer(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Buyer view of bids they have placed on produce lots"""
    query = select(TradeOffer).where(TradeOffer.buyer_id == current_user.id).options(
        selectinload(TradeOffer.buyer),
        selectinload(TradeOffer.produce_lot).selectinload(ProduceLot.farmer)
    ).order_by(TradeOffer.created_at.desc())

    result = await db.execute(query)
    return result.scalars().all()


@router.put("/offers/{offer_id}/respond", response_model=TradeOfferResponse)
async def respond_to_trade_offer(
    offer_id: int,
    response_in: TradeOfferUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Farmer accepts, rejects, or counters a buyer offer"""
    query = select(TradeOffer).where(TradeOffer.id == offer_id).options(
        selectinload(TradeOffer.produce_lot).selectinload(ProduceLot.farmer),
        selectinload(TradeOffer.buyer)
    )
    result = await db.execute(query)
    offer = result.scalars().first()

    if not offer:
        raise HTTPException(status_code=404, detail="Trade offer not found")

    if offer.produce_lot.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to respond to this offer")

    if offer.produce_lot.status == ProduceStatus.SOLD:
        raise HTTPException(status_code=400, detail="Produce lot has already been sold")

    offer.status = response_in.status

    if response_in.status == OfferStatus.ACCEPTED:
        # Update produce lot status to UNDER_NEGOTIATION
        offer.produce_lot.status = ProduceStatus.UNDER_NEGOTIATION

        # Expire other pending offers for this lot
        query_other = select(TradeOffer).where(
            (TradeOffer.produce_lot_id == offer.produce_lot_id) &
            (TradeOffer.id != offer.id) &
            (TradeOffer.status == OfferStatus.PENDING)
        )
        res_other = await db.execute(query_other)
        for other_offer in res_other.scalars().all():
            other_offer.status = OfferStatus.EXPIRED

        # Automatically create escrow transaction
        existing_tx = await db.execute(select(Transaction).where(Transaction.trade_offer_id == offer.id))
        if not existing_tx.scalars().first():
            transaction = Transaction(
                trade_offer_id=offer.id,
                buyer_id=offer.buyer_id,
                seller_id=offer.produce_lot.farmer_id,
                total_amount=offer.total_offer_value,
                escrow_amount=offer.total_offer_value,
                status=TransactionStatus.INITIATED,
                delivery_address=offer.produce_lot.storage_location
            )
            db.add(transaction)

    await db.commit()
    await db.refresh(offer)
    return offer
