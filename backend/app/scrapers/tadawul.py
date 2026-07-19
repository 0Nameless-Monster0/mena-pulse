"""Saudi Exchange issuer news.

Portal URL: /newsandreports/issuer-news?locale=en (WebSphere portal behind a
strong firewall). The page loads announcements via an XHR the portal issues
internally; rendering with Playwright and reading the hydrated DOM is the most
durable approach. If Playwright is blocked from your egress IP, set PROXY_URL.
"""
from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from dateutil import parser as dtparse

from ..models import NewsItem
from .base import BaseScraper


class TadawulScraper(BaseScraper):
    async def scrape(self) -> list[NewsItem]:
        html = await self.fetch(self.cfg["url"], force_browser=True)
        soup = BeautifulSoup(html, "lxml")
        items: list[NewsItem] = []
        # Announcement list: cards/rows containing company name, title, datetime
        for row in soup.select(".announcement-list li, table.announcements tr, .issuerNewsList .row"):
            link = row.select_one("a")
            if not link or not link.get_text(strip=True):
                continue
            time_el = row.select_one("time, .date, td.date")
            when = datetime.now(timezone.utc)
            if time_el:
                try:
                    when = dtparse.parse(time_el.get_text(strip=True))\
                                  .replace(tzinfo=timezone.utc)
                except (ValueError, OverflowError):
                    pass
            items.append(NewsItem(
                source_key=self.key, source=self.name, market=self.market,
                exchange=self.exchange,
                headline=link.get_text(strip=True),
                url=urljoin("https://www.saudiexchange.sa", link.get("href", "")),
                published_at=when,
            ))
        return items
