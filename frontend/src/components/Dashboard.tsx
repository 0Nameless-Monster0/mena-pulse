import { useMemo } from "react";
import { withinWindow } from "../lib/time";
import { useNav } from "../store";
import type { NewsItem } from "../types";
import { HorizonBar } from "./HorizonBar";
import { NewsSection } from "./NewsSection";
import { UaeSubTabs } from "./UaeSubTabs";

export function Dashboard({ items, lastUpdated }: { items: NewsItem[]; lastUpdated: Date }) {
  const { market, window: win, uaeSub } = useNav();

  // Market + exchange scoping first (counts on HorizonBar reflect this scope)…
  const scoped = useMemo(() => {
    let out = items.filter((i) => i.market === market);
    if (market === "AE" && uaeSub !== "ALL") out = out.filter((i) => i.exchange === uaeSub);
    return out;
  }, [items, market, uaeSub]);

  // …then the cumulative time window (24h ⊂ 7d ⊂ 30d), newest first.
  const filtered = useMemo(
    () =>
      scoped
        .filter((i) => withinWindow(i.published_at, win))
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
    [scoped, win]
  );

  return (
    <>
      {market === "AE" && <UaeSubTabs />}
      <main className="mx-auto max-w-6xl px-4 py-4">
        <HorizonBar items={scoped} lastUpdated={lastUpdated} />
        <NewsSection
          title="High-Impact Material Disclosures"
          variant="high"
          items={filtered.filter((i) => i.impact === "high")}
        />
        <NewsSection
          title="General Market Stream"
          variant="general"
          items={filtered.filter((i) => i.impact === "general")}
        />
      </main>
    </>
  );
}
