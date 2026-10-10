import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { optimizedImageUrl } from "../../lib/cloudinary";
import { emiFrom, inrShort, isNew } from "../../lib/gallery";

/** A compact horizontal row card: photo on the left, details on the right. */
export function RailCard({ l }) {
  const emi = emiFrom(l);
  return (
    <Link
      to={`/gallery/${l.id}`}
      className="group shrink-0 w-[19.5rem] snap-start flex rounded-xl bg-white border border-line hover:border-brand overflow-hidden transition-colors"
    >
      <span className="relative w-28 shrink-0 bg-ink-dark overflow-hidden">
        {l.images[0] && <img src={optimizedImageUrl(l.images[0], 320)} alt="" loading="lazy" decoding="async" draggable={false} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
        {isNew(l) && <span className="absolute top-1.5 left-1.5 rounded bg-brand text-white text-[10.5px] font-semibold px-1.5 py-0.5">New</span>}
      </span>
      <span className="min-w-0 flex-1 p-3">
        <span className="block font-display text-[1.05rem] leading-tight text-ink line-clamp-1">{l.title}</span>
        <span className="mt-1 flex items-center gap-1 text-[12.5px] text-ink/55"><MapPin size={12} className="shrink-0" /><span className="truncate">{l.area || l.location}</span></span>
        <span className="mt-2.5 block font-semibold text-[14.5px] text-ink">{l.price || "Price on request"}</span>
        {emi > 0 && <span className="block text-[12px] text-ink/50">EMI {inrShort(emi)}/mo</span>}
      </span>
    </Link>
  );
}

/** A themed, horizontally-scrolling shelf of listings. */
export default function CollectionRail({ title, subtitle, items }) {
  if (!items.length) return null;
  return (
    <section className="mt-10" aria-label={title}>
      <div className="mb-3.5 flex items-baseline gap-3 flex-wrap">
        <h2 className="font-display text-[1.5rem] sm:text-[1.75rem] leading-tight text-ink">{title}</h2>
        {subtitle && <p className="text-[14px] text-ink/55">{subtitle}</p>}
      </div>
      <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 pb-1">
        {items.map((l) => <RailCard key={l.id} l={l} />)}
      </div>
    </section>
  );
}
