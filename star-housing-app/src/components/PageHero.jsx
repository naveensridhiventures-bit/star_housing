import RoleBadge from "./RoleBadge";
import { StarShape } from "./Logo";

// Branded banner used at the top of the role / listing pages.
export default function PageHero({ label, eyebrow, title, subtitle, accent = "#2E8BFF" }) {
  return (
    <section className="relative overflow-hidden bg-navy-dark text-white">
      <img src="/brand/globe.jpg" alt="" className="absolute right-0 top-0 h-full w-full sm:w-3/5 object-cover object-center opacity-30 hero-kenburns [mask-image:linear-gradient(to_right,transparent,black_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy/90 to-navy/60" />
      <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ background: accent }} />
      <StarShape className="absolute right-[12%] top-8 twinkle" size={22} />
      <StarShape className="absolute right-[26%] bottom-14 twinkle" size={14} color="#FFD36B" />
      <div className="relative max-w-5xl mx-auto px-5 pt-12 pb-20 flex items-center gap-5 fade-up">
        <div className="bg-white rounded-full p-1.5 shadow-gold">
          <RoleBadge label={label} color={accent} size={72} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-gold">{eyebrow}</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">{title}</h1>
          {subtitle && <p className="text-white/70 text-sm mt-1.5 max-w-md">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
