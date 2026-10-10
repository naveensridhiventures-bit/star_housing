import { Link } from "react-router-dom";
import Logo from "../Logo";
import { APP_NAME } from "../../lib/config";

/**
 * The navy brand bar shown at the top of every registration screen: the Star
 * Housing mark plus the name, with a thin gold rule underneath. The `color`
 * prop (the current step colour) tints the rule so each step still feels
 * different. Tapping it always goes home.
 */
export default function BrandHeader({ color = "#F5B21B", right = null, wide = false, className = "" }) {
  return (
    <header className={`relative bg-gradient-to-br from-navy-dark via-navy to-navy-light rounded-b-[1.75rem] overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 bottom-0 h-[3px] transition-colors duration-300" style={{ background: `linear-gradient(90deg, ${color}, #FFD36B 50%, ${color})` }} aria-hidden="true" />
      <div
        className={`mx-auto flex items-center justify-between gap-3 px-5 pb-5 ${wide ? "max-w-6xl" : ""}`}
        style={{ paddingTop: "max(1.1rem, env(safe-area-inset-top))" }}
      >
        <Link to="/" className="flex items-center gap-3" aria-label={`${APP_NAME} — home`}>
          <Logo size={44} tone="light" />
          <span className="leading-none">
            <span className="block font-display font-extrabold text-[15px] tracking-tight text-white uppercase">{APP_NAME}</span>
            <span className="block text-[9px] font-bold tracking-[0.22em] uppercase text-gold mt-1">Your dream • Our priority</span>
          </span>
        </Link>
        {right}
      </div>
    </header>
  );
}
