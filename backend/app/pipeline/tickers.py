"""Extract listed-company tickers from headlines.

Covers the most-watched names per market; extend TICKER_MAP from your coverage
universe (or load from an exchange symbol dump) without touching the regex.
"""
from __future__ import annotations

import re

# symbol -> aliases that appear in prose headlines
TICKER_MAP: dict[str, list[str]] = {
    # Egypt (EGX)
    "COMI": ["CIB", "Commercial International Bank"],
    "HRHO": ["EFG Hermes", "EFG Holding"],
    "TMGH": ["Talaat Moustafa", "TMG"],
    "SWDY": ["Elsewedy", "El Sewedy"],
    "EFIH": ["e-finance", "efinance"],
    "EAST": ["Eastern Company", "Eastern Tobacco"],
    "ABUK": ["Abu Qir Fertilizers", "Abou Kir"],
    "ETEL": ["Telecom Egypt"],
    "EKHO": ["EK Holding", "Egypt Kuwait Holding"],
    # Saudi (Tadawul)
    "2222": ["Aramco", "Saudi Aramco"],
    "1120": ["Al Rajhi", "Alrajhi"],
    "1180": ["SNB", "Saudi National Bank"],
    "7010": ["stc", "Saudi Telecom"],
    "2010": ["SABIC"],
    "1211": ["Maaden", "Ma'aden"],
    "4013": ["Sulaiman Al Habib", "Al Habib Medical"],
    "2082": ["ACWA Power"],
    # UAE (ADX / DFM)
    "FAB": ["First Abu Dhabi Bank"],
    "EAND": ["e&", "Etisalat"],
    "IHC": ["International Holding"],
    "ALDAR": ["Aldar"],
    "ADCB": ["Abu Dhabi Commercial Bank"],
    "EMAAR": ["Emaar"],
    "DIB": ["Dubai Islamic Bank"],
    "EMIRATESNBD": ["Emirates NBD"],
    "SALIK": ["Salik"],
    "DEWA": ["DEWA", "Dubai Electricity"],
}

_PATTERNS = [
    (sym, re.compile(r"\b(" + "|".join(map(re.escape, [sym, *aliases])) + r")\b", re.I))
    for sym, aliases in TICKER_MAP.items()
]
# Bare numeric Tadawul codes like "(2222)" or "4-digit.SR"
_SAUDI_CODE = re.compile(r"\((\d{4})\)|\b(\d{4})\.SR\b")


def extract(headline: str, market: str) -> list[str]:
    found: list[str] = []
    for sym, pat in _PATTERNS:
        if pat.search(headline):
            found.append(sym)
    if market == "SA":
        for m in _SAUDI_CODE.finditer(headline):
            code = m.group(1) or m.group(2)
            if code and code not in found:
                found.append(code)
    return found[:4]
