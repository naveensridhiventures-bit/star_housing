import { Link } from "react-router-dom";
import Logo from "./Logo";
import { COMPANY_NAME } from "../lib/config";

export default function Footer() {
  return (
    <footer className="relative bg-navy-dark text-white overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />
      <div className="max-w-5xl mx-auto px-5 py-10 grid sm:grid-cols-[1.4fr,1fr] gap-8 items-center">
        <div className="flex items-center gap-4">
          <Logo size={54} tone="light" />
          <div>
            <p className="font-display font-extrabold uppercase tracking-tight leading-tight">{COMPANY_NAME}</p>
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold mt-1.5 font-semibold">Your dream • Our priority</p>
          </div>
        </div>
        <nav className="flex sm:justify-end gap-x-6 gap-y-2 flex-wrap text-sm font-semibold text-white/70">
          <Link to="/buyer" className="hover:text-gold transition">Buy</Link>
          <Link to="/seller" className="hover:text-gold transition">Sell</Link>
          <Link to="/mediator" className="hover:text-gold transition">Mediator</Link>
        </nav>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-white/50 py-4">
        © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
