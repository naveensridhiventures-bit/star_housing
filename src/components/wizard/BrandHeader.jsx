import { Link } from "react-router-dom";
import Logo from "../Logo";
import { APP_NAME } from "../../lib/config";

/**
 * Compact header for the registration, admin and quick-note screens: the mark
 * and name on white, with a thin line in the current step colour beneath.
 */
export default function BrandHeader({ color = "#5B3FE0", right = null, wide = false, className = "" }) {
  return (
    <header className={`relative bg-white border-b border-line ${className}`}>
      <div
        className={`mx-auto flex items-center justify-between gap-3 px-5 pb-3.5 ${wide ? "max-w-6xl" : ""}`}
        style={{ paddingTop: "max(0.85rem, env(safe-area-inset-top))" }}
      >
        <Link to="/" className="flex items-center gap-3" aria-label={`${APP_NAME} home`}>
          <Logo size={36} />
          <span className="font-display font-semibold text-[1.25rem] leading-none text-ink">{APP_NAME}</span>
        </Link>
        {right}
      </div>
      <span className="absolute inset-x-0 bottom-[-1px] h-[3px] transition-colors duration-300" style={{ background: color }} aria-hidden="true" />
    </header>
  );
}
