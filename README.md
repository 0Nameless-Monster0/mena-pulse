# MENA Pulse — Regional Equity Research News Terminal

Aggregates, deduplicates, and AI-ranks disclosures and market news from 9 sources
across Egypt (EGX), Saudi Arabia (Tadawul), and the UAE (ADX/DFM) into one
high-density dashboard for pre-market scanning.

## Architecture

```
mena-pulse/
├── backend/                  # Python 3.11+ ingestion + API
│   ├── app/
│   │   ├── main.py           # FastAPI server + background refresh loop
│   │   ├── models.py         # NewsItem schema
│   │   ├── storage.py        # SQLite persistence (upsert by content hash)
│   │   ├── scrapers/         # One module per source family
│   │   │   ├── base.py       # httpx fetch + Playwright Cloudflare fallback
│   │   │   ├── egx.py        # EGX news search (ASPX, Playwright)
│   │   │   ├── tadawul.py    # Saudi Exchange issuer news (Playwright)
│   │   │   ├── adx.py        # ADX disclosures (Playwright / JSON API)
│   │   │   ├── dfm.py        # DFM marketwatch (JSON API)
│   │   │   └── rss.py        # Generic RSS/API: Enterprise, Mubasher, Zawya,
│   │   │                     #   Al Mal, Arab Finance (config-driven)
│   │   └── pipeline/
│   │       ├── ingest.py     # Orchestrator: fan-out scrape → normalize → store
│   │       ├── dedup.py      # Semantic title similarity + ticker matching
│   │       ├── ranker.py     # Keyword scorer + optional Claude Haiku classifier
│   │       └── tickers.py    # Regional ticker extraction
│   └── config/sources.yaml   # All 9 source endpoints
├── frontend/                 # Vite + React 18 + TS + Tailwind + Zustand
│   └── src/
│       ├── components/       # TopBar, tabs, cards, sections
│       ├── data/mockNews.ts  # Structured mock mimicking live endpoints
│       └── store.ts          # Market / time-horizon / UAE sub-tab state
└── demo/demo.html            # Zero-dependency preview — open in any browser
```

## Quick start

**Instant preview (no install):** open `demo/demo.html`.

**Backend:**
```bash
cd backend
pip install -r requirements.txt
playwright install chromium
uvicorn app.main:app --reload          # http://localhost:8000/api/news
```
Optional AI ranking: `export ANTHROPIC_API_KEY=sk-...` (falls back to the
keyword scorer when unset).

**Frontend:**
```bash
cd frontend
npm install
npm run dev                            # http://localhost:5173
```
The frontend calls `/api/news` (proxied to :8000) and falls back to bundled
mock data automatically when the backend is offline — so the UI is always
demoable.

## Pipeline behavior

- **Refresh cadence:** every 10 minutes (configurable in `main.py`).
- **Dedup:** normalized-title RapidFuzz `token_set_ratio >= 88` OR identical
  ticker set + ratio >= 70 collapses copies; the exchange-origin source wins.
- **Ranking:** "high" (material disclosures) vs "general" (routine flow).
  Keyword scorer runs always; if `ANTHROPIC_API_KEY` is set, borderline items
  (gray-zone scores) are batch-classified by Claude Haiku.
- **Time horizons:** 24h / 7d / 30d filtering happens in the API layer and
  again client-side, so tab switches are instant.

## Anti-bot note (Tadawul / ADX / EGX)

These sites sit behind Cloudflare-class firewalls. `scrapers/base.py` tries
plain httpx first and automatically escalates to headless Playwright with
stealth settings on 403/503/challenge markers. If a source hard-blocks
datacenter IPs, set `PROXY_URL` to a residential proxy or swap the source to
its RSS feed where listed in `sources.yaml`. Selectors are isolated per module
so a site redesign only breaks one file.
