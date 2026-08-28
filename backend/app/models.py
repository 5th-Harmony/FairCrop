import enum
import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text, Boolean, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base


# ══════════════════════════════════════════════════════════════
# ENUMS
# ══════════════════════════════════════════════════════════════

class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    FPO = "FPO"
    BUYER = "BUYER"
    LOGISTICS = "LOGISTICS"
    ADMIN = "ADMIN"


class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class ProduceGrade(str, enum.Enum):
    GRADE_A = "GRADE_A"
    GRADE_B = "GRADE_B"
    GRADE_C = "GRADE_C"
    ORGANIC = "ORGANIC"
    PREMIUM = "PREMIUM"


class ProduceStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    UNDER_NEGOTIATION = "UNDER_NEGOTIATION"
    SOLD = "SOLD"
    EXPIRED = "EXPIRED"


class OfferStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    COUNTERED = "COUNTERED"
    EXPIRED = "EXPIRED"


class TransactionStatus(str, enum.Enum):
    INITIATED = "INITIATED"
    ESCROW_DEPOSITED = "ESCROW_DEPOSITED"
    DISPATCHED = "DISPATCHED"
    DELIVERED = "DELIVERED"
    ESCROW_RELEASED = "ESCROW_RELEASED"
    DISPUTED = "DISPUTED"
    CANCELLED = "CANCELLED"


class GrievanceCategory(str, enum.Enum):
    QUALITY_MISMATCH = "QUALITY_MISMATCH"
    QUANTITY_DEFICIT = "QUANTITY_DEFICIT"
    LOGISTICS_DELAY = "LOGISTICS_DELAY"
    PAYMENT_DISPUTE = "PAYMENT_DISPUTE"
    DAMAGE = "DAMAGE"
    OTHER = "OTHER"


class GrievanceStatus(str, enum.Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


# ══════════════════════════════════════════════════════════════
# DATABASE MODELS
# ══════════════════════════════════════════════════════════════

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.FARMER, nullable=False)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)

    # Multi-tenant profile fields
    fpo_name = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    gstin_or_registration = Column(String, nullable=True)

    # Address / Geo Location
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    sub_district = Column(String, nullable=True)
    village = Column(String, nullable=True)
    pincode = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    produce_lots = relationship("ProduceLot", back_populates="farmer", cascade="all, delete-orphan")
    trade_offers = relationship("TradeOffer", back_populates="buyer", cascade="all, delete-orphan")
    buyer_transactions = relationship("Transaction", foreign_keys="Transaction.buyer_id", back_populates="buyer")
    seller_transactions = relationship("Transaction", foreign_keys="Transaction.seller_id", back_populates="seller")
    grievances_raised = relationship("Grievance", back_populates="raised_by")


class ProduceLot(Base):
    __tablename__ = "produce_lots"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String, index=True, nullable=False)
    variety = Column(String, nullable=True)
    quantity_kg = Column(Float, nullable=False)
    price_per_kg_expected = Column(Float, nullable=False)
    grade = Column(Enum(ProduceGrade), default=ProduceGrade.GRADE_A, nullable=False)
    moisture_percentage = Column(Float, nullable=True)
    harvest_date = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    storage_location = Column(String, nullable=False)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    image_urls = Column(JSON, default=list)  # List of image URLs
    status = Column(Enum(ProduceStatus), default=ProduceStatus.AVAILABLE, nullable=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    farmer = relationship("User", back_populates="produce_lots")
    offers = relationship("TradeOffer", back_populates="produce_lot", cascade="all, delete-orphan")


class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=False)
    mandi_name = Column(String, index=True, nullable=False)
    crop_name = Column(String, index=True, nullable=False)
    variety = Column(String, nullable=True)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    price_date = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    source = Column(String, default="e-NAM")  # e-NAM, Agmarknet, Local Scraper

    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class TradeOffer(Base):
    __tablename__ = "trade_offers"

    id = Column(Integer, primary_key=True, index=True)
    produce_lot_id = Column(Integer, ForeignKey("produce_lots.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    offered_price_per_kg = Column(Float, nullable=False)
    offered_quantity_kg = Column(Float, nullable=False)
    total_offer_value = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(Enum(OfferStatus), default=OfferStatus.PENDING, nullable=False)
    valid_until = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    produce_lot = relationship("ProduceLot", back_populates="offers")
    buyer = relationship("User", back_populates="trade_offers")
    transaction = relationship("Transaction", back_populates="trade_offer", uselist=False)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    trade_offer_id = Column(Integer, ForeignKey("trade_offers.id"), nullable=False, unique=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    escrow_amount = Column(Float, nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.INITIATED, nullable=False)
    payment_reference = Column(String, nullable=True)
    delivery_address = Column(Text, nullable=False)
    expected_delivery_date = Column(DateTime, nullable=True)
    tracking_number = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    trade_offer = relationship("TradeOffer", back_populates="transaction")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="buyer_transactions")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="seller_transactions")
    grievances = relationship("Grievance", back_populates="transaction")


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)
    raised_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(Enum(GrievanceCategory), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence_images = Column(JSON, default=list)
    status = Column(Enum(GrievanceStatus), default=GrievanceStatus.OPEN, nullable=False)
    resolution_notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    transaction = relationship("Transaction", back_populates="grievances")
    raised_by = relationship("User", back_populates="grievances_raised")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    lang_code = Column(String, index=True, nullable=False)
    key = Column(String, index=True, nullable=False)
    translation = Column(Text, nullable=False)
    category = Column(String, default="ui", index=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
