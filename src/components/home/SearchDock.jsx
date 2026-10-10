import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Wallet, MapPin, Search, ChevronDown } from "lucide-react";
import { BUDGET_BANDS, shortType } from "../../lib/gallery";

function Field({ icon: Icon, label, value, onChange, children }) {
  return (
    <label className="group relative block min-w-0">
      <span className="block text-[12px] font-semibold text-ink/55 mb-1.5 ml-1">{label}</span>
      <span className="relative block">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A6F06] pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[3.3rem] appearance-none rounded-2xl bg-[#EEF4FD] border border-transparent pl-11 pr-9 text-[15px] font-semibold text-ink outline-none cursor-pointer transition focus:border-[#F5B21B] focus:bg-white focus:shadow-[0_0_0_3px_rgba(245,178,27,0.22)] hover:bg-[#E8F0FB]"
        >
          {children}
        </select>
        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none" />
      </span>
    </label>
  );
}

/**
 * The quick search that sits across the edge of the hero: pick a type,
 * budget and area and land in the gallery already filtered.
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
    <form onSubmit={go} className="dock-pop relative rounded-[1.75rem] bg-surface p-4 sm:p-5 shadow-[0_28px_60px_-24px_rgba(6,23,52,0.65)] ring-1 ring-ink/[0.06]" aria-label="Find a property">
      <span className="absolute inset-x-6 top-0 h-[2px] rounded-b-full bg-gradient-to-r from-transparent via-[#F5B21B] to-transparent" aria-hidden="true" />
      <h2 className="font-display font-bold text-[1.25rem] sm:text-[1.4rem] text-ink leading-tight mb-3.5">Find your dream property</h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
        <Field icon={Building2} label="Property type" value={type} onChange={setType}>
          <option value="All">Any type</option>
          {types.map((t) => <option key={t} value={t}>{shortType(t)}</option>)}
        </Field>
        <Field icon={Wallet} label="Budget" value={budget} onChange={setBudget}>
          {BUDGET_BANDS.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
        </Field>
        <Field icon={MapPin} label="Area" value={area} onChange={setArea}>
          <option value="All">Anywhere</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </Field>
        <button type="submit" className="rip btn-shine h-[3.3rem] sm:px-7 rounded-2xl bg-gradient-to-br from-gold-light via-gold to-[#E39A05] hover:brightness-105 text-ink-dark font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.97] transition-[transform,background-color] shadow-[0_10px_22px_-10px_rgba(154,111,6,0.9)]">
          <Search size={18} /> Search
        </button>
      </div>
    </form>
  );
}
