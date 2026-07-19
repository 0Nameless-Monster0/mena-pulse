"""SQLite persistence. Upserts keyed on item id so re-scrapes are idempotent."""
from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .models import NewsItem

DB_PATH = Path(__file__).resolve().parent.parent / "menapulse.db"

_SCHEMA = """
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  source_key TEXT NOT NULL,
  source TEXT NOT NULL,
  market TEXT NOT NULL,
  exchange TEXT,
  headline TEXT NOT NULL,
  snippet TEXT,
  url TEXT NOT NULL,
  published_at TEXT NOT NULL,
  tickers TEXT NOT NULL DEFAULT '[]',
  impact TEXT NOT NULL DEFAULT 'general',
  score REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_news_market_time ON news (market, published_at DESC);
"""


def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(_SCHEMA)
    conn.row_factory = sqlite3.Row
    return conn


def upsert(items: list[NewsItem]) -> int:
    with _conn() as conn:
        conn.executemany(
            """INSERT INTO news (id, source_key, source, market, exchange, headline,
                                 snippet, url, published_at, tickers, impact, score)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
               ON CONFLICT(id) DO UPDATE SET
                 impact=excluded.impact, score=excluded.score, snippet=excluded.snippet""",
            [
                (i.id, i.source_key, i.source, i.market, i.exchange, i.headline,
                 i.snippet, i.url, i.published_at.isoformat(),
                 json.dumps(i.tickers), i.impact, i.score)
                for i in items
            ],
        )
    return len(items)


def query(market: str | None, window_days: int, exchange: str | None = None) -> list[dict]:
    cutoff = (datetime.now(timezone.utc) - timedelta(days=window_days)).isoformat()
    sql = "SELECT * FROM news WHERE published_at >= ?"
    args: list = [cutoff]
    if market:
        sql += " AND market = ?"
        args.append(market)
    if exchange:
        sql += " AND exchange = ?"
        args.append(exchange)
    sql += " ORDER BY score DESC, published_at DESC LIMIT 500"
    with _conn() as conn:
        rows = conn.execute(sql, args).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        d["tickers"] = json.loads(d["tickers"])
        out.append(d)
    return out
