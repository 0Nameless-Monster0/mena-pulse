"""Impact ranking: material disclosure vs routine market flow.

Tier 1 — deterministic keyword scorer (always on, zero latency, free).
Tier 2 — optional Claude Haiku batch classification for gray-zone items
         (0.35 <= score < 0.65) when ANTHROPIC_API_KEY is set.
"""
from __future__ import annotations

import json
import os
import re

from ..models import NewsItem

HIGH_SIGNALS: dict[str, float] = {
    r"\b(acqui(re|sition)|merger|m&a|takeover|tender offer|stake (sale|purchase))\b": .9,
    r"\b(profit|earnings|net income|loss)\b.*\b(surge|jump|beat|miss|fell|drop|record)\b": .85,
    r"\b(q[1-4]|quarterly|full[- ]year|fy\d{2})\b.*\bresults?\b": .8,
    r"\b(dividend|capital (increase|reduction)|rights issue|share buy ?back|bonus shares?)\b": .8,
    r"\b(ipo|list(ing)?|book ?building|offering price)\b": .75,
    r"\b(ceo|cfo|chairman|managing director|board)\b.*\b(resign|appoint|replac|step(s)? down)\b": .8,
    r"\b(central bank|cbe|sama|cbuae|interest rate|rate (cut|hike)|monetary policy|repo rate)\b": .85,
    r"\b(regulat|fra|cma|sca|license (revok|suspend)|fine[sd]?|investigation|delist)\b": .75,
    r"\b(credit rating|upgrade[sd]?|downgrade[sd]?|outlook (raised|revised|negative|positive))\b": .7,
    r"\b(contract award|mega ?project|expansion worth|capex)\b": .65,
    r"\b(guidance|profit warning)\b": .8,
}
LOW_SIGNALS: dict[str, float] = {
    r"\b(closes? (higher|lower|up|down)|daily (recap|summary)|market wrap)\b": -.5,
    r"\b(trading volume|turnover|most active|top (gainers|losers))\b": -.4,
    r"\b(weekly review|technical analysis|analyst note)\b": -.3,
}
_COMPILED = [(re.compile(p, re.I), w) for p, w in {**HIGH_SIGNALS, **LOW_SIGNALS}.items()]

THRESHOLD = 0.5
GRAY = (0.35, 0.65)


def keyword_score(headline: str, snippet: str = "") -> float:
    text = f"{headline} {snippet}"
    score = 0.30  # neutral prior
    for pat, w in _COMPILED:
        if pat.search(text):
            score += w * (1 if w > 0 else 1)  # weights already signed
    return max(0.0, min(1.0, score))


async def rank(items: list[NewsItem]) -> list[NewsItem]:
    gray: list[NewsItem] = []
    for it in items:
        it.score = keyword_score(it.headline, it.snippet)
        it.impact = "high" if it.score >= THRESHOLD else "general"
        if GRAY[0] <= it.score < GRAY[1]:
            gray.append(it)
    if gray and os.getenv("ANTHROPIC_API_KEY"):
        await _llm_refine(gray)
    return items


async def _llm_refine(items: list[NewsItem]) -> None:
    """One batched Haiku call for all borderline headlines."""
    import anthropic

    client = anthropic.AsyncAnthropic()
    numbered = "\n".join(f"{i}. [{it.market}] {it.headline}" for i, it in enumerate(items))
    msg = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=(
            "You classify MENA equity-market headlines for a research analyst. "
            "HIGH = material: earnings surprises, M&A, regulatory action, C-suite "
            "changes, central-bank rate moves, capital increases/reductions, "
            "dividends, ratings actions. GENERAL = routine: volumes, price "
            "summaries, market commentary. Reply ONLY with JSON: "
            '{"labels": ["high"|"general", ...]} in input order.'
        ),
        messages=[{"role": "user", "content": numbered}],
    )
    try:
        labels = json.loads(msg.content[0].text)["labels"]
        for it, label in zip(items, labels):
            it.impact = "high" if label == "high" else "general"
            it.score = max(it.score, 0.66) if label == "high" else min(it.score, 0.34)
    except (json.JSONDecodeError, KeyError, IndexError):
        pass  # keep keyword-scorer verdicts
