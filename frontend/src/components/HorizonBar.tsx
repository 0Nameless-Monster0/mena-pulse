import { WINDOW_HOURS } from "../lib/time";
import { useNav } from "../store";
import type { NewsItem, TimeWindow } from "../types";

const WINDOWS: Array<{ id: TimeWindow; label: string; sub: string }> = [
  { id: "daily", label: "Daily", sub: "Last 24 hours" },
  { id: "weekly", label: "Weekly", sub: "Last 7 days" },
  { id: "monthly", label: "Monthly", sub: "Last 30 days" },
];

/** Per-exchange time-horizon selector with live counts. Windows are
 *  cumulative: Weekly includes the last 24h, Monthly includes both. */
export function HorizonBar({ items, lastUpdated }: { items: NewsItem[]; lastUpdated: Date }) {
  const { window: win, setWindow } = useNav();
  const count = (w: TimeWindow) =>
    items.filter((i) => Date.now() - new Date(i.published_at).getTime() <= WINDOW_HOURS[w] * 3600_000).length;
  return (
    <div className="mb-3 flex flex-wrap items-stretch gap-2" role="tablist" aria-label="Time horizon">
      {WINDOWS.map((w) => (
        <button
          key={w.id}
          role="tab"
          aria-selected={win === w.id}
          onClick={() => setWindow(w.id)}
          className={`min-w-[150px] rounded-lg border px-4 py-2 text-left transition ${
            win === w.id
              ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
              : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600"
          }`}
        >
          <div className="text-xs font-bold">{w.label}</div>
          <div className={`mt-0.5 font-mono text-[10px] ${win === w.id ? "text-amber-400/70" : "text-slate-500"}`}>
            {w.sub} · {count(w.id)} items
          </div>
        </button>
      ))}
      <div className="ml-auto flex items-center gap-2 font-mono text-[10px] text-slate-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        LIVE · updated {lastUpdated.toLocaleTimeString()} · refreshes every 60s
      </div>
    </div>
  );
}
