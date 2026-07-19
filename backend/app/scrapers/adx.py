"""Abu Dhabi Securities Exchange disclosures.

ADX exposes a JSON endpoint consumed by its own frontend; we hit that first
(fast, structured), then fall back to rendering the homepage news section.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone

from bs4 import BeautifulSoup
from dateutil import parser as dtparse

from ..models import NewsItem
from .base import BaseScraper


class ADXScraper(BaseScraper):
    async def scrape(self) -> list[NewsItem]:
        api = self.cfg.get("api")
        if api:
            try:
                body = await self.fetch(api)
                return self._from_json(json.loads(body))
            except (json.JSONDecodeError, KeyError):
                pass  # API shape changed or challenge page returned — fall back
        html = await self.fetch(self.cfg["url"], force_browser=True)
        return self._from_html(html)

    def _from_json(self, data: dict) -> list[NewsItem]:
        rows = data.get("data") or data.get("items") or []
        out = []
        for r in rows:
            out.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                exchange=self.exchange,
                headline=r.get("title") or r.get("headline", ""),
                snippet=r.get("summary", ""),
                url=r.get("url") or f"https://www.adx.ae/en/news/{r.get('id','')}",
                published_at=dtparse.parse(r.get("date") or r.get("publishedDate"))
                                     .replace(tzinfo=timezone.utc),
                tickers=[r["symbol"]] if r.get("symbol") else [],
            ))
        return out

    def _from_html(self, html: str) -> list[NewsItem]:
        soup = BeautifulSoup(html, "lxml")
        out = []
        for card in soup.select(".news-card, .disclosure-item, article"):
            link = card.select_one("a")
            if not link or not link.get_text(strip=True):
                continue
            out.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                exchange=self.exchange,
                headline=link.get_text(strip=True),
                url=link.get("href", self.cfg["url"]),
                published_at=datetime.now(timezone.utc),
            ))
        return out
