import { useNav } from "../store";
import type { Market } from "../types";

const TABS: Array<{ id: Market; label: string }> = [
  { id: "EG", label: "Egypt" },
  { id: "SA", label: "Saudi Arabia (Tadawul)" },
  { id: "AE", label: "United Arab Emirates" },
];

export function MarketTabs() {
  const { market, setMarket } = useNav();
  return (
    <nav className="flex gap-1" role="tablist" aria-label="Market">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={market === t.id}
          onClick={() => setMarket(t.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            market === t.id
              ? "bg-slate-800 text-white shadow-inner"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
