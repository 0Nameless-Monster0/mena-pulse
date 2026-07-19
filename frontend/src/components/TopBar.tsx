import { Activity } from "lucide-react";
import { MarketTabs } from "./MarketTabs";

export function TopBar({ live }: { live: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-amber-500" />
          <span className="font-mono text-sm font-bold tracking-widest text-slate-100">
            MENA<span className="text-amber-500">PULSE</span>
          </span>
          <span className={`ml-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
            live ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700/40 text-slate-400"
          }`}>
            {live ? "LIVE" : "MOCK"}
          </span>
        </div>
        <MarketTabs />
      </div>
    </header>
  );
}
