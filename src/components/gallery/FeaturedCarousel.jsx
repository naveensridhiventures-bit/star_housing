import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

/**
 * "Spotlight": one listing shown large, with the other picks listed beside it
 * as a selector. Pick one to swap the photo; nothing moves on its own.
 *
 * items: [{ id, title, location, price, image }]
 */
export default function FeaturedCarousel({ items }) {
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const cur = items[Math.min(i, items.length - 1)];
  return (
    <section aria-label="Spotlight" className="grid lg:grid-cols-[1.55fr_1fr] gap-0 rounded-2xl overflow-hidden border border-line bg-white">
      <Link to={`/gallery/${cur.id}`} className="group relative block aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] bg-ink-dark overflow-hidden">
        <img key={cur.id} src={cur.image} alt="" className="spot-img absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/75 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute left-5 right-5 bottom-5 text-white">
          <p className="font-display text-[1.7rem] sm:text-[2.1rem] leading-tight">{cur.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[14.5px] text-white/85"><MapPin size={15} />{cur.location}</p>
        </div>
      </Link>
      <div className="p-5 sm:p-6 flex flex-col">
        <p className="text-[13.5px] font-semibold text-brand">Spotlight</p>
        <p className="font-display text-[2rem] leading-none text-ink mt-1.5">{cur.price || "Price on request"}</p>
        <ul className="mt-5 divide-y divide-line border-y border-line" aria-label="More picks">
          {items.map((it, n) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-pressed={n === i}
                className={`w-full flex items-center gap-3 py-2.5 text-left transition-colors ${n === i ? "bg-brand-soft/60 -mx-2 px-2 rounded-md" : "hover:bg-canvas -mx-2 px-2 rounded-md"}`}
              >
                <img src={it.image} alt="" loading="lazy" className="w-14 h-12 rounded-md object-cover shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold text-ink truncate">{it.title}</span>
                  <span className="block text-[12.5px] text-ink/55 truncate">{it.price || it.location}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Link to={`/gallery/${cur.id}`} className="btn-primary mt-auto !h-12 w-full">View this property <ArrowRight size={17} /></Link>
      </div>
    </section>
  );
}
