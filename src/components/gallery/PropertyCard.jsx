import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Images, ArrowUpRight } from "lucide-react";
import Burst from "./Burst";
import SoldOutStamp from "../SoldOutStamp";
import { optimizedImageUrl } from "../../lib/cloudinary";
import { emiFrom, inrShort, isNew, listedAgo, specsFor } from "../../lib/gallery";

/**
 * One listing. `layout="grid"` stacks the photo over the details; `"list"`
 * puts them side by side. On a computer, hovering cycles through the photos
 * with a progress bar; on a phone it stays still. The heart saves the
 * listing on this device.
 */
export default function PropertyCard({ l, saved, onToggleSaved, layout = "grid", index = 0 }) {
  const [hover, setHover] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [armed, setArmed] = useState(false);
  const [burst, setBurst] = useState(0);
  const imgs = l.images.map((u) => optimizedImageUrl(u, 700));
  const count = imgs.length;
  const shown = armed ? imgs : imgs.slice(0, 1);
  const emi = emiFrom(l);
  const specs = specsFor(l);
  const ago = listedAgo(l);
  const list = layout === "list";

  useEffect(() => {
    if (!hover || count < 2) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = setInterval(() => setPhoto((n) => (n + 1) % count), 1200);
    return () => clearInterval(t);
  }, [hover, count]);

  function onHeart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!saved) setBurst((n) => n + 1);
    onToggleSaved(l.id);
  }

  return (
    <article
      className={`group card rise overflow-hidden hover:shadow-lift hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300 ${list ? "sm:flex" : "flex flex-col"}`}
      style={{ "--i": index }}
    >
      <div className={`relative shrink-0 ${list ? "sm:w-72 lg:w-80" : ""}`}>
        <Link
          to={`/gallery/${l.id}`}
          className={`block relative overflow-hidden bg-ink/5 ${list ? "aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[13rem]" : "aspect-[4/3]"}`}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            setArmed(true);
            setHover(true);
          }}
          onPointerLeave={() => {
            setHover(false);
            setPhoto(0);
          }}
          aria-label={`${l.title}${l.location ? `, ${l.location}` : ""}${l.price && !l.sold ? `, ${l.price}` : ""}`}
          tabIndex={-1}
        >
          {count === 0 ? (
            <div className="absolute inset-0 bg-gradient-to-br from-ink-light to-ink-dark" />
          ) : (
            shown.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-700 group-hover:scale-105 ${i === photo ? "opacity-100" : "opacity-0"} ${l.sold ? "grayscale" : ""}`}
              />
            ))
          )}
          {isNew(l) && <span className="absolute top-3 left-3 rounded-md bg-brand text-white text-[12px] font-semibold px-2.5 py-1">Just listed</span>}
          {l.sold && <SoldOutStamp size="sm" />}
          {count > 1 && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-ink-dark/70 text-white text-[12px] font-semibold px-2 py-1">
              <Images size={13} /> {count}
            </span>
          )}
          {hover && count > 1 && (
            <span className="absolute inset-x-3 bottom-0 flex gap-1 pb-1.5" aria-hidden="true">
              {imgs.map((_, i) => <span key={i} className={`h-[3px] flex-1 rounded-full ${i === photo ? "bg-white" : "bg-white/40"}`} />)}
            </span>
          )}
        </Link>
        {!l.sold && (
          <button
            type="button"
            onClick={onHeart}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${l.title} from saved` : `Save ${l.title}`}
            className={`absolute top-3 right-3 z-10 w-10 h-10 !rounded-full flex items-center justify-center shadow-soft transition-colors active:scale-90 ${saved ? "bg-white text-danger" : "bg-white/90 text-ink hover:bg-white"}`}
          >
            <Heart size={19} fill={saved ? "currentColor" : "none"} strokeWidth={2} />
            <Burst fire={burst} count={10} spread={38} />
          </button>
        )}
      </div>

      <Link to={`/gallery/${l.id}`} className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <p className={`font-display text-[1.55rem] leading-none font-semibold tabular-nums ${l.sold ? "text-ink/40 line-through" : "text-ink"}`}>{l.price || "Price on request"}</p>
          {emi > 0 && <span className="text-[12.5px] text-ink/55 shrink-0">EMI {inrShort(emi)}/mo</span>}
        </div>
        <h3 className="mt-2.5 text-[16px] font-semibold leading-snug text-ink line-clamp-1">{l.title}</h3>
        {l.location && (
          <p className="mt-1 flex items-center gap-1.5 text-[14px] text-ink/60">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{l.location}</span>
          </p>
        )}
        {(specs.length > 0 || l.pricePerSqft) && (
          <ul className="mt-3.5 pt-3.5 border-t border-line flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink/70">
            {specs.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5"><Icon size={15} className="text-ink/45" />{text}</li>
            ))}
            {l.pricePerSqft && <li>{inrShort(l.pricePerSqft)}/sq.ft</li>}
          </ul>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between text-[13px]">
          <span className="text-ink/50">{ago}</span>
          {!l.sold && <span className="flex items-center gap-1 font-semibold text-brand group-hover:gap-2 transition-all">View details <ArrowUpRight size={16} /></span>}
        </div>
      </Link>
    </article>
  );
}
