import { Link } from "react-router-dom";
import Logo from "../Logo";
import TileStrip from "../TileStrip";
import { APP_NAME } from "../../lib/config";

/**
 * Top bar of every registration screen: the Star Housing mark on peacock ink,
 * with a strip of floor tile along the bottom. Tapping it always goes home.
 * (`color` is the current step colour; it now tints the bar's bottom edge.)
 */
export default function BrandHeader({ color = "#FF5C8A", right = null, wide = false, className = "" }) {
  return (
    <header className={`relative bg-ink ${className}`}>
      <div
        className={`mx-auto flex items-center justify-between gap-3 px-5 pb-4 ${wide ? "max-w-6xl" : ""}`}
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <Link to="/" className="flex items-center gap-3" aria-label={`${APP_NAME} home`}>
          <Logo size={42} tone="light" />
          <span className="font-display font-extrabold text-[1.2rem] leading-none text-white">{APP_NAME}</span>
        </Link>
        {right}
      </div>
      <TileStrip kind="corners" palette="ink" size={16} />
      <span className="absolute inset-x-0 bottom-0 h-[3px] transition-colors duration-300" style={{ background: color }} aria-hidden="true" />
    </header>
  );
}
