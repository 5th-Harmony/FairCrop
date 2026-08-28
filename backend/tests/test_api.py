import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "platform" in data


@pytest.mark.asyncio
async def test_user_registration_and_login(client: AsyncClient):
    # 1. Register Farmer
    farmer_payload = {
        "email": "farmer1@agritech.org",
        "phone_number": "+919876543210",
        "password": "farmerpassword123",
        "full_name": "Ramesh Singh",
        "role": "FARMER",
        "state": "Punjab",
        "district": "Ludhiana",
        "pincode": "141001"
    }
    reg_response = await client.post("/api/v1/auth/register", json=farmer_payload)
    assert reg_response.status_code == 201
    farmer_data = reg_response.json()
    assert farmer_data["email"] == farmer_payload["email"]
    assert farmer_data["verification_status"] == "VERIFIED"

    # 2. Login Farmer
    login_payload = {
        "username": farmer_payload["email"],
        "password": farmer_payload["password"]
    }
    login_response = await client.post("/api/v1/auth/login", data=login_payload)
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 3. Get profile
    headers = {"Authorization": f"Bearer {token}"}
    me_response = await client.get("/api/v1/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["full_name"] == "Ramesh Singh"


@pytest.mark.asyncio
async def test_produce_listing_and_bidding_flow(client: AsyncClient):
    # Register Farmer
    f_res = await client.post("/api/v1/auth/register", json={
        "email": "farmer2@agritech.org",
        "phone_number": "+919876543211",
        "password": "password123",
        "full_name": "Suresh Kumar",
        "role": "FARMER",
        "state": "Haryana",
        "district": "Karnal",
        "pincode": "132001"
    })
    assert f_res.status_code == 201
    farmer_id = f_res.json()["id"]

    # Login Farmer
    f_login = await client.post("/api/v1/auth/login", data={"username": "farmer2@agritech.org", "password": "password123"})
    farmer_token = f_login.json()["access_token"]
    f_headers = {"Authorization": f"Bearer {farmer_token}"}

    # Register Buyer
    b_res = await client.post("/api/v1/auth/register", json={
        "email": "buyer1@agritech.org",
        "phone_number": "+919876543212",
        "password": "password123",
        "full_name": "AgroCorp Processing Ltd",
        "role": "BUYER",
        "state": "Haryana",
        "district": "Gurugram",
        "pincode": "122001"
    })
    assert b_res.status_code == 201
    
    # Login Buyer
    b_login = await client.post("/api/v1/auth/login", data={"username": "buyer1@agritech.org", "password": "password123"})
    buyer_token = b_login.json()["access_token"]
    b_headers = {"Authorization": f"Bearer {buyer_token}"}

    # Farmer lists produce lot
    lot_payload = {
        "crop_name": "Wheat",
        "variety": "Sharbati",
        "quantity_kg": 5000.0,
        "price_per_kg_expected": 24.5,
        "grade": "GRADE_A",
        "moisture_percentage": 11.5,
        "harvest_date": "2026-03-15T00:00:00",
        "storage_location": "Karnal Cold Storage Vault 4",
        "state": "Haryana",
        "district": "Karnal"
    }
    lot_res = await client.post("/api/v1/produce/", json=lot_payload, headers=f_headers)
    assert lot_res.status_code == 201
    lot_data = lot_res.json()
    lot_id = lot_data["id"]

    # Buyer searches marketplace
    search_res = await client.get("/api/v1/marketplace/lots?crop_name=Wheat")
    assert search_res.status_code == 200
    lots = search_res.json()
    assert len(lots) >= 1

    # Smart Matchmaking search
    match_res = await client.get("/api/v1/marketplace/matchmaking?crop_name=Wheat&desired_min_qty=2000")
    assert match_res.status_code == 200
    matches = match_res.json()
    assert len(matches) >= 1
    assert matches[0]["match_score_percentage"] > 50.0

    # Buyer places trade offer
    offer_payload = {
        "produce_lot_id": lot_id,
        "offered_price_per_kg": 24.0,
        "offered_quantity_kg": 5000.0,
        "message": "Interested in purchasing full harvest batch."
    }
    offer_res = await client.post("/api/v1/marketplace/offers", json=offer_payload, headers=b_headers)
    assert offer_res.status_code == 201
    offer_data = offer_res.json()
    offer_id = offer_data["id"]

    # Farmer accepts offer
    respond_res = await client.put(f"/api/v1/marketplace/offers/{offer_id}/respond", json={"status": "ACCEPTED"}, headers=f_headers)
    assert respond_res.status_code == 200
    assert respond_res.json()["status"] == "ACCEPTED"

    # Verify transaction was automatically created
    tx_res = await client.get("/api/v1/transactions/", headers=f_headers)
    assert tx_res.status_code == 200
    tx_list = tx_res.json()
    assert len(tx_list) >= 1
    tx_id = tx_list[0]["id"]
    assert tx_list[0]["status"] == "INITIATED"

    # Update escrow state to ESCROW_DEPOSITED then ESCROW_RELEASED
    deposit_res = await client.put(f"/api/v1/transactions/{tx_id}/status", json={"status": "ESCROW_DEPOSITED", "payment_reference": "UPI_REF_998877"}, headers=b_headers)
    assert deposit_res.status_code == 200
    assert deposit_res.json()["status"] == "ESCROW_DEPOSITED"


@pytest.mark.asyncio
async def test_intelligence_and_forecasting(client: AsyncClient):
    # Mandi prices list
    mandi_res = await client.get("/api/v1/intelligence/mandi-prices?crop_name=Wheat")
    assert mandi_res.status_code == 200
    prices = mandi_res.json()
    assert len(prices) >= 1

    # ML Price Forecast
    forecast_res = await client.get("/api/v1/intelligence/forecast?crop_name=Wheat&state=Punjab&district=Ludhiana&mandi_name=Ludhiana%20Mandi")
    assert forecast_res.status_code == 200
    f_data = forecast_res.json()
    assert f_data["crop_name"] == "Wheat"
    assert len(f_data["forecast_7d"]) == 7
    assert "recommended_sale_window" in f_data
