# Deploying MENA Pulse for free

## Option A — GitHub Actions + static hosting (recommended, $0 forever)

No server. A scheduled workflow scrapes every ~15 min and commits
`frontend/public/news.json`; the static frontend reads it.

1. Push this repo to GitHub (public repo = unlimited free Actions minutes).
2. Actions tab → enable workflows. `scrape.yml` is already included; press
   **Run workflow** once to seed the first `news.json`.
3. Host the frontend free on any of:
   - **Netlify / Vercel**: import the repo, base dir `frontend`,
     build `npm run build`, output `dist`. Every feed commit auto-redeploys.
   - **GitHub Pages**: add `- run: cd frontend && npm ci && npm run build`
     + a Pages deploy step to the workflow.
4. Optional secrets (repo Settings → Secrets → Actions):
   - `ANTHROPIC_API_KEY` — AI ranking for borderline headlines (paid API;
     without it the free keyword scorer is used).
   - `PROXY_URL` — residential proxy if Tadawul/ADX block GitHub's IPs.

Notes: minimum practical cadence is ~15 min (GitHub queues cron jobs);
the Actions cache keeps the SQLite DB so 30-day history accumulates.

## Option B — Hugging Face Spaces (free Docker container, live API)

Keeps the real FastAPI backend + 60s refresh loop.

1. Create a Space → type **Docker** → clone it.
2. Copy this repo in (the provided `Dockerfile` already targets port 7860).
3. Push. Your API is at `https://<user>-<space>.hf.space/api/news`.
4. Point the frontend at it: in `frontend/vite.config.ts` set the proxy
   target, or set `VITE_API_BASE` and use it in `api.ts`.

Caveats: free CPU tier; Space sleeps after ~48h with no traffic (wakes on
first request); storage is ephemeral — history rebuilds over time.

## Option C — Oracle Cloud Always Free VM (true always-on)

4 ARM OCPUs / 24 GB RAM, free forever (card needed for signup verification).
```bash
sudo apt install python3-pip && pip install -r backend/requirements.txt
playwright install --with-deps chromium
tmux new -d 'cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000'
```
Serve the built frontend with nginx or host it on Netlify pointing at the VM.

## Reality checks

- **Cadence**: only Options B/C give the per-minute loop; Option A is ~15 min.
- **Anti-bot**: all free clouds use datacenter IPs. Aggregators (Mubasher,
  Zawya, Enterprise, Al Mal, Arab Finance) generally work; EGX/Tadawul/ADX/DFM
  may require the `PROXY_URL` residential-proxy fallback (paid) or their RSS
  alternatives in `sources.yaml`.
- **Costs that are never free**: residential proxies and the Anthropic API.
  Everything else above runs at $0.
