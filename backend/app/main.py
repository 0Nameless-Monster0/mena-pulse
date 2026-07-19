"""FastAPI server + 10-minute background refresh loop.

GET /api/news?market=EG|SA|AE&window=daily|weekly|monthly&exchange=ADX|DFM
"""
from __future__ import annotations

import asyncio
import contextlib
import logging
from typing import Literal, Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from . import storage
from .pipeline.ingest import run_cycle

logging.basicConfig(level=logging.INFO)
REFRESH_SECONDS = 60
WINDOWS = {"daily": 1, "weekly": 7, "monthly": 30}


async def _refresher():
    while True:
        with contextlib.suppress(Exception):
            await run_cycle()
        await asyncio.sleep(REFRESH_SECONDS)


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_refresher())
    yield
    task.cancel()


app = FastAPI(title="MENA Pulse API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/news")
async def get_news(
    market: Optional[Literal["EG", "SA", "AE"]] = None,
    window: Literal["daily", "weekly", "monthly"] = "daily",
    exchange: Optional[Literal["EGX", "TASI", "ADX", "DFM"]] = None,
):
    rows = storage.query(market, WINDOWS[window], exchange)
    return {
        "count": len(rows),
        "high_impact": [r for r in rows if r["impact"] == "high"],
        "general": [r for r in rows if r["impact"] == "general"],
    }


@app.post("/api/refresh")
async def refresh_now():
    return {"stored": await run_cycle()}
