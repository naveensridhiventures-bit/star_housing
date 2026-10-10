import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, User, Search, Image as ImageIcon, MessageCircle, ArrowRight, Lock, UserCheck, ClipboardCheck } from "lucide-react";
import Reveal from "../components/Reveal";
import RotatingWords from "../components/home/RotatingWords";
import SearchDock from "../components/home/SearchDock";
import FreshRail from "../components/home/FreshRail";
import LiveStats from "../components/home/LiveStats";
import TileStrip from "../components/TileStrip";
import TileReveal from "../components/TileReveal";
import Logo from "../components/Logo";
import useProperties from "../lib/useProperties";
import { tileUri } from "../lib/tiles";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER, APP_NAME, COMPANY_NAME } from "../lib/config";
import { HERO_IMAGE } from "../lib/brand";

const ROLE_WORDS = ["buy a home.", "sell a flat.", "find a plot.", "list a shop.", "close a deal."];
const WA_HI = "Hi Star Housing, I'd like to know more about your properties.";

const ROLES = [
  { to: "/seller", title: "I'm a seller", desc: "List your property and meet genuine buyers.", Icon: User, bg: "#0B6B66", motif: "diamonds" },
  { to: "/buyer", title: "I'm a buyer", desc: "Tell us what you need. We find the matches.", Icon: Search, bg: "#C81F5B", motif: "flower" },
  { to: "/mediator", title: "I'm a mediator", desc: "Join the network and close better deals.", Icon: Handshake, bg: "#4338CA", motif: "corners" },
];

const WHY = [
  { Icon: ClipboardCheck, title: "A person reads every request", text: "Nothing is automated away. Our team looks at each listing and each requirement before anything happens.", tint: "#0E8C84" },
  { Icon: Lock, title: "Your details stay private", text: "Listings never show a seller's phone number or exact address.", tint: "#4F46E5" },
  { Icon: UserCheck, title: "A real person on WhatsApp", text: "Ask questions, share requirements and move ahead without a call centre.", tint: "#E8336D" },
];

const STEPS = [
  { title: "Tell us what you need", text: "Fill in a short form. It takes about a minute." },
  { title: "We review and match", text: "Our team checks every request and contacts you with matching properties." },
  { title: "Talk to us on WhatsApp", text: "Ask questions and move ahead with a real person on the other end." },
];

function RoleCard({ role }) {
  const { to, title, desc, Icon, bg, motif } = role;
  const pattern = tileUri(motif, { bg: "transparent", a: "rgba(255,255,255,0.17)", b: "rgba(255,255,255,0.08)" });
  return (
    <Link
      to={to}
      className="role-card group relative isolate overflow-hidden flex items-center gap-4 rounded-2xl p-4 sm:p-5 md:flex-col md:items-start md:justify-between md:min-h-[15rem] md:p-6 text-white active:translate-y-0.5 transition-transform"
      style={{ background: bg, boxShadow: "0 5px 0 0 rgba(3,30,35,0.85)" }}
    >
      <span className="absolute -z-10 -right-1/4 -top-1/4 w-[85%] h-[150%] md:w-[110%] md:h-[75%] md:-right-[15%] md:-top-[12%] overflow-hidden" aria-hidden="true">
        <span className="tile-turn block w-[140%] h-[140%]" style={{ backgroundImage: pattern, backgroundSize: "64px 64px" }} />
      </span>
      <span className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-white text-ink flex items-center justify-center">
        <Icon size={26} strokeWidth={2.2} />
      </span>
      <span className="flex-1 min-w-0 md:flex-none">
        <span className="block font-display font-extrabold text-[1.6rem] sm:text-[1.9rem] leading-none">{title}</span>
        <span className="block text-[14.5px] leading-snug text-white/85 mt-1.5 md:max-w-[15rem]">{desc}</span>
      </span>
      <span className="shrink-0 w-10 h-10 rounded-lg bg-white/15 group-hover:bg-white group-hover:text-ink flex items-center justify-center transition-colors md:absolute md:right-5 md:bottom-5" aria-hidden="true">
        <ArrowRight size={20} strokeWidth={2.6} />
      </span>
    </Link>
  );
}

function Nav() {
  return (
    <nav className="absolute z-30 inset-x-0 top-0 flex items-start justify-between gap-3 px-3 sm:px-6" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }} aria-label="Main">
      <Link to="/" className="flex items-center gap-2.5 rounded-xl bg-white/90 backdrop-blur px-3 py-2 shadow-soft" aria-label={`${APP_NAME} home`}>
        <Logo size={34} />
        <span className="font-display font-extrabold text-[15px] leading-none text-ink hidden sm:block">{APP_NAME}</span>
      </Link>
      <div className="flex items-center gap-1 rounded-xl bg-white/90 backdrop-blur p-1 shadow-soft text-[14px] font-bold text-ink">
        <Link to="/gallery" className="px-3 py-2 rounded-lg hover:bg-ink hover:text-white transition-colors">Gallery</Link>
        <Link to="/buyer" className="px-3 py-2 rounded-lg hover:bg-ink hover:text-white transition-colors hidden sm:block">Buy</Link>
        <Link to="/seller" className="px-3 py-2 rounded-lg hover:bg-ink hover:text-white transition-colors hidden sm:block">Sell</Link>
        <Link to="/mediator" className="px-3 py-2 rounded-lg bg-gold text-ink-dark hover:brightness-105 transition">Join us</Link>
      </div>
    </nav>
  );
}

export default function Home() {
  const { properties, error } = useProperties();
  const hasListings = !!properties && properties.some((p) => !p.sold && p.images.length > 0);
  const [showChat, setShowChat] = useState(false);
  const [reveal, setReveal] = useState(() => {
    try {
      return !sessionStorage.getItem("star_tiles_seen") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  const [wide, setWide] = useState(() => (typeof window === "undefined" ? true : window.innerWidth >= 768));

  const doneReveal = useCallback(() => {
    try { sessionStorage.setItem("star_tiles_seen", "1"); } catch { /* storage may be unavailable */ }
    setReveal(false);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShowChat(window.scrollY > 520));
    };
    const onResize = () => setWide(window.innerWidth >= 768);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      {/* ---------- The photo, shown whole ---------- */}
      <header className="relative bg-ink-dark">
        <div className="relative aspect-[79/72] md:aspect-[5/2] overflow-hidden">
          <picture>
            <source media="(min-width: 768px)" srcSet="/brand/cover.jpg" />
            <img
              src="/brand/globe.jpg"
              alt="A Star Housing mediator holding the world in his hands, with apartments, a villa and a map pin on it"
              className="absolute inset-0 w-full h-full"
              width="790"
              height="720"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <Nav />
          {reveal && <TileReveal cols={wide ? 12 : 6} rows={wide ? 5 : 6} onDone={doneReveal} />}
        </div>
        <TileStrip kind="corners" palette="ink" size={28} />
      </header>

      {/* ---------- Headline band ---------- */}
      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-32 sm:pb-36 grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 items-end">
          <h1 className="font-display font-extrabold text-[3.1rem] sm:text-[4.6rem] md:text-[5.2rem] lg:text-[6.3rem] leading-[0.88] tracking-tight">
            Your dream.
            <br />
            Our priority.
          </h1>
          <div>
            <p className="text-white/70 text-[17px]">The trusted way to</p>
            <p className="font-display font-bold text-[2rem] sm:text-[2.4rem] leading-tight text-gold-light mt-0.5">
              <RotatingWords words={ROLE_WORDS} />
            </p>
            <p className="mt-3 text-white/80 text-[16px] leading-relaxed max-w-sm">
              Tell us what you need. We read every request and reply on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/gallery" className="btn-gold">Browse properties <ArrowRight size={18} /></Link>
              <a href={whatsappLink(ADMIN_WHATSAPP_NUMBER, WA_HI)} target="_blank" rel="noreferrer" className="btn-outline-light">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Everything else sits on the mint wall ---------- */}
      <section className="relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="relative z-20 -mt-[5.5rem] sm:-mt-24">
            <SearchDock properties={properties} />
          </div>
          <FreshRail properties={properties} />
          <LiveStats properties={properties} />

          <Reveal direction="up" distance={14} className="mt-16">
            <h2 className="font-display font-extrabold text-[2.2rem] sm:text-5xl leading-none text-ink">How can we help you today?</h2>
            <p className="text-[16px] text-ink/65 mt-3 max-w-md">Pick the option that fits you. It only takes a minute.</p>
          </Reveal>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {ROLES.map((role, i) => (
              <Reveal key={role.to} delay={i * 90} distance={22} className="h-full">
                <RoleCard role={role} />
              </Reveal>
            ))}
          </div>

          {(error || (properties && !hasListings)) && (
            <Link
              to="/gallery"
              className="group relative isolate overflow-hidden mt-4 flex items-center gap-4 rounded-2xl bg-ink-dark p-4 sm:p-5 text-white"
              style={{ boxShadow: "0 5px 0 0 rgba(3,30,35,0.85)" }}
            >
              <img src={HERO_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 -z-10 w-full h-full object-cover opacity-30" loading="lazy" />
              <span className="w-12 h-12 shrink-0 rounded-xl bg-white text-ink flex items-center justify-center"><ImageIcon size={24} strokeWidth={2.2} /></span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-extrabold text-[1.5rem] leading-tight">Browse the property gallery</span>
                <span className="block text-[14.5px] text-white/75 mt-0.5">See listings shared by our sellers.</span>
              </span>
              <ArrowRight size={22} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Why: three plain facts, ruled like a ledger instead of boxed */}
          <section className="mt-20" aria-labelledby="why-title">
            <h2 id="why-title" className="font-display font-extrabold text-[2.2rem] sm:text-5xl leading-none text-ink">Why people use us</h2>
            <div className="mt-8 grid md:grid-cols-3 border-t-[3px] border-ink">
              {WHY.map(({ Icon, title, text, tint }, i) => (
                <Reveal key={title} delay={i * 90} distance={18} className={`py-6 md:px-6 md:first:pl-0 md:last:pr-0 border-b-2 border-ink/10 md:border-b-0 ${i > 0 ? "md:border-l-2 md:border-l-ink/10" : ""}`}>
                  <span className="w-11 h-11 rounded-lg flex items-center justify-center text-white" style={{ background: tint }}>
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 font-display font-bold text-[1.35rem] leading-tight text-ink">{title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-ink/70 max-w-sm">{text}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* How: this one really is a sequence, so it is numbered */}
          <section className="mt-20" aria-labelledby="how-title">
            <h2 id="how-title" className="font-display font-extrabold text-[2.2rem] sm:text-5xl leading-none text-ink">How it works</h2>
            <ol className="mt-8 grid md:grid-cols-3 gap-6 md:gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex md:flex-col gap-4">
                  <span className="relative shrink-0 w-14 h-14 rounded-xl bg-ink text-gold-light font-display font-extrabold text-[1.7rem] flex items-center justify-center" style={{ boxShadow: "0 4px 0 0 #0E8C84" }}>
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && <span className="hidden md:block absolute left-16 right-0 top-7 border-t-2 border-dashed border-ink/25" aria-hidden="true" />}
                  <div>
                    <h3 className="font-display font-bold text-[1.35rem] leading-tight text-ink">{s.title}</h3>
                    <p className="text-[15.5px] text-ink/70 leading-relaxed mt-1.5 max-w-xs">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>

      {/* ---------- Closing band + footer ---------- */}
      <footer className="bg-ink text-white">
        <TileStrip kind="diamonds" palette="ink" size={28} />
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20 grid md:grid-cols-[1.25fr_1fr] gap-8 md:gap-14 items-center">
          <h2 className="font-display font-extrabold text-[3rem] sm:text-[4.4rem] leading-[0.92]">Ready when you are.</h2>
          <div>
            <p className="text-white/80 text-[16.5px] leading-relaxed max-w-sm">Fill in a short form. We read every request and reply on WhatsApp.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/buyer" className="btn-gold">Tell us what you need <ArrowRight size={18} /></Link>
              <Link to="/seller" className="btn-outline-light">List my property</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size={38} tone="light" />
              <p className="text-[13.5px] text-white/70 leading-snug">© {new Date().getFullYear()} {COMPANY_NAME}</p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] font-semibold text-white/80" aria-label="Footer">
              <Link to="/gallery" className="hover:text-white">Property gallery</Link>
              <Link to="/seller" className="hover:text-white">Sell a property</Link>
              <Link to="/buyer" className="hover:text-white">Buy a property</Link>
              <Link to="/mediator" className="hover:text-white">Join as mediator</Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* WhatsApp button, shown once you have scrolled past the photo */}
      <a
        href={whatsappLink(ADMIN_WHATSAPP_NUMBER, WA_HI)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        tabIndex={showChat ? 0 : -1}
        className={`fixed right-4 z-30 w-14 h-14 rounded-xl bg-whatsapp text-ink-dark flex items-center justify-center transition-all duration-300 ${
          showChat ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))", boxShadow: "0 4px 0 0 #138A47" }}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
