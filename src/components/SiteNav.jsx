import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER, APP_NAME } from "../lib/config";

const LINKS = [
  { to: "/gallery", label: "Properties" },
  { to: "/buyer", label: "Buy" },
  { to: "/seller", label: "Sell" },
  { to: "/mediator", label: "Mediators" },
];

/** The site navigation: sticky, with a menu panel on phones. */
export default function SiteNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = whatsappLink(ADMIN_WHATSAPP_NUMBER, "Hi Star Housing, I'd like to know more about your properties.");

  return (
    <header className={`sticky top-0 z-40 bg-white/92 backdrop-blur border-b transition-shadow ${scrolled ? "border-line shadow-soft" : "border-transparent"}`} style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={`${APP_NAME} home`}>
          <Logo size={40} />
          <span className="leading-none">
            <span className="block font-display font-semibold text-[1.35rem] text-ink">{APP_NAME}</span>
            <span className="hidden sm:block text-[11px] text-ink/55 mt-1">Properties India Pvt Ltd</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-[15px] font-semibold transition-colors ${isActive ? "text-brand" : "text-ink/75 hover:text-ink"}`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute left-4 right-4 -bottom-[1.05rem] h-0.5 bg-brand" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost !py-2 !px-4 text-[14px] hidden sm:inline-flex">
            <MessageCircle size={17} /> WhatsApp
          </a>
          <Link to="/seller" className="btn-primary !py-2 !px-4 text-[14px] hidden sm:inline-flex">List your property</Link>
          <button
            type="button"
            className="md:hidden w-11 h-11 rounded-xl border border-line flex items-center justify-center text-ink"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white px-4 pb-5 pt-2 route-in">
          <nav className="flex flex-col" aria-label="Menu">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `py-3.5 text-[17px] font-semibold border-b border-line ${isActive ? "text-brand" : "text-ink"}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost !py-3 text-[15px]"><MessageCircle size={18} /> WhatsApp</a>
            <Link to="/seller" className="btn-primary !py-3 text-[15px]">List property</Link>
          </div>
        </div>
      )}
    </header>
  );
}
