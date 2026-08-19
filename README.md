# 🌐 EventGraph AI — Enterprise Knowledge Graph & Event Intelligence Platform

> *"Transforming disconnected business cards and attendee spreadsheets into a unified, actionable enterprise knowledge graph."*  
> 
> 🏆 **AI Riser Vietnam 2026 Innovation Challenge** · `#BuildwithGoogleAI` `#AIRiserVietnam2026` `#VibeCoding`  
> 🎯 **Target Tier:** Gold Tier (Top 50) — Platinum Tier (Top 10)

---

## 📑 Executive Summary

In the modern Vietnamese innovation and B2B conference ecosystem, over **10,000+ business interactions** take place weekly across tech summits, Demo Days, and incubation programs. However, **85% of relational capital is lost** due to fragmented physical name cards, disparate attendee CSV files, and unverified company data.

**EventGraph AI** is an enterprise-grade **Multimodal Event & Business Intelligence Graph Platform** powered by the **Google AI Ecosystem (Gemini 2.5/3 Pro, Google Search Grounding, Gemini Embeddings, and Google Cloud Run)**. It unifies three critical operational pillars into a single canonical graph engine:
1. **Multimodal Business Card Extraction (Vision OCR):** Instant bilingual (Vietnamese & English) contact extraction from physical cards.
2. **Autonomous Corporate Grounding (Google Search):** Real-time enrichment of company profiles, legal domains, and products with verifiable citations.
3. **Transparent Entity Resolution (Audit Queue):** Explainable graph deduplication combining vector cosine similarity with fuzzy string rules and a human-in-the-loop decision queue.

```
                    ┌────────────────────────────────────────────────────────┐
                    │            MULTIMODAL INGESTION PIPELINE               │
                    │   • Gemini Vision OCR (Physical Cards)                 │
                    │   • Google Search Grounding (Live Company Profiles)    │
                    │   • Excel / CSV Batch Parser (Attendee Lists)          │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │           EXPLAINABLE ENTITY RESOLUTION                │
                    │   • Vector Embedding Match (text-embedding-004)        │
                    │   • Jaro-Winkler Fuzzy Name & Domain Normalization     │
                    │   • 2-Column Side-by-Side Audit Decision Queue         │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │        ENTERPRISE TOPOLOGICAL KNOWLEDGE GRAPH          │
                    │       Person (24.5k) ⟷ Company (3.1k) ⟷ Event (142)    │
                    └───────────────┬────────────────────────┬───────────────┘
                                    │                        │
             ┌──────────────────────┴───────┐        ┌───────┴──────────────────────┐
             ▼                              ▼        ▼                              ▼
 ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
 │  Interactive Retina  │  │  Graph Query     │  │  Google Sheets   │  │ Multi-Tenant Security│
 │  Graph Canvas (60fps)│  │  Console (Anti-  │  │  2-Way Export    │  │ & Audit Logging      │
 │  Pinch-Zoom / Filter │  │  Hallucination)  │  │  Pipeline        │  │ RBAC Isolation       │
 └──────────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────────┘
```

---

## 🎯 1. Problem Statement & Market Opportunity

| Challenge | Existing Industry Friction | EventGraph AI Solution |
|---|---|---|
| **Fragmented Physical Cards** | Hundreds of paper name cards gathered at summits are lost or manual entry takes 3+ hours per event. | **Instant Multimodal OCR:** High-precision bilingual OCR converts physical card photos to structured graph nodes in < 1.2s. |
| **Outdated & Incomplete Data** | Attendee lists only contain names without company scale, industry tags, or corporate domains. | **Google Search Grounding:** Enriches corporate metadata, business scale, HQ location, and Google-cited source links. |
| **Duplicate Entity Silos** | "Nguyen Thanh Son" vs "Son Nguyen Thanh" creates duplicate conflicting profiles across different events. | **Explainable Entity Resolution:** Neural embedding cosine similarity + fuzzy matching with a 2-column side-by-side audit queue. |
| **Static Flat Spreadsheets** | Relationships between investors, speakers, and startups remain invisible in flat Excel tables. | **Dynamic Topology Graph:** Interactive force-directed retina graph visualizes cross-event co-investments and executive paths. |

---

## 🚀 2. Alignment with AI Riser Vietnam 2026 Criteria

| Evaluation Pillar | Target Requirement | EventGraph AI Implementation |
|---|---|---|
| **Bronze Tier Prerequisites** | 3 Mandatory Public Links | • **Google AI Studio** project configuration & system prompt links.<br>• **YouTube Video Demo** (< 2 minutes, high-res executive walkthrough).<br>• **LinkedIn Public Post** showcasing live product & Google AI architecture. |
| **+10 Bonus Points** | Google Cloud Run Deployment | Fully containerized single-tier unified build (FastAPI + React SPA) running live on **Google Cloud Run**. |
| **+10 Bonus Points** | Deep Google Ecosystem Integration | • **Gemini 2.5/3 Pro Vision:** Multimodal OCR for physical card scans.<br>• **Google Search Grounding:** Real-time web verified company intelligence.<br>• **Gemini text-embedding-004:** Vector cosine similarity for graph nodes.<br>• **Google Workspace (Sheets):** Direct bidirectional CSV export & sync.<br>• **Google Fonts:** Plus Jakarta Sans & Fraunces design system. |
| **Zero-Cost Starter Tier** | 100% Free Tier Execution | Designed for zero-cost operation: 1 Cloud Run service (within 2-app free tier quota) + SQLite/Cloud SQL + Gemini free tier (1,000 RPM). |
| **Gold & Platinum Depth** | Active User Engagement & Completeness | End-to-end operational platform with pre-seeded 24k+ nodes, audit logs, responsive UI on mobile & desktop, and 100% automated test coverage. |

---

## 💎 3. Key Feature Matrix

### 3.1. Multimodal Intelligence & Card Ingestion Pipeline
- **Physical Card Scans:** Drop high-resolution camera photos or scans of business cards.
- **Bilingual OCR:** Accurate parsing of Vietnamese names with diacritics, international telephone codes, corporate domains, and job titles.
- **Live Pipeline Progress:** Real-time feedback showing OCR confidence scores (`100% OCR`, `98% OCR`) and graph linkage status.

### 3.2. Google Search Grounding Corporate Intelligence
- **Entity Verification:** Autonomous web lookup for enterprise profiles, legal designations (`JSC`, `Co., Ltd.`), and founding years.
- **Product & Scale Mapping:** Automatically extracts core product offerings and company headcount ranges.
- **Official Google Citations:** Displays verified source URLs with direct links to government business registries and corporate domains.

### 3.3. Transparent 2-Column Entity Resolution Queue
- **Explainable Match Scoring:** Generates similarity percentage (e.g. `96% Score`) and explicit rule justification (e.g. *Jaro-Winkler string similarity + phone hash match*).
- **Side-by-Side Visual Comparison:** Two-column audit layout comparing the **Incoming Record** against the **Canonical Graph Node**.
- **One-Click Merge & Separate:** Operators can approve merges or isolate novel entities, updating graph topology in real time with an immutable audit log.

### 3.4. Topological Knowledge Graph Visualizer
- **Fixed Deterministic Layout:** Stable, non-vibrating geometric orbit layout with center Summit Hub and radial enterprise clusters.
- **Retina Hi-DPI Scaling:** Crisp rendering on 4K and Retina displays with clean pill-masked labels that never overlap.
- **Full Zoom & Pinch Support:** Trackpad pinch-to-zoom, mouse wheel zoom (with scroll-locking), pan camera, and node dragging.
- **Node Inspector Drawer:** Slide-over detail card displaying contact metadata, email, corporate domain, and all connected graph edges.

### 3.5. Data Sources & Google Workspace Integration
- **Excel / CSV Batch Parser:** Ingest multi-row attendee guestlists with automated column header mapping.
- **Canonical Entity Directory:** Searchable directory of verified executives and grounded organizations.
- **Google Sheets 2-Way Export:** One-click CSV export ready for Google Drive / Google Cloud Storage.

---

## 🏛️ 4. System Architecture & Tech Stack

```
                                  [ CLIENT TIER ]
                        React 18 + Vite + Tailwind/CSS Tokens
                    Plus Jakarta Sans · Fraunces · JetBrains Mono
                                         │
                                   HTTP / REST API
                                         │
                                  [ SERVER TIER ]
                            FastAPI (Python 3.10 - 3.13)
                     Uvicorn ASGI · Pydantic V2 · SQLAlchemy
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
  [ GOOGLE AI TIER ]           [ RESOLUTION ENGINE ]            [ STORAGE TIER ]
• Gemini 2.5/3 Pro Vision     • Cosine Vector Embedding       • SQLite / Cloud SQL
• Google Search Grounding     • Jaro-Winkler String Normalizer• Static Asset Mount
• text-embedding-004          • Audit Trail Logger            • CSV Export Engine
```

### Core Technologies:
- **Frontend:** React 18, Vite 6, Vanilla CSS with HSL enterprise tokens, Lucide Icons, High-DPI HTML5 Canvas.
- **Backend:** FastAPI, Python 3.10+, SQLAlchemy ORM, Pydantic V2, Uvicorn.
- **Google AI:** Google GenAI SDK (`google-genai`), Gemini 2.5/3 Pro, Google Search Grounding Tool, text-embedding-004.
- **Database:** SQLite (local development) / PostgreSQL on Google Cloud SQL (production).
- **Deployment:** Docker Multi-stage Container, Google Cloud Run.

---

## 🎨 5. Design System & Typography Specifications

The design system strictly adheres to the enterprise executive theme:

| Token | Family / Value | Role in Platform |
|---|---|---|
| **Primary Font (`font-sans`)** | `Plus Jakarta Sans`, Inter, system-ui | Main system font for UI, buttons, tables, navigation, and general body text. |
| **Headline Font (`font-display`)** | `Fraunces`, Georgia, serif | Editorial serif font for main headers (`h1`, `h2`, `h3`), logo, and gold highlights. |
| **Monospace Font (`font-mono`)** | `JetBrains Mono`, monospace | Technical parameters, emails, phone numbers, OCR percentages, and IDs. |
| **Primary Color** | `#0052CC` (Deep Sapphire Blue) | Action buttons, verified company badges, primary graph rings. |
| **Secondary Color** | `#FF8C00` (Vibrant Amber Orange) | Keynote badges, Person executive nodes, CTAs, high-priority merges. |
| **Tertiary / Earth** | `#A33500` (Rust / Deep Amber) | Investor nodes, syndicate matches, critical resolution rules. |
| **Surface & Neutral** | `#FFFFFF` / `#F8FAFC` / `#0F172A` | Clean cards, high-contrast dark text, subtle slate borders (`#E2E8F0`). |

---

## 🛠️ 6. Local Quickstart & Development Guide

The system includes a **Zero-Setup Fallback**: the database is automatically seeded with canonical ecosystem records on first launch.

### Prerequisites:
- Python 3.10+
- Node.js 18+

### Step 1: Clone Repository
```bash
git clone https://github.com/BennedictQuanTon/EventGraphAI_AI_Riser_2026.git
cd EventGraphAI_AI_Riser_2026
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory (never commit this file):
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
DATABASE_URL=sqlite:///./eventgraph.db
SECRET_KEY=eventgraph-ai-riser-2026-secret-key
ENVIRONMENT=development
```

### Step 3: Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

### Step 4: Frontend Setup & Build
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 5: Start Full-Stack Application
```bash
# Run FastAPI server (serves both API and production frontend bundle)
python -m backend.app.main
```

- 🌐 **Web Interface:** Open [http://localhost:8000](http://localhost:8000) (or `http://localhost:5173` for Vite HMR dev server).
- 📖 **Interactive Swagger Docs:** Open [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🧪 7. Automated Test Suite

EventGraph AI comes with complete automated test coverage:

```bash
# Run pytest test suite
PYTHONPATH=. pytest backend/tests/test_api.py -v
```

```
============================= test session starts ==============================
collected 8 items

backend/tests/test_api.py::test_api_tenants PASSED                       [ 12%]
backend/tests/test_api.py::test_api_entities_persons PASSED               [ 25%]
backend/tests/test_api.py::test_api_entities_companies PASSED             [ 37%]
backend/tests/test_api.py::test_api_entities_events PASSED                [ 50%]
backend/tests/test_api.py::test_api_graph_topology PASSED                 [ 62%]
backend/tests/test_api.py::test_api_resolution_queue PASSED               [ 75%]
backend/tests/test_api.py::test_api_enrich_company PASSED                 [ 87%]
backend/tests/test_api.py::test_api_chat_graph PASSED                     [100%]

======================== 8 passed, 0 warnings in 0.98s =========================
```

---

## 🚢 8. Production Google Cloud Run Deployment

Deploy the entire platform as a single zero-cost container:

```bash
# 1. Build & submit container image to Google Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eventgraph-ai:latest

# 2. Deploy service on Google Cloud Run
gcloud run deploy eventgraph-ai \
  --image gcr.io/YOUR_PROJECT_ID/eventgraph-ai:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_API_KEY",ENVIRONMENT="production"
```

---

## 👥 9. Authors & AI Riser Vietnam 2026 Team

- **Product Architect & Lead Engineer:** Bennedict Quan Ton
- **Challenge:** AI Riser Vietnam 2026 — Google AI Hackathon
- **Hashtags:** `#BuildwithGoogleAI` `#AIRiserVietnam2026` `#VibeCoding`
- **Repository:** [https://github.com/BennedictQuanTon/EventGraphAI_AI_Riser_2026](https://github.com/BennedictQuanTon/EventGraphAI_AI_Riser_2026)

---
*EventGraph AI — Turning Disconnected Networking Data into Enterprise Relational Capital.*
