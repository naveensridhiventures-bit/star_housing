import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { BUDGET_BANDS, shortType } from "../../lib/gallery";

function Sel({ label, value, onChange, children }) {
  return (
    <label className="block min-w-0 px-4 py-3 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-line last:border-0">
      <span className="block text-[12px] text-ink/55">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-transparent text-[15.5px] font-semibold text-ink outline-none cursor-pointer truncate"
      >
        {children}
      </select>
    </label>
  );
}

/**
 * Quick search for the home page: one bordered bar with three selects and a
 * button. Lands in the gallery already filtered.
 */
export default function SearchDock({ properties }) {
  const navigate = useNavigate();
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState("any");
  const [area, setArea] = useState("All");

  const { types, areas } = useMemo(() => {
    const live = (properties || []).filter((p) => !p.sold);
    return {
      types: [...new Set(live.map((p) => p.type).filter(Boolean))].sort(),
      areas: [...new Set(live.map((p) => p.area).filter(Boolean))].sort(),
    };
  }, [properties]);

  function go(e) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (type !== "All") q.set("type", type);
    if (budget !== "any") q.set("budget", budget);
    if (area !== "All") q.set("area", area);
    const s = q.toString();
    navigate(`/gallery${s ? `?${s}` : ""}`);
  }

  return (
    <form onSubmit={go} aria-label="Find a property" className="rounded-xl bg-white border border-line shadow-lift sm:flex sm:items-stretch overflow-hidden">
      <div className="sm:flex-1 sm:grid sm:grid-cols-3 min-w-0">
        <Sel label="Looking for" value={type} onChange={setType}>
          <option value="All">Any property</option>
          {types.map((t) => <option key={t} value={t}>{shortType(t)}</option>)}
        </Sel>
        <Sel label="Budget" value={budget} onChange={setBudget}>
          {BUDGET_BANDS.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
        </Sel>
        <Sel label="Location" value={area} onChange={setArea}>
          <option value="All">Anywhere</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </Sel>
      </div>
      <button type="submit" className="rip w-full sm:w-auto sm:min-w-[9.5rem] h-14 sm:h-auto bg-brand hover:bg-brand-dark text-white font-semibold text-[15.5px] flex items-center justify-center gap-2 transition-colors">
        <Search size={18} /> Search
      </button>
    </form>
  );
}
