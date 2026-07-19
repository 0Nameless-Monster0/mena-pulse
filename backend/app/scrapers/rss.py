"""Config-driven RSS/JSON scraper for aggregators:
Enterprise, Mubasher (JSON API), Zawya, Al Mal, Arab Finance.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from time import mktime

import feedparser

from ..models import NewsItem
from .base import BaseScraper


class RSSScraper(BaseScraper):
    async def scrape(self) -> list[NewsItem]:
        body = await self.fetch(self.cfg["url"])
        feed = feedparser.parse(body)
        out = []
        for e in feed.entries[:40]:
            when = datetime.now(timezone.utc)
            if getattr(e, "published_parsed", None):
                when = datetime.fromtimestamp(mktime(e.published_parsed), tz=timezone.utc)
            out.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                exchange=self.exchange,
                headline=e.get("title", "").strip(),
                snippet=(e.get("summary", "") or "")[:280],
                url=e.get("link", self.cfg["url"]),
                published_at=when,
            ))
        return out


class MubasherScraper(BaseScraper):
    """Mubasher ships a public JSON API for listed-company news."""

    async def scrape(self) -> list[NewsItem]:
        body = await self.fetch(self.cfg["url"])
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            return []
        out = []
        for r in data.get("news", data.get("data", []))[:40]:
            out.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                headline=r.get("title", ""),
                snippet=(r.get("summary") or "")[:280],
                url="https://www.mubasher.info" + r.get("newsUrl", "")
                    if r.get("newsUrl", "").startswith("/") else r.get("newsUrl", ""),
                published_at=datetime.fromisoformat(r["publishedDate"])
                    if r.get("publishedDate") else datetime.now(timezone.utc),
                tickers=[c["symbol"] for c in r.get("companies", []) if c.get("symbol")],
            ))
        return out
