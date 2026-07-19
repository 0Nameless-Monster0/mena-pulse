import { useNav } from "../store";
import type { UaeSub } from "../types";

const SUBS: Array<{ id: UaeSub; label: string }> = [
  { id: "ALL", label: "All UAE" },
  { id: "ADX", label: "ADX Only" },
  { id: "DFM", label: "DFM Only" },
];

/** Rendered only when the UAE macro tab is active. Pure client-side filter. */
export function UaeSubTabs() {
  const { uaeSub, setUaeSub } = useNav();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-3">
      <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900/60 p-0.5"
           role="tablist" aria-label="UAE exchange">
        {SUBS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={uaeSub === s.id}
            onClick={() => setUaeSub(s.id)}
            className={`rounded-md px-3.5 py-1 text-xs font-semibold transition ${
              uaeSub === s.id
                ? "bg-slate-700 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
