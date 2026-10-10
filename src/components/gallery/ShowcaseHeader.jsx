import { Link } from "react-router-dom";
import Logo, { StarShape } from "../Logo";
import { HERO_IMAGE } from "../../lib/brand";
import { APP_NAME } from "../../lib/config";

export const headerBtnCls =
  "relative w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95";

/**
 * The gallery's dark header: a softly blurred, slowly drifting photo behind
 * the Star Housing mark, with a button on each side (back on the left,
 * actions on the right). Used on both the gallery and the property page.
 */
export default function ShowcaseHeader({ left = null, right = null }) {
  return (
    <header className="relative isolate overflow-hidden rounded-b-[1.75rem] bg-ink-dark">
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="hero-photo absolute inset-0 -z-10 w-full h-full object-cover object-[60%_35%] opacity-45 blur-[3px]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-dark/70 via-ink/60 to-ink-dark/95" aria-hidden="true" />
      <StarShape className="absolute right-[14%] top-4 twinkle hidden sm:block" size={16} />
      <StarShape className="absolute left-[16%] bottom-6 twinkle hidden sm:block" size={11} color="#FFD36B" />
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" aria-hidden="true" />
      <div
        className="max-w-6xl mx-auto px-4 pb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="flex justify-start gap-2">{left}</div>
        <Link to="/" className="fade-up flex flex-col items-center text-center leading-none" aria-label={`${APP_NAME}, home`}>
          <Logo size={50} tone="light" />
          <span className="font-display font-extrabold text-white text-[1.02rem] mt-2 whitespace-nowrap uppercase tracking-tight">
            Star <span className="text-gold-light">Housing</span>
          </span>
          <span className="text-[8.5px] font-bold tracking-[0.24em] uppercase text-gold mt-1">Your dream • Our priority</span>
        </Link>
        <div className="flex justify-end gap-2">{right}</div>
      </div>
    </header>
  );
}
