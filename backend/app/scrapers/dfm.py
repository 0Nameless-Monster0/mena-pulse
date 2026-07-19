"""Dubai Financial Market — marketwatch.dfm.ae disclosures feed (JSON-first)."""
from __future__ import annotations

import json
from datetime import timezone

from dateutil import parser as dtparse

from ..models import NewsItem
from .base import BaseScraper


class DFMScraper(BaseScraper):
    async def scrape(self) -> list[NewsItem]:
        body = await self.fetch(self.cfg.get("api", self.cfg["url"]))
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            return []  # challenge page; next cycle will use browser fetch cache
        rows = data.get("disclosures") or data.get("data") or []
        out = []
        for r in rows:
            out.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                exchange=self.exchange,
                headline=r.get("title", ""),
                snippet=r.get("summary", ""),
                url=r.get("attachmentUrl") or r.get("url")
                    or "https://www.dfm.ae/the-exchange/news-disclosures",
                published_at=dtparse.parse(r.get("publishedAt") or r.get("date"))
                                     .replace(tzinfo=timezone.utc),
                tickers=[r["symbol"]] if r.get("symbol") else [],
            ))
        return out
