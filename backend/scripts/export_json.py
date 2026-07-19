"""Run one scrape cycle and dump the 30-day corpus to a static news.json.

Used by the free GitHub Actions deployment: the workflow commits the JSON and
the static frontend fetches it — no server required.
"""
import asyncio
import json
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app import storage                      # noqa: E402
from app.pipeline.ingest import run_cycle    # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(message)s")
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("news.json")


async def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    stored = await run_cycle()
    rows = storage.query(market=None, window_days=30)
    OUT.write_text(json.dumps({"count": len(rows), "items": rows},
                              ensure_ascii=False, default=str), encoding="utf-8")
    print(f"stored={stored} exported={len(rows)} -> {OUT}")


if __name__ == "__main__":
    asyncio.run(main())
