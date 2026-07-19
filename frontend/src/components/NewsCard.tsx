import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { overviewFor } from "../lib/overview";
import { segmentHeadline } from "../lib/tickers";
import { timeAgo } from "../lib/time";
import type { NewsItem } from "../types";

const SOURCE_COLORS: Record<string, string> = {
  EGX: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Tadawul: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ADX: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  DFM: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export function NewsCard({ item, highlight }: { item: NewsItem; highlight?: boolean }) {
  const [open, setOpen] = useState(false);
  const tag = SOURCE_COLORS[item.source] ?? "bg-slate-500/15 text-slate-400 border-slate-600/40";
  const isNew = Date.now() - new Date(item.published_at).getTime() < 2 * 60_000;
  return (
    <article
      className={`group flex items-start gap-3 rounded-lg border px-3 py-2 transition ${
        highlight
          ? "border-amber-500/20 bg-slate-900 hover:border-amber-500/50"
          : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2 font-mono text-[10px]">
          {isNew && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" title="new" />}
          <span className={`rounded border px-1.5 py-px font-bold ${tag}`}>{item.source}</span>
          <time className="text-slate-500" dateTime={item.published_at}>
            {timeAgo(item.published_at)}
          </time>
          {item.tickers.map((t) => (
            <span key={t} className="rounded bg-amber-500/10 px-1.5 py-px font-bold text-amber-400">
              {t}
            </span>
          ))}
        </div>
        <h3 className="text-[13px] leading-snug text-slate-200">
          {segmentHeadline(item.headline, item.tickers).map((seg, i) =>
            seg.ticker ? <strong key={i} className="font-bold text-amber-300">{seg.text}</strong>
                       : <span key={i}>{seg.text}</span>
          )}
        </h3>
        {open && (
          <div className="mt-2 border-t border-dashed border-slate-800 pt-2">
            <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-400">
              Analyst overview
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              {overviewFor(item)}{" "}
              <span className="text-slate-500">
                — Source: {item.source} · published {timeAgo(item.published_at)}.
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="mt-0.5 flex shrink-0 gap-1.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[10px] font-semibold transition ${
            open
              ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
              : "border-slate-700 text-slate-400 opacity-70 group-hover:opacity-100 hover:border-amber-500/50 hover:text-amber-400"
          }`}
        >
          {open ? "Hide" : "Overview"}
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 font-mono text-[10px] font-semibold text-slate-400 opacity-70 transition group-hover:opacity-100 hover:border-amber-500/50 hover:text-amber-400"
        >
          Read Source <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
