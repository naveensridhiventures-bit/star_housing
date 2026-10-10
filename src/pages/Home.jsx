import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, User, Search, MessageCircle, ArrowRight, Lock, UserCheck, ClipboardCheck, Check, TrendingUp, House, Building2, MapPinned, Store } from "lucide-react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import SearchDock from "../components/home/SearchDock";
import PropertyCard from "../components/gallery/PropertyCard";
import CountUp from "../components/gallery/CountUp";
import useProperties from "../lib/useProperties";
import useFavorites from "../lib/useFavorites";
import { typeKind, inrShort } from "../lib/gallery";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";

const WA_HI = "Hi Star Housing, I'd like to know more about your properties.";

const ROLES = [
  { to: "/buyer", title: "Buyers", Icon: Search, color: "#E8590C", cta: "Tell us what you need", points: ["Share your budget, area and type", "We shortlist matching properties", "Visit only what fits"] },
  { to: "/seller", title: "Sellers", Icon: User, color: "#0F8A5F", cta: "List your property", points: ["Add details and photos in minutes", "Phone number and address stay private", "Meet buyers who are actually looking"] },
  { to: "/mediator", title: "Mediators", Icon: Handshake, color: "#5B3FE0", cta: "Join the network", points: ["Bring your buyers and sellers", "Work from one shared pipeline", "Close more deals with our team"] },
];

const WHY = [
  { Icon: ClipboardCheck, title: "Every request is read by a person", text: "Nothing is automated away. Our team reviews each listing and each requirement before anything happens." },
  { Icon: Lock, title: "Your details stay private", text: "Listings never show a seller's phone number or exact address." },
  { Icon: UserCheck, title: "A real person on WhatsApp", text: "Ask questions, share requirements and move ahead without a call centre." },
];

const STEPS = [
  { title: "Tell us what you need", text: "Fill in a short form. It takes about a minute." },
  { title: "We review and match", text: "Our team checks each request and contacts you with matching properties." },
  { title: "Talk on WhatsApp", text: "Ask questions and move ahead with a real person on the other end." },
];

const KINDS = [
  { key: "house", label: "Houses & villas", Icon: House },
  { key: "apartment", label: "Apartments", Icon: Building2 },
  { key: "plot", label: "Plots & land", Icon: MapPinned },
  { key: "commercial", label: "Commercial", Icon: Store },
];

export default function Home() {
  const { properties, error } = useProperties();
  const { has, toggle } = useFavorites();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowChat(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const live = useMemo(() => (properties || []).filter((p) => !p.sold && p.images.length > 0), [properties]);
  const featured = live.slice(0, 6);
  const areas = useMemo(() => new Set(live.map((p) => p.area).filter(Boolean)), [live]);
  const prices = live.map((p) => p.priceNum).filter(Boolean);
  const counts = useMemo(() => {
    const c = {};
    live.forEach((p) => { const k = typeKind(p.type); c[k] = (c[k] || 0) + 1; });
    return c;
  }, [live]);
  const newest = live[0];

  return (
    <div className="bg-canvas">
      <SiteNav />

      {/* ---------- Hero ---------- */}
      <header className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-14 grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand bg-brand-soft rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" aria-hidden="true" /> Real people. Real properties.
            </p>
            <h1 className="mt-5 font-display text-[3rem] sm:text-[4.2rem] lg:text-[4.9rem] leading-[0.98] tracking-tight text-ink">
              Your dream.<br />Our priority.
            </h1>
            <p className="mt-5 text-[17.5px] leading-relaxed text-ink/70 max-w-lg">
              Buy, sell or list a property through a team that reads every request and replies on WhatsApp.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchDock properties={properties} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14.5px] text-ink/70">
              {["Private seller details", "Reviewed by a person", "Free to enquire"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><Check size={16} className="text-teal" strokeWidth={2.6} /> {t}</span>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="curtain rounded-2xl ring-1 ring-line bg-sky/30" style={{ aspectRatio: "790 / 720" }}>
              <img
                src="/brand/globe.jpg"
                alt="A Star Housing mediator holding the world in his hands, with apartments, a villa and a map pin on it"
                className="w-full h-full block"
                width="790"
                height="720"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            {live.length > 0 && (
              <>
                <div className="rise absolute -left-2 sm:-left-5 bottom-6 sm:bottom-10 bg-white rounded-xl shadow-lift border border-line px-4 py-3" style={{ "--base": "1100ms" }}>
                  <p className="font-display text-[1.9rem] leading-none text-ink tabular-nums"><CountUp value={live.length} duration={1100} /></p>
                  <p className="text-[12.5px] text-ink/60 mt-1">{live.length === 1 ? "property listed" : "properties listed"}</p>
                </div>
                {newest && (
                  <Link to={`/gallery/${newest.id}`} className="rise hidden sm:flex absolute -right-3 top-8 bg-white rounded-xl shadow-lift border border-line p-2 pr-4 items-center gap-3 max-w-[16rem] hover:border-brand transition-colors" style={{ "--base": "1300ms" }}>
                    <img src={newest.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
                    <span className="min-w-0">
                      <span className="block text-[12px] text-brand font-semibold">Just listed</span>
                      <span className="block text-[14px] font-semibold text-ink truncate">{newest.title}</span>
                      <span className="block text-[12.5px] text-ink/60 truncate">{newest.price || newest.area}</span>
                    </span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Market strip ---------- */}
      {live.length > 0 && (
        <section className="bg-ink-dark text-white" aria-label="Market snapshot">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
            <div><p className="font-display text-[1.7rem] leading-none tabular-nums"><CountUp value={live.length} /></p><p className="text-[13px] text-white/60 mt-1">Properties available</p></div>
            <div><p className="font-display text-[1.7rem] leading-none tabular-nums"><CountUp value={areas.size} /></p><p className="text-[13px] text-white/60 mt-1">Areas covered</p></div>
            <div><p className="font-display text-[1.7rem] leading-none">{prices.length > 1 ? `${inrShort(Math.min(...prices))} – ${inrShort(Math.max(...prices))}` : prices.length === 1 ? inrShort(prices[0]) : "On request"}</p><p className="text-[13px] text-white/60 mt-1">Price range</p></div>
            <div><p className="font-display text-[1.7rem] leading-none flex items-center gap-2"><TrendingUp size={22} className="text-brand-light" /> Updated daily</p><p className="text-[13px] text-white/60 mt-1">Fresh listings from sellers</p></div>
          </div>
        </section>
      )}

      <main>
        {/* ---------- Featured ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20" aria-labelledby="feat-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="feat-title" className="font-display text-[2.1rem] sm:text-[2.7rem] leading-tight text-ink">New on the market</h2>
              <p className="mt-1.5 text-[16px] text-ink/65">Fresh listings from our sellers.</p>
            </div>
            <Link to="/gallery" className="btn-ghost !py-2.5 !px-4 text-[14.5px] shrink-0">View all <ArrowRight size={16} /></Link>
          </div>
          {properties === null && !error ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => <div key={i} className="h-[26rem] rounded-2xl skeleton" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((l, i) => <PropertyCard key={l.id} l={l} index={i} saved={has(l.id)} onToggleSaved={() => toggle(l.id)} />)}
            </div>
          ) : (
            <div className="mt-8 card p-8 text-center">
              <p className="font-display text-[1.5rem] text-ink">Listings will appear here</p>
              <p className="mt-1.5 text-ink/65">Be the first to list a property with us.</p>
              <Link to="/seller" className="btn-primary mt-5">List your property</Link>
            </div>
          )}
        </section>

        {/* ---------- Browse by type ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24" aria-labelledby="type-title">
          <h2 id="type-title" className="font-display text-[2.1rem] sm:text-[2.7rem] leading-tight text-ink">Browse by property type</h2>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KINDS.map(({ key, label, Icon }) => (
              <Link key={key} to="/gallery" className="group card p-5 sm:p-6 flex flex-col gap-10 hover:border-brand hover:-translate-y-0.5 transition-all">
                <span className="w-12 h-12 rounded-lg bg-brand-soft text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors"><Icon size={24} strokeWidth={1.8} /></span>
                <span>
                  <span className="block font-display text-[1.3rem] leading-tight text-ink">{label}</span>
                  <span className="block text-[14px] text-ink/60 mt-1">{counts[key] ? `${counts[key]} available` : "Browse listings"}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- Roles ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24" aria-labelledby="role-title">
          <h2 id="role-title" className="font-display text-[2.1rem] sm:text-[2.7rem] leading-tight text-ink max-w-xl">How can we help you today?</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {ROLES.map(({ to, title, Icon, color, cta, points }) => (
              <article key={to} className="bg-white rounded-2xl border border-line overflow-hidden flex flex-col" style={{ borderTop: `4px solid ${color}` }}>
                <div className="p-6 flex-1">
                  <span className="w-11 h-11 rounded-lg flex items-center justify-center text-white" style={{ background: color }}><Icon size={22} /></span>
                  <h3 className="mt-5 font-display text-[1.7rem] leading-tight text-ink">For {title.toLowerCase()}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[15.5px] text-ink/75 leading-snug"><Check size={18} className="shrink-0 mt-0.5" style={{ color }} strokeWidth={2.6} />{p}</li>
                    ))}
                  </ul>
                </div>
                <Link to={to} className="m-6 mt-0 h-12 rounded-lg border-2 font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors hover:text-white" style={{ borderColor: color, color }} onMouseEnter={(e) => { e.currentTarget.style.background = color; }} onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}>
                  {cta} <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Why us ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24" aria-labelledby="why-title">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
            <div>
              <h2 id="why-title" className="font-display text-[2.1rem] sm:text-[2.7rem] leading-tight text-ink">Why people use us</h2>
              <p className="mt-3 text-[16.5px] text-ink/65 max-w-sm">A smaller, more careful way to deal in property.</p>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {WHY.map(({ Icon, title, text }) => (
                <li key={title} className="py-6 flex gap-5">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-brand-soft text-brand flex items-center justify-center"><Icon size={21} /></span>
                  <div>
                    <h3 className="font-display text-[1.3rem] leading-tight text-ink">{title}</h3>
                    <p className="mt-1.5 text-[15.5px] text-ink/70 leading-relaxed max-w-lg">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24" aria-labelledby="how-title">
          <h2 id="how-title" className="font-display text-[2.1rem] sm:text-[2.7rem] leading-tight text-ink">How it works</h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-line bg-white">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`p-6 sm:p-8 ${i > 0 ? "border-t md:border-t-0 md:border-l border-line" : ""}`}>
                <span className="font-display text-[3.2rem] leading-none text-brand/25">{i + 1}</span>
                <h3 className="mt-3 font-display text-[1.35rem] leading-tight text-ink">{s.title}</h3>
                <p className="mt-2 text-[15.5px] text-ink/70 leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Brand banner, shown whole ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24">
          <div className="rounded-2xl overflow-hidden ring-1 ring-line bg-ink-dark">
            <img src="/brand/cover.jpg" alt="Star Housing: your dream, our priority" className="w-full h-auto block" width="1800" height="720" loading="lazy" decoding="async" />
          </div>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="rounded-2xl bg-brand text-white px-6 sm:px-12 py-10 sm:py-14 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <h2 className="font-display text-[2.2rem] sm:text-[3rem] leading-[1.02]">Ready when you are.</h2>
              <p className="mt-3 text-white/80 text-[16.5px] max-w-md">Fill in a short form. We read every request and reply on WhatsApp.</p>
            </div>
            <div className="flex flex-wrap md:justify-end gap-3">
              <Link to="/buyer" className="h-12 px-6 rounded-lg bg-white text-brand-dark font-semibold flex items-center gap-2 hover:bg-snow transition-colors">Tell us what you need <ArrowRight size={17} /></Link>
              <Link to="/seller" className="h-12 px-6 rounded-lg border-2 border-white/60 text-white font-semibold flex items-center hover:bg-white/10 transition-colors">List my property</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <a
        href={whatsappLink(ADMIN_WHATSAPP_NUMBER, WA_HI)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        tabIndex={showChat ? 0 : -1}
        className={`fixed right-4 z-30 w-14 h-14 rounded-full bg-whatsapp text-white shadow-lift flex items-center justify-center transition-all duration-300 ${showChat ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
