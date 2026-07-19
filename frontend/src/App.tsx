import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNews } from "./api";
import { Dashboard } from "./components/Dashboard";
import { TopBar } from "./components/TopBar";
import { nextBreaking } from "./data/mockNews";
import type { NewsItem } from "./types";

export default function App() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [live, setLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const tickRef = useRef(0);
  const breakingRef = useRef<NewsItem[]>([]);

  /** Updated by the minute: re-poll the backend (live mode) or inject a fresh
   *  breaking item (mock mode). Re-render refreshes "Xm ago" labels + counts. */
  const sync = useCallback(async (injectBreaking: boolean) => {
    const { items: base, live } = await fetchNews();
    if (!live && injectBreaking) {
      breakingRef.current = [nextBreaking(tickRef.current++), ...breakingRef.current];
    }
    setLive(live);
    setItems(live ? base : [...breakingRef.current, ...base]);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    sync(false);
    const t = setInterval(() => sync(true), 60_000);
    return () => clearInterval(t);
  }, [sync]);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar live={live} />
      <Dashboard items={items} lastUpdated={lastUpdated} />
    </div>
  );
}
