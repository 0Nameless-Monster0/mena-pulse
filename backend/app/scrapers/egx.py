"""Egyptian Exchange news search — https://www.egx.com.eg/en/newssearch.aspx

ASPX WebForms page (ViewState postbacks), so we render with Playwright and
parse the results grid. Selector notes kept inline: they are the only thing
that changes when EGX redesigns.
"""
from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from dateutil import parser as dtparse

from ..models import NewsItem
from .base import BaseScraper


class EGXScraper(BaseScraper):
    async def scrape(self) -> list[NewsItem]:
        html = await self.fetch(self.cfg["url"], force_browser=True)
        soup = BeautifulSoup(html, "lxml")
        items: list[NewsItem] = []
        # Results grid: table rows with a date cell + anchor to NewsDetails.aspx
        for row in soup.select("table[id*='grdNews'] tr, .news-search-results tr"):
            link = row.select_one("a[href*='ews']")
            date_cell = row.select_one("td:first-child")
            if not link or not link.get_text(strip=True):
                continue
            when = datetime.now(timezone.utc)
            if date_cell:
                try:
                    when = dtparse.parse(date_cell.get_text(strip=True), dayfirst=True)\
                                  .replace(tzinfo=timezone.utc)
                except (ValueError, OverflowError):
                    pass
            items.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                exchange=self.exchange,
                headline=link.get_text(strip=True),
                url=urljoin("https://www.egx.com.eg/en/", link["href"]),
                published_at=when,
            ))
        return items
