import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { APP_NAME } from "../lib/config";

const links = [
  { to: "/buyer", label: "Buy" },
  { to: "/seller", label: "Sell" },
  { to: "/mediator", label: "Mediator" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl border-b ${
        scrolled ? "bg-white/90 border-navy/10 shadow-soft" : "bg-white/60 border-transparent"
      }`}
    >
      <div className={`max-w-5xl mx-auto px-5 flex items-center justify-between transition-all duration-300 ${scrolled ? "py-2" : "py-3.5"}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <Logo size={46} className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
          <span className="leading-none">
            <span className="block font-display font-extrabold text-[17px] tracking-tight text-navy uppercase">
              {APP_NAME}
            </span>
            <span className="block text-[9px] font-bold tracking-[0.22em] uppercase text-gold-dark mt-1">
              Your dream • Our priority
            </span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold rounded-full transition ${
                  isActive ? "text-navy bg-sky-soft" : "text-navy/60 hover:text-navy hover:bg-navy/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {pathname !== "/" && (
          <Link
            to="/"
            className="sm:hidden text-xs uppercase tracking-wider font-bold text-navy/60 hover:text-navy transition"
          >
            ← Home
          </Link>
        )}
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gold-dark via-gold-light to-sky transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </header>
  );
}
