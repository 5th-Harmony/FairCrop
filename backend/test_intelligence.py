import sys
import asyncio
import httpx

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://localhost:8001/api/v1"

async def test_intelligence_endpoints():
    from seed_db import seed_database
    from app.main import app
    
    seed_database()
    
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver/api/v1") as client:
        print("\n" + "=" * 60)
        print("  TESTING INTELLIGENCE & INTERACTIVE MODAL ENDPOINTS")
        print("=" * 60)
        
        # 1. Test Mandi Hubs
        r = await client.get("/intelligence/mandi-hubs")
        assert r.status_code == 200, f"Mandi Hubs failed: {r.text}"
        hubs = r.json()
        print(f"✓ Mandi Hubs Count: {len(hubs)}")
        assert len(hubs) >= 10
        print(f"  First hub: {hubs[0]['city']} ({hubs[0]['mandi_name']}) - Volume: {hubs[0]['trading_volume']}")
        
        # 2. Test Single Mandi Hub Detail (e.g. Mumbai / Delhi-NCR)
        r = await client.get("/intelligence/mandi-hub/Mumbai")
        assert r.status_code == 200, f"Mumbai Hub detail failed: {r.text}"
        mumbai = r.json()
        print(f"✓ Mumbai Hub Detail: {mumbai['hub']['city']} - {len(mumbai['mandi_prices'])} price records, {len(mumbai['available_lots'])} active lots")
        
        # 3. Test Schemes Directory
        r = await client.get("/intelligence/schemes")
        assert r.status_code == 200
        schemes = r.json()
        print(f"✓ Government Schemes Count: {len(schemes)}")
        assert len(schemes) >= 6
        print(f"  First scheme: {schemes[0]['title']} ({schemes[0]['benefit_amount']})")
        
        # 4. Test Single Scheme Detail
        r = await client.get("/intelligence/schemes/pmfby")
        assert r.status_code == 200
        pmfby = r.json()
        print(f"✓ PMFBY Scheme Detail: {pmfby['title']}")
        
        # 5. Test Commodity Deep-Dive
        r = await client.get("/intelligence/commodity/Wheat")
        assert r.status_code == 200
        wheat = r.json()
        print(f"✓ Wheat Deep-Dive: {len(wheat['mandi_prices'])} prices, {len(wheat['available_lots'])} lots, Forecast: ₹{wheat['forecast']['current_modal_price']:.0f}/q")
        
        # 6. Test Live Updates
        r = await client.get("/intelligence/live-updates")
        assert r.status_code == 200
        updates = r.json()
        print(f"✓ Live Updates Count: {len(updates)}")
        print(f"  Top update: [{updates[0]['label']}] {updates[0]['title']}")
        
        # 7. Test Global Search
        r = await client.get("/intelligence/search?q=Delhi")
        assert r.status_code == 200
        search_res = r.json()
        print(f"✓ Global Search 'Delhi': {search_res['total_results']} results found")
        
        # 8. Test Platform Stats
        r = await client.get("/intelligence/stats")
        assert r.status_code == 200
        stats = r.json()
        print(f"✓ Stats Bar: {stats['farmers']:,} Farmers, {stats['mandis']:,} Mandis, {stats['states']} States")
        
        print("\n" + "=" * 60)
        print("  ALL INTELLIGENCE & POPUP MODAL ENDPOINTS PASSED 100%!")
        print("=" * 60 + "\n")

if __name__ == "__main__":
    asyncio.run(test_intelligence_endpoints())
