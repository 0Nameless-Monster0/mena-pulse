"""Canonical news item schema shared by scrapers, pipeline, storage, and API."""
from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, Field

Market = Literal["EG", "SA", "AE"]
Impact = Literal["high", "general"]


class NewsItem(BaseModel):
    id: str = ""                     # sha1 of source_key + url (stable across runs)
    source_key: str                  # e.g. "egx", "zawya_ae"
    source: str                      # display tag, e.g. "EGX", "Zawya"
    market: Market
    exchange: Optional[str] = None   # EGX | TASI | ADX | DFM | None (aggregators)
    headline: str
    snippet: str = ""
    url: str                         # absolute link to the original story
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    tickers: list[str] = []
    impact: Impact = "general"
    score: float = 0.0               # ranking confidence, 0..1

    def model_post_init(self, _ctx) -> None:
        if not self.id:
            raw = f"{self.source_key}|{self.url}|{self.headline}".encode()
            self.id = hashlib.sha1(raw).hexdigest()[:16]
        if self.published_at.tzinfo is None:
            self.published_at = self.published_at.replace(tzinfo=timezone.utc)
