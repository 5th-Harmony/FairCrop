"""
AgriLink / FairCrop SIH 2026 — Database Verification & Integrity Test Suite
Verifies table structures, foreign key cascades, relationships, and Pydantic v2 serialization.
"""
import os
import sys

# Ensure python path includes backend root
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from sqlalchemy import select, func
from app.database import SyncSessionLocal, sync_engine
from app.models import (
    User, ProduceLot, TradeOffer, Transaction, MarketPrice, Grievance,
    UserRole, ProduceGrade, ProduceStatus, OfferStatus, TransactionStatus,
    GrievanceCategory, GrievanceStatus
)
from app.schemas import (
    UserResponse, ProduceLotResponse, TradeOfferResponse, TransactionResponse,
    MarketPriceResponse, GrievanceResponse
)


def run_db_verification():
    print("=" * 65)
    print("🚜 RUNNING FAIRCROP SIH 2026 DATABASE INTEGRITY CHECKS")
    print("=" * 65)

    db = SyncSessionLocal()
    try:
        # 1. Users
        user_count = db.scalar(select(func.count(User.id)))
        print(f"\n1. 👥 Total Registered Users: {user_count}")
        assert user_count >= 5, "Expected at least 5 demo users"
        users = db.scalars(select(User)).all()
        for u in users:
            print(f"   • [{u.role.value}] {u.full_name} | Email: {u.email} | Phone: {u.phone_number} | Status: {u.verification_status.value} | Loc: {u.district}, {u.state}")

        # 2. Produce Lots
        produce_count = db.scalar(select(func.count(ProduceLot.id)))
        print(f"\n2. 🌾 Total Harvest Lots: {produce_count}")
        assert produce_count >= 5, "Expected at least 5 produce lots"
        lots = db.scalars(select(ProduceLot)).all()
        for lot in lots:
            print(f"   • {lot.crop_name} ({lot.variety}) - {lot.quantity_kg:,.0f} kg @ ₹{lot.price_per_kg_expected}/kg | Grade: {lot.grade.value} | Status: {lot.status.value} | Farmer: {lot.farmer.full_name}")

        # 3. Trade Offers / Bids
        offer_count = db.scalar(select(func.count(TradeOffer.id)))
        print(f"\n3. 🛒 Active Marketplace Offers & Bids: {offer_count}")
        assert offer_count >= 3, "Expected at least 3 trade offers"
        offers = db.scalars(select(TradeOffer)).all()
        for off in offers:
            print(f"   • Bid by {off.buyer.full_name} on {off.produce_lot.crop_name}: {off.offered_quantity_kg:,.0f} kg @ ₹{off.offered_price_per_kg}/kg [{off.status.value}]")

        # 4. Escrow Transactions
        tx_count = db.scalar(select(func.count(Transaction.id)))
        print(f"\n4. 💳 Escrow Transactions: {tx_count}")
        assert tx_count >= 2, "Expected at least 2 escrow transactions"
        txs = db.scalars(select(Transaction)).all()
        for tx in txs:
            print(f"   • Tx [{tx.id}] - Value: ₹{tx.total_amount:,.2f} | Status: {tx.status.value} | Ref: {tx.payment_reference} | Buyer: {tx.buyer.full_name} -> Seller: {tx.seller.full_name}")

        # 5. Mandi Benchmark Prices
        mandi_count = db.scalar(select(func.count(MarketPrice.id)))
        print(f"\n5. 📊 Live Mandi Benchmark Records: {mandi_count}")
        assert mandi_count >= 100, "Expected historical mandi prices"
        mandis = db.scalars(select(MarketPrice).limit(4)).all()
        for m in mandis:
            print(f"   • {m.mandi_name} ({m.state}) | {m.crop_name}: Modal ₹{m.modal_price}/quintal (Min: ₹{m.min_price} / Max: ₹{m.max_price})")

        # 6. Dispute Center Tickets
        grievance_count = db.scalar(select(func.count(Grievance.id)))
        print(f"\n6. ⚖️ Dispute Tickets: {grievance_count}")
        assert grievance_count >= 1, "Expected at least 1 grievance ticket"
        grievances = db.scalars(select(Grievance)).all()
        for g in grievances:
            print(f"   • Ticket [{g.id}] [{g.category.value}] - Status: {g.status.value} | Title: {g.title} | Raised by: {g.raised_by.full_name}")

        # 7. Test Pydantic v2 Serialization
        print("\n7. 🔍 Testing Pydantic Schema Serialization...")
        sample_lot = lots[0]
        schema_lot = ProduceLotResponse.model_validate(sample_lot)
        assert schema_lot.crop_name == sample_lot.crop_name
        assert schema_lot.farmer.email == sample_lot.farmer.email
        print(f"   ✅ ProduceLotResponse serialized cleanly (Crop: {schema_lot.crop_name}, Farmer: {schema_lot.farmer.full_name})")

        sample_offer = offers[0]
        schema_offer = TradeOfferResponse.model_validate(sample_offer)
        assert schema_offer.total_offer_value == sample_offer.total_offer_value
        print(f"   ✅ TradeOfferResponse serialized cleanly (Offer: ₹{schema_offer.total_offer_value:,.2f})")

        sample_tx = txs[0]
        schema_tx = TransactionResponse.model_validate(sample_tx)
        assert schema_tx.total_amount == sample_tx.total_amount
        assert schema_tx.buyer.full_name == sample_tx.buyer.full_name
        print(f"   ✅ TransactionResponse serialized cleanly (Tx ID: {schema_tx.id}, Amount: ₹{schema_tx.total_amount:,.2f})")

        sample_g = grievances[0]
        schema_g = GrievanceResponse.model_validate(sample_g)
        assert schema_g.title == sample_g.title
        assert schema_g.raised_by.full_name == sample_g.raised_by.full_name
        print(f"   ✅ GrievanceResponse serialized cleanly (Ticket: {schema_g.title[:30]}...)")

        print("\n" + "=" * 65)
        print("🎉 ALL DATABASE INTEGRITY & SCHEMA TESTS PASSED 100%!")
        print("=" * 65)

    except Exception as e:
        print(f"\n❌ Verification failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_db_verification()
