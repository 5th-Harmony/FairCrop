# 🌱 FairCrop.in — Strengthening Market Linkages & Price Discovery for Farmers

<div align="center">
  <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&q=80" alt="FairCrop Banner" width="100%" style="border-radius: 12px; max-height: 280px; object-fit: cover;" />
  <br/><br/>
  <h3>Smart India Hackathon (SIH 2026) — Problem Statement ID: SIH-1693</h3>
  <p><strong>Theme:</strong> Agriculture, FoodTech & Rural Development | <strong>Category:</strong> Software | <strong>Team:</strong> METERE</p>
  <p><em>An intelligent, transparent, and multilingual agricultural marketplace connecting Indian farmers directly to verified institutional buyers, e-NAM price discovery, and risk-free Escrow settlements.</em></p>
  
  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-repository-structure">Repo Structure</a> •
    <a href="#-architecture--tech-stack">Tech Stack</a> •
    <a href="#-7-stage-escrow-lifecycle">Escrow Lifecycle</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-endpoints">API Docs</a>
  </p>
</div>

---

## 📌 Problem Overview

In India's agricultural value chain, smallholder and marginal farmers lose **15–30% of their earnings to middleman brokerage**, face severe price information asymmetry, and suffer **20–25% perishable post-harvest losses** due to distress sales and delayed payments.

**FairCrop.in** resolves these challenges through:
1. **Direct Farm-Gate Linkages:** Connecting farmers directly with FMCG processors, bulk exporters, and verified institutional buyers.
2. **AI-Powered Price Forecasting:** Hybrid time-series models (ARIMA + LSTM) analyzing 1,361+ mandis to provide **7-Day Price Bands** and **HOLD vs. SELL advisories**.
3. **100% Secure 7-Stage Escrow System:** Locking buyer funds upfront before dispatch to eliminate default risk.
4. **Multilingual & Voice-Enabled Accessibility:** Supporting **22 scheduled Indian languages** with speech-to-text recognition and offline caching for rural usability.

---

## 🌟 Key Features

- 🏛️ **Government-Aligned Digital Infrastructure:** Styled in accordance with India.gov.in, e-NAM, and Agmarknet standards with tricolor accents and high-contrast dark/light modes.
- 🌾 **Digital Lot Creation & Assaying:** Parameterized moisture %, purity grades (Agmark Grade A/B/C), and harvest batch tracking.
- 📈 **Real-Time e-NAM Mandi Feeds:** Dynamic price tickers and arrival volumes for major crops across 2,400+ mandis.
- 🔒 **7-Stage Escrow Guarantee:** Automated contract locking, upfront buyer fund escrow, milestone dispatch tracking, and instant delivery payouts.
- 🤖 **Predictive AI Price Intelligence:** 7-day algorithmic forecasting assisting farmers in optimizing harvest sales timing.
- 🗣️ **22 Official Indian Languages & Voice Input:** Native script rendering and browser voice search across Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Punjabi, etc.
- 📱 **Multi-Platform Access:** Cross-platform web dashboard (Next.js), mobile client (React Native / Expo), and ultra-fast static portal (Vanilla JS).

---

## 📁 Repository Structure

```tree
FairCrop/
│
├── backend/                            # Core FastAPI Backend & Intelligence Services
│   ├── app/
│   │   ├── api/                        # API Routing & Controllers
│   │   │   ├── router.py               # Master API Router v1
│   │   │   └── v1/
│   │   │       ├── auth.py             # User registration, login & JWT tokens
│   │   │       ├── produce.py          # Digital lot creation, crop listings & updates
│   │   │       ├── marketplace.py      # Bidding, offers, negotiations & orders
│   │   │       ├── transactions.py     # 7-Stage Escrow payment lifecycle & payouts
│   │   │       ├── intelligence.py     # Real-time e-NAM live feed sync & ML forecasts
│   │   │       ├── translations.py     # 22-language translation engine & dictionaries
│   │   │       ├── grievances.py       # Dispute management & administrative mediation
│   │   │       └── users.py            # User profile management & KYC verification
│   │   │
│   │   ├── core/                       # Core Configurations & Security
│   │   │   ├── config.py               # App settings & environment variables
│   │   │   ├── security.py             # Password hashing (Bcrypt) & JWT encoding
│   │   │   └── rbac.py                 # Role-Based Access Control (Farmer, Buyer, Admin)
│   │   │
│   │   ├── services/                   # Business Logic & External Integrations
│   │   │   ├── enam_integration.py     # e-NAM & Agmarknet Government API scraper/sync
│   │   │   ├── ml_forecasting.py       # ARIMA/LSTM time-series price prediction engine
│   │   │   └── matchmaking.py          # 5-factor buyer-seller algorithmic matching
│   │   │
│   │   ├── database.py                 # SQLAlchemy database session & engine
│   │   ├── models.py                   # SQLAlchemy 2.0 ORM database schema models
│   │   ├── schemas.py                  # Pydantic v2 data validation schemas
│   │   └── main.py                     # FastAPI application factory & middleware
│   │
│   ├── tests/                          # Automated Unit & Integration Tests
│   │   ├── conftest.py                 # Test fixtures & test DB client
│   │   └── test_api.py                 # API endpoints validation suite
│   │
│   ├── requirements.txt                # Python backend dependencies
│   ├── run.py                          # Uvicorn entrypoint script (Port 8001)
│   ├── seed_db.py                      # Synthetic realistic mandi database seeder
│   ├── test_intelligence.py            # Intelligence service test suite
│   └── verify_db.py                    # Database integrity and relation validation
│
├── web/                                # Institutional Buyer Dashboard (Next.js 14)
│   ├── app/                            # App Router Pages & Layouts
│   │   ├── globals.css                 # Tailwind CSS styles & design tokens
│   │   ├── layout.tsx                  # Root layout wrapper & theme providers
│   │   └── page.tsx                    # Buyer marketplace dashboard & live bids
│   ├── components/                     # Reusable UI Components
│   │   ├── Navbar.tsx                  # Navigation header & user profile
│   │   ├── Sidebar.tsx                 # Navigation sidebar & active filters
│   │   ├── MarketplaceTable.tsx        # Searchable produce lots directory
│   │   ├── MarketTrendsChart.tsx       # Live price charts & forecast visualizations
│   │   └── BiddingModal.tsx            # Digital bidding & offer placement modal
│   ├── lib/                            # Client Utilities
│   │   ├── api.ts                      # Axios API client wrapper
│   │   └── store.ts                    # Global state store (Zustand)
│   ├── package.json                    # Web app dependencies & scripts
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   └── tsconfig.json                   # TypeScript configuration
│
├── mobile/                             # Farmer Smartphone App (React Native / Expo)
│   ├── app/                            # Expo Router Screen Directory
│   │   ├── _layout.tsx                 # App navigation provider
│   │   └── (tabs)/                     # Tab Bar Navigation
│   │       ├── index.tsx               # Farmer home screen & daily mandi ticker
│   │       ├── list-harvest.tsx        # New harvest listing & moisture calculator
│   │       ├── offers.tsx              # Incoming buyer bids & negotiation screen
│   │       └── _layout.tsx             # Tab header & icons configuration
│   ├── services/
│   │   └── api.ts                      # Mobile REST client for backend API
│   ├── store/
│   │   └── useAuthStore.ts             # Mobile authentication & session persistence
│   ├── app.json                        # Expo mobile application configuration
│   ├── package.json                    # Mobile app dependencies
│   └── tailwind.config.js              # NativeWind styling configuration
│
├── js/                                 # Static Portal JavaScript Engine
│   ├── app.js                          # Multilingual engine, modals & carousels
│   ├── api.js                          # Client-side FairCrop API SDK
│   ├── auth.js                         # Local auth handling & role persistence
│   └── portal.js                       # Role-based dashboard switching & modals
│
├── css/
│   └── style.css                       # Glassmorphism design system, themes & animations
│
├── Faircrop/                           # Standalone Static Deployment Mirror
│   ├── index.html                      # Standalone client portal entrypoint
│   ├── css/style.css                   # Mirrored styles
│   └── js/                             # Mirrored JS scripts (app.js, api.js, portal.js)
│
├── index.html                          # Root Web Portal & Showcase Application
│
├── SIH2026_AgriLink_Presentation.html  # Interactive Web Slide Deck (All 9 Slides)
├── SIH2026_Tech_Viva_CheatSheet.html   # Printable PDF / Technical Viva Cheatsheet
├── build_master_sih_deck.py            # Master 9-Slide PowerPoint generator script
├── generate_viva_ppt.py                # Technical Viva PowerPoint generator script
├── build_sih_official_ppt.py           # Official SIH template PowerPoint builder
│
├── .gitignore                          # Standard Git ignore configurations
├── LICENSE                             # MIT Open-Source License
└── README.md                           # Comprehensive project documentation
```

---

## 🛠️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT / USER LAYER                               │
│  ┌────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────┐  │
│  │   Static Portal (JS)   │  │   Next.js 14 Web App    │  │ React Native/   │  │
│  │  HTML5 + Glassmorphism │  │    (Buyer Dashboard)    │  │ Expo Mobile App │  │
│  └───────────┬────────────┘  └────────────┬────────────┘  └────────┬────────┘  │
└──────────────┼────────────────────────────┼────────────────────────┼───────────┘
               │                            │                        │
               ▼                            ▼                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND REST API (FastAPI)                             │
│  • JWT Auth & RBAC        • e-NAM Live Sync Engine    • ARIMA + LSTM AI ML     │
│  • Lot Management         • 5-Factor Matchmaking       • 7-Stage Escrow Ledger  │
│  • 22-Language Localizer  • Grievance Mediation Engine • OpenAPI / Swagger Docs │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE & DATA SOURCES                              │
│  ┌───────────────────────────────┐        ┌──────────────────────────────────┐ │
│  │ PostgreSQL / SQLite (ORM)     │        │ External Government APIs         │ │
│  │ Users, Lots, Bids, Escrows,   │        │ e-NAM (1,361 Mandis), Agmarknet, │ │
│  │ Transactions, Grievances      │        │ Open Government Data (data.gov)  │ │
│  └───────────────────────────────┘        └──────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 7-Stage Escrow Lifecycle

To eliminate buyer payment defaults and protect farmers from fraud, all transactions proceed through our deterministic 7-stage state machine:

```
[1. INITIATED] ──> [2. ESCROW DEPOSITED] ──> [3. DISPATCHED] ──> [4. DELIVERED]
 (Bid Accepted)      (100% Funds Locked)      (GPS Logistics)     (Warehouse Arrived)
                                                                           │
               ┌───────────────────────────────────────────────────────────┴──────────┐
               ▼                                                                      ▼
     [5. ESCROW RELEASED]                                                    [6. DISPUTE / PAUSE]
(Quality Verified & Paid)                                                  (Moisture/Grade Variance)
                                                                                      │
                                                                                      ▼
                                                                             [7. REVERT / CANCEL]
                                                                           (Refund & Relist Lot)
```

---

## 🚀 Getting Started

### Prerequisites
- **Python:** 3.10+
- **Node.js:** 18+ (for Web and Mobile components)

---

### 1. Backend Setup (FastAPI Server)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with realistic mandi, crop, and lot data
python seed_db.py

# Launch the backend server (Runs on http://localhost:8001)
python run.py
```

* Swagger API Documentation will be accessible at: `http://localhost:8001/docs`
* ReDoc API Explorer will be accessible at: `http://localhost:8001/redoc`

---

### 2. Frontend Web Portal Setup (Static Client)

```bash
# From repository root
# Start a simple HTTP server (or open index.html directly)
python -m http.server 3000
```
Open **`http://localhost:3000/`** in any web browser.

---

### 3. Next.js Web Dashboard Setup (Institutional Buyers)

```bash
cd web
npm install
npm run dev
```
Open **`http://localhost:3000`** to view the Next.js buyer terminal.

---

### 4. React Native Mobile App Setup (Farmers)

```bash
cd mobile
npm install
npx expo start
```
Scan the QR code using the **Expo Go** app on Android or iOS.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new Farmer, Buyer, or FPO |
| `POST` | `/api/v1/auth/token` | Obtain JWT Bearer Token |
| `GET` | `/api/v1/produce/` | List all available produce lots with search filters |
| `POST` | `/api/v1/produce/` | Create a new produce lot with quality specs |
| `POST` | `/api/v1/marketplace/bids` | Submit a digital bid or counter-offer on a lot |
| `POST` | `/api/v1/transactions/escrow/deposit` | Lock 100% buyer funds into digital escrow |
| `POST` | `/api/v1/transactions/escrow/release` | Approve quality and release payout to farmer |
| `GET` | `/api/v1/intelligence/live-updates` | Real-time e-NAM price feed and arrival alerts |
| `GET` | `/api/v1/intelligence/forecast/{crop}` | 7-day AI time-series price forecast & Hold/Sell signal |
| `GET` | `/api/v1/translations/{lang_code}` | Multilingual dictionary for 22 scheduled Indian languages |

---

## 📊 Key Impact Metrics

* **+15% to +25%** Farmer Income Increase via direct institutional linkage.
* **-20% to -25%** Post-Harvest Wastage Reduction via cold freight and scheduled dispatch.
* **1,361+** e-NAM Unified Mandis integrated for nationwide price transparency.
* **100%** Default-Proof Transactions backed by upfront milestone Escrow locks.

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <strong>Team METERE</strong> for Smart India Hackathon 2026</sub>
</div>
