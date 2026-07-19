"""Fetch layer with automatic Cloudflare escalation.

Order of attack per source:
  1. Plain httpx with realistic browser headers (fast, cheap).
  2. If blocked (403/503/challenge markers) -> headless Playwright Chromium
     with stealth flags, optionally through PROXY_URL.
"""
from __future__ import annotations

import asyncio
import os
import random
from abc import ABC, abstractmethod

import httpx

from ..models import NewsItem

UA_POOL = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
]
CHALLENGE_MARKERS = ("cf-challenge", "just a moment", "attention required", "__cf_chl")
PROXY_URL = os.getenv("PROXY_URL")  # e.g. residential proxy for hard-blocked exchanges


class BaseScraper(ABC):
    def __init__(self, cfg: dict):
        self.cfg = cfg
        self.key: str = cfg["key"]
        self.name: str = cfg["name"]
        self.market: str = cfg["market"]
        self.exchange: str | None = cfg.get("exchange")

    # ── fetching ────────────────────────────────────────────────────────
    async def fetch(self, url: str, *, force_browser: bool = False) -> str:
        if not force_browser:
            try:
                async with httpx.AsyncClient(
                    headers={"User-Agent": random.choice(UA_POOL),
                             "Accept-Language": "en-US,en;q=0.9"},
                    timeout=20, follow_redirects=True, proxy=PROXY_URL,
                ) as client:
                    r = await client.get(url)
                    body = r.text
                    if r.status_code < 400 and not self._is_challenge(body):
                        return body
            except httpx.HTTPError:
                pass  # escalate
        return await self._fetch_browser(url)

    @staticmethod
    def _is_challenge(body: str) -> bool:
        low = body[:4000].lower()
        return any(m in low for m in CHALLENGE_MARKERS)

    async def _fetch_browser(self, url: str) -> str:
        from playwright.async_api import async_playwright

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                proxy={"server": PROXY_URL} if PROXY_URL else None,
                args=["--disable-blink-features=AutomationControlled"],
            )
            ctx = await browser.new_context(
                user_agent=random.choice(UA_POOL), locale="en-US",
                viewport={"width": 1440, "height": 900},
            )
            page = await ctx.new_page()
            await page.goto(url, wait_until="networkidle", timeout=45_000)
            # Let CF's JS challenge settle if present.
            for _ in range(10):
                html = await page.content()
                if not self._is_challenge(html):
                    break
                await asyncio.sleep(1.5)
            html = await page.content()
            await browser.close()
            return html

    # ── contract ────────────────────────────────────────────────────────
    @abstractmethod
    async def scrape(self) -> list[NewsItem]:
        """Return normalized NewsItems (headline, timestamp, snippet, abs URL)."""
