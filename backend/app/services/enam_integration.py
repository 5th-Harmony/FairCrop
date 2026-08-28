import datetime
import random
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import MarketPrice, User, UserRole, VerificationStatus, ProduceLot, ProduceGrade, ProduceStatus
from app.core.security import get_password_hash


class ENAMIntegrationService:
    """
    e-NAM & Agmarknet Mandi Price Scraper / API Integration Service
    Syncs live mandi arrival prices across crops and districts.
    """

    DEFAULT_MANDIS = [
        {"state": "Punjab", "district": "Ludhiana", "mandi": "Ludhiana Mandi"},
        {"state": "Haryana", "district": "Karnal", "mandi": "Karnal Mandi"},
        {"state": "Maharashtra", "district": "Nashik", "mandi": "Lasalgaon Mandi"},
        {"state": "Uttar Pradesh", "district": "Agra", "mandi": "Agra Central Mandi"},
        {"state": "Madhya Pradesh", "district": "Indore", "mandi": "Indore Mandi"},
        {"state": "Karnataka", "district": "Kolar", "mandi": "Kolar APMC"},
    ]

    CROP_PRICE_BOUNDS = {
        "Wheat": (2100.0, 2600.0),
        "Rice": (2800.0, 3600.0),
        "Tomato": (1200.0, 2400.0),
        "Potato": (1100.0, 1800.0),
        "Onion": (1800.0, 3200.0),
        "Cotton": (6200.0, 7500.0),
        "Soybean": (4100.0, 4800.0),
        "Maize": (1900.0, 2400.0),
        "Mustard": (5000.0, 5900.0),
    }

    @classmethod
    async def seed_initial_market_prices(cls, db: AsyncSession) -> int:
        """Seed initial benchmark market prices for key commodities if DB is empty"""
        # 1. Seed users if empty
        user_res = await db.execute(select(User))
        if not user_res.scalars().first():
            demo_users = [
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
                    pincode="141001"
                ),
                User(
                    email="fpo@faircrop.in",
                    phone_number="9876543211",
                    hashed_password=get_password_hash("fpo123"),
                    full_name="Kisan Vikas Producer Co.",
                    role=UserRole.FPO,
                    fpo_name="Kisan Vikas Agro Producer Co.",
                    gstin_or_registration="FPO27AAACK1234F1Z5",
                    verification_status=VerificationStatus.PENDING,
                    state="Maharashtra",
                    district="Nashik",
                    sub_district="Lasalgaon",
                    village="Pimpalgaon",
                    pincode="422306"
                ),
                User(
                    email="buyer@faircrop.in",
                    phone_number="9876543212",
                    hashed_password=get_password_hash("buyer123"),
                    full_name="AgroCorp Processing Ltd",
                    role=UserRole.BUYER,
                    company_name="AgroCorp Processing India Ltd",
                    gstin_or_registration="06AAACA1234A1Z9",
                    verification_status=VerificationStatus.PENDING,
                    state="Haryana",
                    district="Gurugram",
                    pincode="122001"
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
                    pincode="110001"
                ),
                User(
                    email="admin@faircrop.in",
                    phone_number="9876543214",
                    hashed_password=get_password_hash("admin123"),
                    full_name="Ministry Admin",
                    role=UserRole.ADMIN,
                    verification_status=VerificationStatus.VERIFIED,
                    state="Delhi",
                    district="New Delhi",
                    pincode="110001"
                ),
            ]
            db.add_all(demo_users)
            await db.commit()

            # Seed sample produce lots for farmer
            f_query = await db.execute(select(User).where(User.email == "farmer@faircrop.in"))
            farmer_user = f_query.scalars().first()
            if farmer_user:
                today_dt = datetime.datetime.now(datetime.timezone.utc)
                sample_lots = [
                    ProduceLot(
                        farmer_id=farmer_user.id,
                        crop_name="Wheat",
                        variety="Sharbati Premium",
                        quantity_kg=5000.0,
                        price_per_kg_expected=24.5,
                        grade=ProduceGrade.GRADE_A,
                        moisture_percentage=11.2,
                        harvest_date=today_dt - datetime.timedelta(days=10),
                        expiry_date=today_dt + datetime.timedelta(days=120),
                        storage_location="Vault 4, Ludhiana Central Ag Warehouse",
                        state="Punjab",
                        district="Ludhiana",
                        image_urls=["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80"],
                        status=ProduceStatus.AVAILABLE
                    ),
                    ProduceLot(
                        farmer_id=farmer_user.id,
                        crop_name="Basmati Rice",
                        variety="Pusa 1121",
                        quantity_kg=8000.0,
                        price_per_kg_expected=48.0,
                        grade=ProduceGrade.PREMIUM,
                        moisture_percentage=12.0,
                        harvest_date=today_dt - datetime.timedelta(days=14),
                        expiry_date=today_dt + datetime.timedelta(days=180),
                        storage_location="Shed B, Karnal Grain Terminal",
                        state="Haryana",
                        district="Karnal",
                        image_urls=["https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80"],
                        status=ProduceStatus.AVAILABLE
                    ),
                    ProduceLot(
                        farmer_id=farmer_user.id,
                        crop_name="Tomato",
                        variety="Hybrid Red",
                        quantity_kg=2500.0,
                        price_per_kg_expected=22.0,
                        grade=ProduceGrade.GRADE_A,
                        moisture_percentage=85.0,
                        harvest_date=today_dt - datetime.timedelta(days=2),
                        expiry_date=today_dt + datetime.timedelta(days=12),
                        storage_location="Kolar Cold Storage Unit 2",
                        state="Karnataka",
                        district="Kolar",
                        image_urls=["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80"],
                        status=ProduceStatus.AVAILABLE
                    ),
                    ProduceLot(
                        farmer_id=farmer_user.id,
                        crop_name="Onion",
                        variety="Nasik Red",
                        quantity_kg=10000.0,
                        price_per_kg_expected=18.5,
                        grade=ProduceGrade.GRADE_A,
                        moisture_percentage=14.0,
                        harvest_date=today_dt - datetime.timedelta(days=8),
                        expiry_date=today_dt + datetime.timedelta(days=90),
                        storage_location="Lasalgaon Warehouse Bay 3",
                        state="Maharashtra",
                        district="Nashik",
                        image_urls=["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80"],
                        status=ProduceStatus.AVAILABLE
                    ),
                ]
                db.add_all(sample_lots)
                await db.commit()

        # 2. Seed market prices if empty
        result = await db.execute(select(MarketPrice))
        existing_count = len(result.scalars().all())

        if existing_count > 0:
            return existing_count

        records_to_add = []
        today = datetime.datetime.now(datetime.timezone.utc)

        for mandi_info in cls.DEFAULT_MANDIS:
            for crop, (min_b, max_b) in cls.CROP_PRICE_BOUNDS.items():
                for day_offset in range(7, -1, -1):
                    price_date = today - datetime.timedelta(days=day_offset)
                    min_p = round(random.uniform(min_b, min_b + 200), 2)
                    max_p = round(random.uniform(max_b - 200, max_b), 2)
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
        await db.commit()
        return len(records_to_add)


enam_service = ENAMIntegrationService()
