"""Regional outlets republish exchange disclosures near-verbatim. Collapse them.

Rule: two items are duplicates when their normalized titles hit
token_set_ratio >= 88, OR they share a ticker AND hit >= 70.
Survivor priority: exchange-origin source (EGX/Tadawul/ADX/DFM) > earliest.
"""
from __future__ import annotations

import re

from rapidfuzz import fuzz

from ..models import NewsItem

_STOP = re.compile(r"\b(the|a|an|of|for|to|in|on|and|its|company|announces?|announcement)\b", re.I)
_NONWORD = re.compile(r"[^a-z0-9\s]")

EXCHANGE_KEYS = {"egx", "tadawul", "adx", "dfm"}


def _norm(title: str) -> str:
    t = _NONWORD.sub(" ", title.lower())
    t = _STOP.sub(" ", t)
    return " ".join(t.split())


def dedupe(items: list[NewsItem]) -> list[NewsItem]:
    kept: list[NewsItem] = []
    for item in sorted(items, key=lambda i: (i.source_key not in EXCHANGE_KEYS,
                                             i.published_at)):
        n = _norm(item.headline)
        dup = False
        for k in kept:
            if k.market != item.market:
                continue
            ratio = fuzz.token_set_ratio(n, _norm(k.headline))
            shared = set(item.tickers) & set(k.tickers)
            if ratio >= 88 or (shared and ratio >= 70):
                dup = True
                break
        if not dup:
            kept.append(item)
    return kept
