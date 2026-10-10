import { useEffect, useState } from "react";
import RoleBadge from "../components/RoleBadge";
import PageHero from "../components/PageHero";
import { listPublicProperties } from "../lib/api";
import { whatsappLink, callLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";

const ACCENT = "#EA580C";

export default function Buyer() {
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listPublicProperties()
      .then(setProperties)
      .catch((err) => setError(err.message || "Could not load listings"));
  }, []);

  return (
    <>
      <PageHero label="Buyer" eyebrow="Browse listings" title="Available properties" subtitle="Verified properties we are currently mediating." accent={ACCENT} />
      <div className="max-w-5xl mx-auto px-5 pb-20 -mt-10 relative z-10">

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

      {properties?.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5">
          {properties.map((p) => (
            <article key={p.id} className="card group overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-glow transition-all duration-500 fade-up">
              <div className="aspect-[4/3] bg-navy/5 overflow-hidden">
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
                <p className="text-sm text-navy/50">{p.location}</p>
                <p className="font-semibold text-navy">{p.price}</p>
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
