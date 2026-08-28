"""
FairCrop / AgriLink Database Seeder — SIH 2026
Initializes SQLite / PostgreSQL database tables and seeds complete demo datasets,
users across all 5 roles, produce lots, offers, escrow transactions, disputes, and mandi prices.
"""
import os
import sys
import datetime
import random

# Ensure python path includes backend root
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.database import Base, sync_engine, SyncSessionLocal
from app.core.security import get_password_hash
from app.models import (
    User, UserRole, VerificationStatus,
    ProduceLot, ProduceGrade, ProduceStatus,
    TradeOffer, OfferStatus,
    Transaction, TransactionStatus,
    Grievance, GrievanceCategory, GrievanceStatus,
    MarketPrice
)

DEFAULT_MANDIS = [
    {"state": "Punjab", "district": "Ludhiana", "mandi": "Ludhiana Mandi"},
    {"state": "Haryana", "district": "Karnal", "mandi": "Karnal Mandi"},
    {"state": "Maharashtra", "district": "Nashik", "mandi": "Lasalgaon Mandi"},
    {"state": "Maharashtra", "district": "Mumbai", "mandi": "Vashi APMC"},
    {"state": "Delhi", "district": "North Delhi", "mandi": "Azadpur Mandi"},
    {"state": "Uttar Pradesh", "district": "Agra", "mandi": "Agra Central Mandi"},
    {"state": "Madhya Pradesh", "district": "Indore", "mandi": "Indore Mandi"},
    {"state": "Karnataka", "district": "Kolar", "mandi": "Kolar APMC"},
    {"state": "Karnataka", "district": "Bengaluru", "mandi": "Yeshwantpur Mandi"},
    {"state": "Telangana", "district": "Hyderabad", "mandi": "Bowenpally Market"},
    {"state": "Gujarat", "district": "Surat", "mandi": "Surat APMC"},
    {"state": "Rajasthan", "district": "Kota", "mandi": "Kota Mandi"},
]

CROP_PRICE_BOUNDS = {
    "Wheat": (2100.0, 2650.0),
    "Basmati Rice": (3400.0, 4800.0),
    "Rice": (2600.0, 3400.0),
    "Tomato": (1200.0, 2400.0),
    "Potato": (1100.0, 1950.0),
    "Onion": (1600.0, 3100.0),
    "Cotton": (6200.0, 7800.0),
    "Soybean": (4000.0, 4950.0),
    "Maize": (1850.0, 2450.0),
    "Mustard": (4900.0, 5950.0),
    "Gram": (5200.0, 6100.0),
}


def seed_database():
    print("=" * 65)
    print("🌾 INITIALIZING FAIRCROP DATABASE & SEEDING DEMO ECOSYSTEM")
    print("=" * 65)

    print("1. Creating Database Tables...")
    Base.metadata.drop_all(bind=sync_engine)
    Base.metadata.create_all(bind=sync_engine)
    print("   ✅ Tables created successfully.")

    db = SyncSessionLocal()
    try:
        now = datetime.datetime.now(datetime.timezone.utc)

        # ── 1. Core Users (Exact Demo Logins for UI + Extended Real Users) ──
        print("\n2. 🌱 Seeding Multi-Tenant Users...")
        users = [
            # Primary Demo Accounts (for frontend 1-click login)
            User(
                email="farmer@faircrop.in",
                phone_number="9876543210",
                hashed_password=get_password_hash("farmer123"),
                full_name="Ramesh Singh",
                role=UserRole.FARMER,
                verification_status=VerificationStatus.VERIFIED,
                state="Punjab",
                district="Ludhiana",
                sub_district="Ludhiana East",
                village="Gill",
                pincode="141001",
                latitude=30.8600,
                longitude=75.8573
            ),
            User(
                email="fpo@faircrop.in",
                phone_number="9876543211",
                hashed_password=get_password_hash("fpo123"),
                full_name="Kisan Vikas Producer Co.",
                role=UserRole.FPO,
                fpo_name="Kisan Vikas Agro Producer Co.",
                gstin_or_registration="FPO27AAACK1234F1Z5",
                verification_status=VerificationStatus.VERIFIED,
                state="Maharashtra",
                district="Nashik",
                sub_district="Lasalgaon",
                village="Pimpalgaon",
                pincode="422306",
                latitude=20.0059,
                longitude=73.7898
            ),
            User(
                email="buyer@faircrop.in",
                phone_number="9876543212",
                hashed_password=get_password_hash("buyer123"),
                full_name="AgroCorp Processing Ltd",
                role=UserRole.BUYER,
                company_name="AgroCorp Processing India Ltd",
                gstin_or_registration="06AAACA1234A1Z9",
                verification_status=VerificationStatus.VERIFIED,
                state="Haryana",
                district="Gurugram",
                pincode="122001",
                latitude=28.4595,
                longitude=77.0266
            ),
            User(
                email="logistics@faircrop.in",
                phone_number="9876543213",
                hashed_password=get_password_hash("logistics123"),
                full_name="Gati Kisan Supply Chain",
                role=UserRole.LOGISTICS,
                company_name="Gati Kisan Express Logistics",
                gstin_or_registration="07AAACG5678B1Z2",
                verification_status=VerificationStatus.VERIFIED,
                state="Delhi",
                district="New Delhi",
                pincode="110001",
                latitude=28.6139,
                longitude=77.2090
            ),
            User(
                email="admin@faircrop.in",
                phone_number="9876543214",
                hashed_password=get_password_hash("admin123"),
                full_name="Ministry Administrator",
                role=UserRole.ADMIN,
                verification_status=VerificationStatus.VERIFIED,
                state="Delhi",
                district="New Delhi",
                pincode="110001",
                latitude=28.6139,
                longitude=77.2090
            ),
            # Additional Regional Farmers
            User(
                email="gurpreet.dhillon@faircrop.in",
                phone_number="9814055667",
                hashed_password=get_password_hash("farmer123"),
                full_name="Gurpreet Singh Dhillon",
                role=UserRole.FARMER,
                verification_status=VerificationStatus.VERIFIED,
                state="Punjab",
                district="Ludhiana",
                sub_district="Khanna",
                village="Alour",
                pincode="141401",
                latitude=30.7073,
                longitude=76.2163
            ),
            User(
                email="suresh.patel@faircrop.in",
                phone_number="9723488990",
                hashed_password=get_password_hash("farmer123"),
                full_name="Suresh Kumar Patel",
                role=UserRole.FARMER,
                verification_status=VerificationStatus.VERIFIED,
                state="Gujarat",
                district="Anand",
                sub_district="Petlad",
                village="Dharmaj",
                pincode="388430",
                latitude=22.4172,
                longitude=72.7964
            ),
            # Additional FPOs
            User(
                email="procurements@sahyadrifarms.com",
                phone_number="9860012345",
                hashed_password=get_password_hash("fpo123"),
                full_name="Sahyadri Farmers Producer Company",
                role=UserRole.FPO,
                verification_status=VerificationStatus.VERIFIED,
                fpo_name="Sahyadri Farmer Producer Co-operative Ltd",
                gstin_or_registration="27AABCS1429B1Z8",
                state="Maharashtra",
                district="Nashik",
                sub_district="Dindori",
                village="Mohadi",
                pincode="422207",
                latitude=20.1983,
                longitude=73.8341
            ),
            User(
                email="malwa.fpo@faircrop.in",
                phone_number="9872299881",
                hashed_password=get_password_hash("fpo123"),
                full_name="Malwa Agro Producer Org",
                role=UserRole.FPO,
                verification_status=VerificationStatus.PENDING,
                fpo_name="Malwa Golden Grain FPO Society",
                gstin_or_registration="03AAEFM9912C1Z4",
                state="Punjab",
                district="Bathinda",
                sub_district="Talwandi Sabo",
                village="Raman",
                pincode="151301",
                latitude=29.9882,
                longitude=74.9654
            ),
            # Additional Enterprise Institutional Buyers
            User(
                email="itc.procure@itc.in",
                phone_number="9820044556",
                hashed_password=get_password_hash("buyer123"),
                full_name="ITC Agri-Business Division",
                role=UserRole.BUYER,
                verification_status=VerificationStatus.VERIFIED,
                company_name="ITC Limited - Agri Business",
                gstin_or_registration="27AAACI1681G1ZM",
                state="Maharashtra",
                district="Pune",
                pincode="411028",
                latitude=18.5089,
                longitude=73.9259
            ),
            User(
                email="procurement@bigbasket.com",
                phone_number="9845011223",
                hashed_password=get_password_hash("buyer123"),
                full_name="BigBasket Fresh Procurement",
                role=UserRole.BUYER,
                verification_status=VerificationStatus.PENDING,
                company_name="Innovative Retail Concepts Pvt Ltd",
                gstin_or_registration="29AAACI4567H1ZN",
                state="Karnataka",
                district="Bengaluru",
                pincode="560068",
                latitude=12.9141,
                longitude=77.6101
            ),
        ]
        db.add_all(users)
        db.commit()
        for u in users:
            db.refresh(u)
        print(f"   ✅ Seeded {len(users)} users across 5 roles.")

        # Map users by email for relation references
        u_map = {u.email: u for u in users}
        u_farmer = u_map["farmer@faircrop.in"]
        u_gurpreet = u_map["gurpreet.dhillon@faircrop.in"]
        u_suresh = u_map["suresh.patel@faircrop.in"]
        u_fpo = u_map["fpo@faircrop.in"]
        u_sahyadri = u_map["procurements@sahyadrifarms.com"]
        u_buyer = u_map["buyer@faircrop.in"]
        u_itc = u_map["itc.procure@itc.in"]

        # ── 2. Produce Lots ──
        print("\n3. 🌾 Seeding Produce Lots...")
        lots = [
            ProduceLot(
                farmer_id=u_farmer.id,
                crop_name="Wheat",
                variety="Sharbati Premium",
                quantity_kg=5000.0,
                price_per_kg_expected=24.5,
                grade=ProduceGrade.GRADE_A,
                moisture_percentage=11.2,
                harvest_date=now - datetime.timedelta(days=10),
                expiry_date=now + datetime.timedelta(days=120),
                storage_location="Vault 4, Ludhiana Central Ag Warehouse",
                state="Punjab",
                district="Ludhiana",
                image_urls=["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
            ProduceLot(
                farmer_id=u_farmer.id,
                crop_name="Basmati Rice",
                variety="Pusa 1121",
                quantity_kg=8000.0,
                price_per_kg_expected=48.0,
                grade=ProduceGrade.PREMIUM,
                moisture_percentage=12.0,
                harvest_date=now - datetime.timedelta(days=14),
                expiry_date=now + datetime.timedelta(days=180),
                storage_location="Shed B, Karnal Grain Terminal",
                state="Haryana",
                district="Karnal",
                image_urls=["https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
            ProduceLot(
                farmer_id=u_farmer.id,
                crop_name="Tomato",
                variety="Hybrid Red",
                quantity_kg=2500.0,
                price_per_kg_expected=22.0,
                grade=ProduceGrade.GRADE_A,
                moisture_percentage=85.0,
                harvest_date=now - datetime.timedelta(days=2),
                expiry_date=now + datetime.timedelta(days=12),
                storage_location="Kolar Cold Storage Unit 2",
                state="Karnataka",
                district="Kolar",
                image_urls=["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80"],
                status=ProduceStatus.UNDER_NEGOTIATION
            ),
            ProduceLot(
                farmer_id=u_farmer.id,
                crop_name="Onion",
                variety="Nasik Red",
                quantity_kg=10000.0,
                price_per_kg_expected=18.5,
                grade=ProduceGrade.GRADE_A,
                moisture_percentage=14.0,
                harvest_date=now - datetime.timedelta(days=8),
                expiry_date=now + datetime.timedelta(days=90),
                storage_location="Lasalgaon Warehouse Bay 3",
                state="Maharashtra",
                district="Nashik",
                image_urls=["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
            ProduceLot(
                farmer_id=u_fpo.id,
                crop_name="Cotton",
                variety="Shankar-6 Long Staple",
                quantity_kg=25000.0,
                price_per_kg_expected=72.0,
                grade=ProduceGrade.PREMIUM,
                moisture_percentage=8.5,
                harvest_date=now - datetime.timedelta(days=18),
                expiry_date=now + datetime.timedelta(days=240),
                storage_location="Nashik FPO Central Ginning Yard",
                state="Maharashtra",
                district="Nashik",
                image_urls=["https://images.unsplash.com/photo-1567892737950-30c4e36b48e8?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
            ProduceLot(
                farmer_id=u_fpo.id,
                crop_name="Soybean",
                variety="JS 335 Yellow",
                quantity_kg=15000.0,
                price_per_kg_expected=45.0,
                grade=ProduceGrade.GRADE_A,
                moisture_percentage=10.0,
                harvest_date=now - datetime.timedelta(days=12),
                expiry_date=now + datetime.timedelta(days=150),
                storage_location="Indore Hub Storage Facility",
                state="Madhya Pradesh",
                district="Indore",
                image_urls=["https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
            ProduceLot(
                farmer_id=u_farmer.id,
                crop_name="Potato",
                variety="Kufri Jyoti",
                quantity_kg=12000.0,
                price_per_kg_expected=14.0,
                grade=ProduceGrade.GRADE_A,
                moisture_percentage=78.0,
                harvest_date=now - datetime.timedelta(days=15),
                expiry_date=now + datetime.timedelta(days=60),
                storage_location="Agra Cold Chamber #7",
                state="Uttar Pradesh",
                district="Agra",
                image_urls=["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80"],
                status=ProduceStatus.SOLD
            ),
            ProduceLot(
                farmer_id=u_gurpreet.id,
                crop_name="Maize",
                variety="African Tall Hybrid",
                quantity_kg=7500.0,
                price_per_kg_expected=21.0,
                grade=ProduceGrade.GRADE_B,
                moisture_percentage=13.5,
                harvest_date=now - datetime.timedelta(days=7),
                expiry_date=now + datetime.timedelta(days=100),
                storage_location="Khanna Silo 2, GT Road",
                state="Punjab",
                district="Ludhiana",
                image_urls=["https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
            ProduceLot(
                farmer_id=u_suresh.id,
                crop_name="Mustard",
                variety="Pusa Bold",
                quantity_kg=6000.0,
                price_per_kg_expected=56.0,
                grade=ProduceGrade.GRADE_A,
                moisture_percentage=8.0,
                harvest_date=now - datetime.timedelta(days=20),
                expiry_date=now + datetime.timedelta(days=180),
                storage_location="Anand Oilseed Storage Yard",
                state="Gujarat",
                district="Anand",
                image_urls=["https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80"],
                status=ProduceStatus.AVAILABLE
            ),
        ]
        db.add_all(lots)
        db.commit()
        for l in lots:
            db.refresh(l)
        print(f"   ✅ Seeded {len(lots)} produce lots across multiple states and crops.")

        lot_wheat = lots[0]
        lot_tomato = lots[2]
        lot_onion = lots[3]
        lot_cotton = lots[4]
        lot_potato = lots[6]

        # ── 3. Trade Offers / Bids ──
        print("\n4. 🛒 Seeding Trade Offers & Bids...")
        offers = [
            TradeOffer(
                produce_lot_id=lot_wheat.id,
                buyer_id=u_buyer.id,
                offered_price_per_kg=24.0,
                offered_quantity_kg=3000.0,
                total_offer_value=72000.0,
                message="Procurement for Delhi-NCR retail packaging unit. Ready for immediate pickup upon agreement.",
                status=OfferStatus.PENDING,
                valid_until=now + datetime.timedelta(days=7),
            ),
            TradeOffer(
                produce_lot_id=lot_tomato.id,
                buyer_id=u_buyer.id,
                offered_price_per_kg=21.5,
                offered_quantity_kg=2500.0,
                total_offer_value=53750.0,
                message="Accepted supply agreement with cold-chain truck dispatch scheduled.",
                status=OfferStatus.ACCEPTED,
                valid_until=now + datetime.timedelta(days=5),
            ),
            TradeOffer(
                produce_lot_id=lot_potato.id,
                buyer_id=u_buyer.id,
                offered_price_per_kg=13.5,
                offered_quantity_kg=10000.0,
                total_offer_value=135000.0,
                message="Bulk processing batch for snacks manufacturing.",
                status=OfferStatus.ACCEPTED,
                valid_until=now - datetime.timedelta(days=1),
            ),
            TradeOffer(
                produce_lot_id=lot_onion.id,
                buyer_id=u_itc.id,
                offered_price_per_kg=18.0,
                offered_quantity_kg=8000.0,
                total_offer_value=144000.0,
                message="ITC e-Choupal institutional procurement bid for Pune distribution hub.",
                status=OfferStatus.PENDING,
                valid_until=now + datetime.timedelta(days=10),
            ),
            TradeOffer(
                produce_lot_id=lot_cotton.id,
                buyer_id=u_buyer.id,
                offered_price_per_kg=70.0,
                offered_quantity_kg=10000.0,
                total_offer_value=700000.0,
                message="Textile spinning mill advance contract.",
                status=OfferStatus.COUNTERED,
                valid_until=now + datetime.timedelta(days=4),
            ),
        ]
        db.add_all(offers)
        db.commit()
        for o in offers:
            db.refresh(o)
        print(f"   ✅ Seeded {len(offers)} marketplace trade offers.")

        # ── 4. Escrow Transactions ──
        print("\n5. 💳 Seeding Escrow Transactions...")
        offer_tomato = offers[1]
        offer_potato = offers[2]

        transactions = [
            Transaction(
                trade_offer_id=offer_tomato.id,
                buyer_id=u_buyer.id,
                seller_id=u_farmer.id,
                total_amount=53750.0,
                escrow_amount=53750.0,
                status=TransactionStatus.ESCROW_DEPOSITED,
                payment_reference="UPI-FC-20260828-984321",
                delivery_address="AgroCorp Processing Center, Sector 18, Gurugram, Haryana - 122001",
                expected_delivery_date=now + datetime.timedelta(days=3),
                tracking_number="GATI-AGRI-773821"
            ),
            Transaction(
                trade_offer_id=offer_potato.id,
                buyer_id=u_buyer.id,
                seller_id=u_farmer.id,
                total_amount=135000.0,
                escrow_amount=135000.0,
                status=TransactionStatus.DISPUTED,
                payment_reference="ESCROW-HOLD-AGRA-5521",
                delivery_address="Cold Storage Bay 12, Mathura Road, Agra, UP - 282001",
                expected_delivery_date=now - datetime.timedelta(days=2),
                tracking_number="VRL-KTC-991204"
            ),
        ]
        db.add_all(transactions)
        db.commit()
        for t in transactions:
            db.refresh(t)
        print(f"   ✅ Seeded {len(transactions)} escrow transactions.")

        # ── 5. Disputes / Grievances ──
        print("\n6. ⚖️ Seeding Dispute Center Tickets...")
        tx_disputed = transactions[1]

        grievances = [
            Grievance(
                transaction_id=tx_disputed.id,
                raised_by_id=u_buyer.id,
                category=GrievanceCategory.QUALITY_MISMATCH,
                title="Moisture & Spoilage Exceeded Tolerable Limit in Potato Batch",
                description="Upon unloading at the Agra processing facility, 15% of the potato lot showed rot and water damage due to faulty transit ventilation. Requesting partial settlement and 20% refund from escrow amount.",
                evidence_images=["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80"],
                status=GrievanceStatus.UNDER_REVIEW,
                resolution_notes="Ministry arbitration assigned inspector Rajesh Mehra to verify transit log and quality report."
            )
        ]
        db.add_all(grievances)
        db.commit()
        for g in grievances:
            db.refresh(g)
        print(f"   ✅ Seeded {len(grievances)} grievance dispute tickets.")

        # ── 6. Mandi Benchmark Prices (14-day history for all mandis) ──
        print("\n7. 📊 Seeding APMC Mandi Benchmark Prices (14-Day Trajectory)...")
        records_to_add = []
        for mandi_info in DEFAULT_MANDIS:
            for crop, (min_b, max_b) in CROP_PRICE_BOUNDS.items():
                for day_offset in range(14, -1, -1):
                    price_date = now - datetime.timedelta(days=day_offset)
                    day_factor = 1.0 + ((7 - day_offset) * 0.008)
                    min_p = round(random.uniform(min_b, min_b + 180) * day_factor, 2)
                    max_p = round(random.uniform(max_b - 180, max_b) * day_factor, 2)
                    modal_p = round((min_p + max_p) / 2.0, 2)

                    records_to_add.append(
                        MarketPrice(
                            state=mandi_info["state"],
                            district=mandi_info["district"],
                            mandi_name=mandi_info["mandi"],
                            crop_name=crop,
                            variety="Standard Grade",
                            min_price=min_p,
                            max_price=max_p,
                            modal_price=modal_p,
                            price_date=price_date,
                            source="e-NAM API",
                        )
                    )

        db.add_all(records_to_add)
        db.commit()
        print(f"   ✅ Seeded {len(records_to_add)} APMC mandi price history records across 12 major markets.")

        print("\n" + "=" * 65)
        print("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY (100% READY)!")
        print("=" * 65)

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error during database seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
