import { useEffect, useMemo, useState } from "react";
import RoleBadge from "../components/RoleBadge";
import PageHero from "../components/PageHero";
import { listPublicProperties } from "../lib/api";
import { whatsappLink, callLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";

const ACCENT = "#EA580C";

export default function Buyer() {
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    listPublicProperties()
      .then(setProperties)
      .catch((err) => setError(err.message || "Could not load listings"));
  }, []);

  const types = useMemo(
    () => ["All", ...Array.from(new Set((properties || []).map((p) => p.type).filter(Boolean)))],
    [properties]
  );
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (properties || []).filter(
      (p) =>
        (typeFilter === "All" || p.type === typeFilter) &&
        (!q || `${p.title} ${p.location} ${p.description || ""}`.toLowerCase().includes(q))
    );
  }, [properties, query, typeFilter]);

  return (
    <>
      <PageHero label="Buyer" eyebrow="Browse listings" title="Available properties" subtitle="Verified properties we are currently mediating." accent={ACCENT} />
      <div className="max-w-5xl mx-auto px-5 pb-20 -mt-10 relative z-10">

      {properties?.length > 0 && (
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            className="field-input sm:max-w-xs !py-2.5"
            placeholder="Search title or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition ${
                  typeFilter === t ? "bg-navy text-white shadow-glow" : "bg-snow text-navy/60 hover:text-navy hover:bg-sky-soft"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="sm:ml-auto text-xs font-semibold text-navy/50">{visible.length} found</span>
        </div>
      )}

      {error && (
        <div className="card p-6 text-center text-danger text-sm">{error}</div>
      )}

      {!error && properties === null && (
        <div className="grid sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="card h-64 animate-pulse bg-navy/5" />
          ))}
        </div>
      )}

      {properties?.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-navy/60">
            Nothing listed yet — check back soon, admin adds verified properties here.
          </p>
        </div>
      )}

      {properties?.length > 0 && visible.length === 0 && (
        <div className="card p-10 text-center text-navy/60">No properties match your search.</div>
      )}

      {visible.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5">
          {visible.map((p, i) => (
            <article key={p.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }} className="card group overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-glow transition-all duration-500 fade-up">
              <div className="relative aspect-[4/3] bg-navy/5 overflow-hidden">
                <span className="absolute left-3 bottom-3 z-10 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-light to-gold text-navy-dark text-sm font-extrabold shadow-gold">{p.price}</span>
                <span className="absolute right-3 top-3 z-10 px-2.5 py-1 rounded-full bg-navy/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider">★ Verified</span>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-navy/30 text-4xl bg-gradient-to-br from-sky-soft to-snow-dim">
                    🏠
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display font-semibold text-lg text-navy leading-snug">
                    {p.title}
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full bg-buyer/10 text-buyer shrink-0">
                    {p.type || "Property"}
                  </span>
                </div>
                <p className="text-sm text-navy/60 font-medium">📍 {p.location}</p>
                {p.description && (
                  <p className="text-sm text-navy/60 leading-relaxed line-clamp-3">{p.description}</p>
                )}
                <div className="mt-auto pt-3 flex gap-2">
                  <a
                    href={whatsappLink(
                      p.contactPhone || ADMIN_WHATSAPP_NUMBER,
                      `Hi, I'm interested in ${p.title} (${p.location})`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp flex-1 !py-2.5 text-sm"
                  >
                    WhatsApp
                  </a>
                  <a href={callLink(p.contactPhone || ADMIN_WHATSAPP_NUMBER)} className="btn-ghost !py-2.5 !px-4 text-sm">
                    Call
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
