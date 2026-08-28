"""
FairCrop Backend — Easy Startup Script
Run: python run.py
This starts the API on http://localhost:8001
"""
import uvicorn

if __name__ == "__main__":
    print("=" * 55)
    print("  FairCrop API Server")
    print("  URL:  http://localhost:8001")
    print("  Docs: http://localhost:8001/docs")
    print("=" * 55)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info",
    )
