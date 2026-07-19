import { MOCK_NEWS } from "./data/mockNews";
import type { NewsItem } from "./types";

/**
 * Data source waterfall (all filtering stays client-side, so tabs are instant):
 *  1. Live FastAPI backend  → /api/news            (Options B/C in DEPLOY.md)
 *  2. Static scraped feed   → /news.json           (Option A: GitHub Actions)
 *  3. Bundled mock corpus                          (offline demo)
 */
export async function fetchNews(): Promise<{ items: NewsItem[]; live: boolean }> {
  try {
    const res = await fetch("/api/news?window=monthly", { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return { items: [...data.high_impact, ...data.general], live: true };
  } catch { /* fall through */ }
  try {
    const res = await fetch("./news.json", { signal: AbortSignal.timeout(4000), cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (Array.isArray(data.items) && data.items.length) return { items: data.items, live: true };
  } catch { /* fall through */ }
  return { items: MOCK_NEWS, live: false };
}
