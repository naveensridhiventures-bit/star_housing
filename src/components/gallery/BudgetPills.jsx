import { BUDGET_BANDS } from "../../lib/gallery";

/** One-tap budget bands, the way buyers actually think. */
export default function BudgetPills({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label="Filter by budget">
      {BUDGET_BANDS.map((b) => {
        const on = value === b.key;
        return (
          <button
            key={b.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(b.key)}
            className={`shrink-0 h-9 px-3.5 rounded-md text-[13px] font-semibold border transition-colors ${on ? "bg-brand border-brand text-white" : "bg-white border-line text-ink/70 hover:border-ink/40"}`}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}
