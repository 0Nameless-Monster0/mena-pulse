import { AlertTriangle, Newspaper } from "lucide-react";
import type { NewsItem } from "../types";
import { NewsCard } from "./NewsCard";

export function NewsSection({ title, items, variant }: {
  title: string;
  items: NewsItem[];
  variant: "high" | "general";
}) {
  const high = variant === "high";
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        {high
          ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          : <Newspaper className="h-3.5 w-3.5 text-slate-500" />}
        <h2 className={`font-mono text-[11px] font-bold uppercase tracking-widest ${
          high ? "text-amber-500" : "text-slate-500"
        }`}>
          {title}
        </h2>
        <span className="font-mono text-[10px] text-slate-600">({items.length})</span>
        <div className={`h-px flex-1 ${high ? "bg-amber-500/20" : "bg-slate-800"}`} />
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-800 px-3 py-4 text-center text-xs text-slate-600">
          Nothing in this window.
        </p>
      ) : (
        <div className="space-y-1.5">
          {items.map((i) => <NewsCard key={i.id} item={i} highlight={high} />)}
        </div>
      )}
    </section>
  );
}
