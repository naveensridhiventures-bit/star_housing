import { MapPin, ChevronDown } from "lucide-react";
import RangeSlider from "./RangeSlider";
import { iconForType } from "./typeIcons";
import { shortType, PRICE_STEPS, SQFT_STEPS, FACINGS, DEFAULT_FILTERS, BUDGET_BANDS } from "../../lib/gallery";

function Group({ title, children }) {
  return (
    <section className="py-5 border-t border-line first:border-t-0 first:pt-0">
      <h3 className="font-display text-[1.1rem] text-ink mb-3">{title}</h3>
      {children}
    </section>
  );
}

/**
 * The filter controls, shared by the gallery sidebar and the phone sheet.
 * `types` is [{ type, n }]. Filters apply live.
 */
export default function FilterPanel({ idp = "f", filters, onChange, types, areas }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const sqLast = SQFT_STEPS.length - 1;
  const sqText = (i) => `${SQFT_STEPS[i].toLocaleString("en-IN")}${i === sqLast ? "+" : ""} sq.ft`;

  return (
    <div>
      <Group title="Property type">
        <ul className="space-y-1" aria-label="Property type">
          {types.map(({ type, n }) => {
            const on = filters.type === type;
            const Icon = iconForType(type);
            return (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => set({ type: on ? "All" : type })}
                  aria-pressed={on}
                  className={`w-full h-11 px-3 rounded-lg flex items-center gap-3 text-[14.5px] text-left transition-colors ${on ? "bg-brand-soft text-brand-dark font-semibold" : "text-ink/80 hover:bg-canvas"}`}
                >
                  <Icon size={19} strokeWidth={1.7} className="shrink-0" />
                  <span className="flex-1 truncate">{shortType(type)}</span>
                  <span className={`text-[12.5px] tabular-nums ${on ? "text-brand" : "text-ink/45"}`}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Budget">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Budget">
          {BUDGET_BANDS.map((b) => {
            const on = filters.budget === b.key;
            return (
              <button
                key={b.key}
                type="button"
                aria-pressed={on}
                onClick={() => set({ budget: b.key })}
                className={`h-9 px-3 rounded-md text-[13px] font-semibold border transition-colors ${on ? "bg-brand border-brand text-white" : "bg-white border-line text-ink/75 hover:border-ink/40"}`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </Group>

      {areas.length > 0 && (
        <Group title="Location">
          <div className="relative">
            <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none" />
            <select
              id={`${idp}-area`}
              aria-label="Location"
              value={filters.area}
              onChange={(e) => set({ area: e.target.value })}
              className="w-full h-11 appearance-none rounded-lg border border-line bg-white pl-9 pr-9 text-[14.5px] text-ink outline-none focus:border-brand"
            >
              <option value="All">All areas</option>
              {areas.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none" />
          </div>
        </Group>
      )}

      <Group title="Price range">
        <RangeSlider
          steps={PRICE_STEPS.length}
          lo={filters.priceLo}
          hi={filters.priceHi}
          onChange={(lo, hi) => set({ priceLo: lo, priceHi: hi })}
          label="Price range"
          valueText={(i) => PRICE_STEPS[i].label}
        />
        <div className="flex items-center justify-between text-[13px] text-ink/65">
          <span>{PRICE_STEPS[filters.priceLo].label}</span>
          <span>{PRICE_STEPS[filters.priceHi].label}</span>
        </div>
      </Group>

      <Group title="Size">
        <RangeSlider
          steps={SQFT_STEPS.length}
          lo={filters.sqftLo}
          hi={filters.sqftHi}
          onChange={(lo, hi) => set({ sqftLo: lo, sqftHi: hi })}
          label="Area in square feet"
          valueText={sqText}
        />
        <p className="text-[13px] text-ink/65">{SQFT_STEPS[filters.sqftLo].toLocaleString("en-IN")} – {sqText(filters.sqftHi)}</p>
      </Group>

      <Group title="Facing">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Facing">
          {FACINGS.map((f) => {
            const on = filters.facing === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => set({ facing: f })}
                aria-pressed={on}
                className={`h-9 min-w-[3.2rem] px-3 rounded-md text-[13px] font-semibold border transition-colors ${on ? "bg-ink border-ink text-white" : "bg-white border-line text-ink/75 hover:border-ink/40"}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </Group>

      <button type="button" onClick={() => onChange({ ...DEFAULT_FILTERS })} className="mt-1 text-[14px] font-semibold text-brand hover:underline">
        Reset all filters
      </button>
    </div>
  );
}
