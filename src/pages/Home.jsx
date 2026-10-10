import { Link } from "react-router-dom";
import RoleBadge from "../components/RoleBadge";
import Reveal from "../components/Reveal";
import { StarShape } from "../components/Logo";
import { COMPANY_NAME, ADMIN_WHATSAPP_NUMBER } from "../lib/config";
import { whatsappLink } from "../lib/whatsapp";

const roles = [
  {
    to: "/mediator",
    label: "Mediator",
    hex: "#2563EB",
    tag: "Bring the deal",
    desc: "Saw a property on our Insta page? Upload the listing with your note and photo — we'll connect on WhatsApp.",
  },
  {
    to: "/seller",
    label: "Seller",
    hex: "#0D9488",
    tag: "List your property",
    desc: "Share price, location and details of the house, plot or shop you're selling. We follow up directly with you.",
  },
  {
    to: "/buyer",
    label: "Buyer",
    hex: "#EA580C",
    tag: "Browse listings",
    desc: "See verified properties we're currently mediating, with photos and full details.",
  },
];

const steps = [
  ["01", "Spot it on Instagram", "You post a property video — a viewer wants in, as mediator, seller or buyer."],
  ["02", "They fill their details", "Right here in the app — property, price, location, and a photo if they have one."],
  ["03", "We take it from WhatsApp", "It lands straight to us, and we follow up directly to close the deal."],
];

const marquee = ["Buy", "Sell", "Rent", "Invest", "Your Dream", "Our Priority", "Prime Locations", "Great Investments"];

function spot(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Home() {
  return (
    <div>
      {/* ── Hero: cover image with slow cinematic zoom ───────────── */}
      <section className="relative">
        <div className="relative w-full aspect-[5/2] overflow-hidden bg-navy-dark">
          <picture>
            <source media="(min-width: 900px)" srcSet="/brand/cover.jpg" />
            <img
              src="/brand/cover-sm.jpg"
              alt="Star Housing Properties India Pvt Ltd — Your dream, our priority"
              className="absolute inset-0 w-full h-full object-cover hero-kenburns"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-snow to-transparent" />
          <StarShape className="absolute left-[46%] top-[12%] twinkle hidden sm:block" size={18} />
          <StarShape className="absolute left-[8%] bottom-[22%] twinkle hidden sm:block" size={12} color="#FFD36B" />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 -mt-10 sm:-mt-16">
          <div className="card spotlight p-6 sm:p-10 text-center overflow-hidden fade-up" onMouseMove={spot}>
            <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-sky/20 blur-3xl float-slow" />
            <div className="absolute -bottom-24 -right-10 w-64 h-64 rounded-full bg-gold/25 blur-3xl float-slower" />
            <div className="relative">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-bold text-gold-dark">
                Star Housing Properties India
              </p>
              <h1 className="mt-3 font-display font-extrabold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-navy">
                Your Dream.<br className="sm:hidden" /> <span className="text-gradient-gold">Our Priority.</span>
              </h1>
              <p className="mt-5 text-navy/65 max-w-xl mx-auto leading-relaxed">
                One record for every house, plot or shop shared on our Instagram — from the first message to the
                final handshake.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/buyer" className="btn-gold">Browse properties →</Link>
                <Link to="/seller" className="btn-primary">List your property</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────── */}
      <div className="mt-12 bg-navy text-white overflow-hidden border-y-2 border-gold/60" aria-hidden="true">
        <div className="marquee-track flex w-max py-3.5">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-6 pr-6 font-display font-bold uppercase tracking-[0.2em] text-sm whitespace-nowrap">
              {m}
              <StarShape size={14} />
            </span>
          ))}
        </div>
      </div>

      {/* ── Roles ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-5">
        <Reveal className="pt-16 pb-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-sky">Get started</p>
          <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-navy">How would you like to join?</h2>
        </Reveal>

        <section className="grid sm:grid-cols-3 gap-5">
          {roles.map((r, i) => (
            <Reveal key={r.to} delay={i * 120}>
              <Link
                to={r.to}
                onMouseMove={spot}
                className="card spotlight group p-6 flex flex-col gap-5 h-full overflow-hidden hover:-translate-y-2 hover:shadow-glow transition-all duration-500"
              >
                <span className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500" style={{ background: `linear-gradient(90deg, ${r.hex}, #F5B21B)` }} />
                <div className="flex items-start justify-between">
                  <RoleBadge label={r.label} color={r.hex} size={64} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ color: r.hex, backgroundColor: `${r.hex}14` }}
                  >
                    {r.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-navy mb-1.5">{r.label}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{r.desc}</p>
                </div>
                <span className="mt-auto text-sm font-bold flex items-center gap-1.5" style={{ color: r.hex }}>
                  Continue as {r.label}
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </section>

        {/* ── How it works ───────────────────────────────────────── */}
        <Reveal className="mt-20">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold-dark">How it works</p>
            <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-navy">Three simple steps</h2>
          </div>
          <ol className="relative grid sm:grid-cols-3 gap-8">
            <span className="hidden sm:block draw-line absolute top-7 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-sky via-gold to-sky" />
            {steps.map(([n, t, d], i) => (
              <Reveal as="li" key={n} delay={i * 150} className="relative text-center">
                <span className="relative mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-navy text-gold font-display font-extrabold text-lg shadow-glow ring-4 ring-snow">
                  {n}
                </span>
                <p className="mt-4 font-display font-bold text-navy">{t}</p>
                <p className="mt-1.5 text-sm text-navy/60 leading-relaxed max-w-[16rem] mx-auto">{d}</p>
              </Reveal>
            ))}
          </ol>
        </Reveal>
      </div>

      {/* ── CTA band ─────────────────────────────────────────────── */}
      <Reveal className="mt-20 mb-16 max-w-5xl mx-auto px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white p-8 sm:p-12 text-center shadow-glow">
          <img src="/brand/globe.jpg" alt="" className="absolute right-0 top-0 h-full w-3/5 object-cover object-right opacity-30 hero-kenburns [mask-image:linear-gradient(to_right,transparent,black_60%)]" />
          <StarShape className="absolute left-[10%] top-[18%] twinkle" size={20} />
          <StarShape className="absolute right-[12%] top-[30%] twinkle" size={14} color="#FFD36B" />
          <StarShape className="absolute right-[28%] bottom-[14%] twinkle" size={10} />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              Invest today. <span className="text-gradient-gold">Build your tomorrow.</span>
            </h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto text-sm">
              Talk to the {COMPANY_NAME} team — we'll help you find the right property.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink(ADMIN_WHATSAPP_NUMBER, "Hi Star Housing, I'd like to know more about your properties.")}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp pulse-ring"
              >
                Chat on WhatsApp
              </a>
              <Link to="/buyer" className="btn-outline-light">View listings</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
