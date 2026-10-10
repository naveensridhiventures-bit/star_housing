import CountUp from "./CountUp";
import { inrShort } from "../../lib/gallery";

/** Real numbers about what's on offer right now, as one quiet line. */
export default function StatsStrip({ properties }) {
  const live = properties.filter((p) => !p.sold);
  if (live.length === 0) return null;
  const areas = new Set(live.map((p) => p.area).filter(Boolean)).size;
  const prices = live.map((p) => p.priceNum).filter((n) => n);
  const range = prices.length >= 2 ? `${inrShort(Math.min(...prices))} – ${inrShort(Math.max(...prices))}` : prices.length === 1 ? inrShort(prices[0]) : "";
  return (
    <p className="text-[14px] text-ink/65 flex flex-wrap gap-x-5 gap-y-1">
      <span><b className="text-ink font-semibold tabular-nums"><CountUp value={live.length} /></b> {live.length === 1 ? "property" : "properties"}</span>
      {areas > 0 && <span><b className="text-ink font-semibold tabular-nums"><CountUp value={areas} /></b> {areas === 1 ? "area" : "areas"}</span>}
      {range && <span>Priced {range}</span>}
    </p>
  );
}
