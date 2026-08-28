import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models import (
    UserRole, VerificationStatus, ProduceGrade, ProduceStatus,
    OfferStatus, TransactionStatus, GrievanceCategory, GrievanceStatus
)


# ══════════════════════════════════════════════════════════════
# USER SCHEMAS
# ══════════════════════════════════════════════════════════════

class UserBase(BaseModel):
    email: EmailStr
    phone_number: str
    full_name: str
    role: UserRole = UserRole.FARMER
    fpo_name: Optional[str] = None
    company_name: Optional[str] = None
    gstin_or_registration: Optional[str] = None
    state: str
    district: str
    sub_district: Optional[str] = None
    village: Optional[str] = None
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    fpo_name: Optional[str] = None
    company_name: Optional[str] = None
    gstin_or_registration: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    sub_district: Optional[str] = None
    village: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserVerificationUpdate(BaseModel):
    verification_status: VerificationStatus


class UserResponse(UserBase):
    id: int
    verification_status: VerificationStatus
    is_active: bool
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


# ══════════════════════════════════════════════════════════════
# AUTH / TOKEN SCHEMAS
# ══════════════════════════════════════════════════════════════

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[UserRole] = None


# ══════════════════════════════════════════════════════════════
# PRODUCE LOT SCHEMAS
# ══════════════════════════════════════════════════════════════

class ProduceLotBase(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    quantity_kg: float = Field(..., gt=0)
    price_per_kg_expected: float = Field(..., gt=0)
    grade: ProduceGrade = ProduceGrade.GRADE_A
    moisture_percentage: Optional[float] = None
    harvest_date: datetime.datetime
    expiry_date: Optional[datetime.datetime] = None
    storage_location: str
    state: str
    district: str
    image_urls: List[str] = []


class ProduceLotCreate(ProduceLotBase):
    pass


class ProduceLotUpdate(BaseModel):
    crop_name: Optional[str] = None
    variety: Optional[str] = None
    quantity_kg: Optional[float] = Field(None, gt=0)
    price_per_kg_expected: Optional[float] = Field(None, gt=0)
    grade: Optional[ProduceGrade] = None
    moisture_percentage: Optional[float] = None
    harvest_date: Optional[datetime.datetime] = None
    expiry_date: Optional[datetime.datetime] = None
    storage_location: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    image_urls: Optional[List[str]] = None
    status: Optional[ProduceStatus] = None


class ProduceLotResponse(ProduceLotBase):
    id: int
    farmer_id: int
    status: ProduceStatus
    created_at: datetime.datetime
    farmer: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ══════════════════════════════════════════════════════════════
# MARKET PRICE & FORECAST SCHEMAS
# ══════════════════════════════════════════════════════════════

class MarketPriceBase(BaseModel):
    state: str
    district: str
    mandi_name: str
    crop_name: str
    variety: Optional[str] = None
    min_price: float
    max_price: float
    modal_price: float
    price_date: datetime.datetime
    source: str = "e-NAM"


class MarketPriceCreate(MarketPriceBase):
    pass


class MarketPriceResponse(MarketPriceBase):
    id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class ForecastPoint(BaseModel):
    date: str
    predicted_modal_price: float
    confidence_lower: float
    confidence_upper: float


class PriceForecastResponse(BaseModel):
    crop_name: str
    state: str
    district: str
    mandi_name: str
    current_modal_price: float
    forecast_7d: List[ForecastPoint]
    recommended_sale_window: str
    advice_summary: str


# ══════════════════════════════════════════════════════════════
# TRADE OFFER SCHEMAS
# ══════════════════════════════════════════════════════════════

class TradeOfferBase(BaseModel):
    produce_lot_id: int
    offered_price_per_kg: float = Field(..., gt=0)
    offered_quantity_kg: float = Field(..., gt=0)
    message: Optional[str] = None
    valid_until: Optional[datetime.datetime] = None


class TradeOfferCreate(TradeOfferBase):
    pass


class TradeOfferUpdate(BaseModel):
    status: OfferStatus
    offered_price_per_kg: Optional[float] = Field(None, gt=0)
    offered_quantity_kg: Optional[float] = Field(None, gt=0)


class TradeOfferResponse(TradeOfferBase):
    id: int
    buyer_id: int
    total_offer_value: float
    status: OfferStatus
    created_at: datetime.datetime
    buyer: Optional[UserResponse] = None
    produce_lot: Optional[ProduceLotResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ══════════════════════════════════════════════════════════════
# TRANSACTION SCHEMAS
# ══════════════════════════════════════════════════════════════

class TransactionCreate(BaseModel):
    trade_offer_id: int
    delivery_address: str
    expected_delivery_date: Optional[datetime.datetime] = None


class TransactionStatusUpdate(BaseModel):
    status: TransactionStatus
    payment_reference: Optional[str] = None
    tracking_number: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    trade_offer_id: int
    buyer_id: int
    seller_id: int
    total_amount: float
    escrow_amount: float
    status: TransactionStatus
    payment_reference: Optional[str] = None
    delivery_address: str
    expected_delivery_date: Optional[datetime.datetime] = None
    tracking_number: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None
    trade_offer: Optional[TradeOfferResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ══════════════════════════════════════════════════════════════
# GRIEVANCE / DISPUTE SCHEMAS
# ══════════════════════════════════════════════════════════════

class GrievanceCreate(BaseModel):
    transaction_id: int
    category: GrievanceCategory
    title: str
    description: str
    evidence_images: List[str] = []


class GrievanceStatusUpdate(BaseModel):
    status: GrievanceStatus
    resolution_notes: Optional[str] = None


class GrievanceResponse(BaseModel):
    id: int
    transaction_id: int
    raised_by_id: int
    category: GrievanceCategory
    title: str
    description: str
    evidence_images: List[str]
    status: GrievanceStatus
    resolution_notes: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    raised_by: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
