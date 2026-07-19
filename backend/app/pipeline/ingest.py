"""Orchestrator: fan out all scrapers concurrently, normalize, dedupe, rank, store."""
from __future__ import annotations

import asyncio
import logging
from pathlib import Path

import yaml

from .. import storage
from ..models import NewsItem
from ..scrapers.adx import ADXScraper
from ..scrapers.base import BaseScraper
from ..scrapers.dfm import DFMScraper
from ..scrapers.egx import EGXScraper
from ..scrapers.rss import MubasherScraper, RSSScraper
from ..scrapers.tadawul import TadawulScraper
from . import dedup, ranker, tickers

log = logging.getLogger("menapulse.ingest")

STRATEGIES: dict[str, type[BaseScraper]] = {
    "egx": EGXScraper,
    "tadawul": TadawulScraper,
    "adx": ADXScraper,
    "dfm": DFMScraper,
    "rss": RSSScraper,
    "mubasher": MubasherScraper,
}
CONFIG = Path(__file__).resolve().parents[2] / "config" / "sources.yaml"


def load_scrapers() -> list[BaseScraper]:
    cfg = yaml.safe_load(CONFIG.read_text(encoding="utf-8"))
    return [STRATEGIES[s["strategy"]](s) for s in cfg["sources"]]


async def _run_one(scraper: BaseScraper) -> list[NewsItem]:
    try:
        items = await asyncio.wait_for(scraper.scrape(), timeout=90)
        log.info("%s: %d items", scraper.key, len(items))
        return items
    except Exception:  # noqa: BLE001 — one bad source must never kill the cycle
        log.exception("%s failed", scraper.key)
        return []


async def run_cycle() -> int:
    results = await asyncio.gather(*(_run_one(s) for s in load_scrapers()))
    items = [i for batch in results for i in batch if i.headline]
    for it in items:
        if not it.tickers:
            it.tickers = tickers.extract(it.headline, it.market)
    items = dedup.dedupe(items)
    items = await ranker.rank(items)
    n = storage.upsert(items)
    log.info("cycle complete: %d items stored", n)
    return n
