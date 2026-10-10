import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER, COMPANY_NAME, TAGLINE } from "../lib/config";

const COLS = [
  { title: "Explore", links: [["/gallery", "Property gallery"], ["/buyer", "Buy a property"], ["/seller", "Sell a property"], ["/mediator", "Join as a mediator"]] },
  { title: "How it works", links: [["/buyer", "Tell us what you need"], ["/gallery", "See matching listings"], ["/seller", "List what you own"]] },
];

export default function SiteFooter() {
  const wa = whatsappLink(ADMIN_WHATSAPP_NUMBER, "Hi Star Housing, I'd like to know more about your properties.");
  return (
    <footer className="bg-ink-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={46} tone="light" />
            <p className="font-display font-semibold text-[1.4rem] leading-none">Star Housing</p>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65 max-w-xs">
            {COMPANY_NAME}. We connect mediators, sellers and buyers, and a real person replies to every request.
          </p>
          <p className="mt-4 font-display italic text-[1.15rem] text-brand-light">{TAGLINE}</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="font-semibold text-[15px] text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([to, label]) => (
                <li key={label}><Link to={to} className="text-[15px] text-white/65 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="font-semibold text-[15px]">Talk to us</p>
          <p className="mt-4 text-[15px] text-white/65 leading-relaxed">Ask about a listing or share what you are looking for.</p>
          <a href={wa} target="_blank" rel="noreferrer" className="btn-whatsapp !py-2.5 !px-4 mt-4 text-[14px]"><MessageCircle size={17} /> Chat on WhatsApp</a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-[13px] text-white/50">© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
