import { Link } from "react-router-dom";
import Logo from "../Logo";
import TileStrip from "../TileStrip";
import { HERO_IMAGE } from "../../lib/brand";
import { APP_NAME } from "../../lib/config";

export const headerBtnCls =
  "relative w-11 h-11 rounded-xl bg-white/12 hover:bg-white hover:text-ink text-white flex items-center justify-center transition-colors active:translate-y-0.5";

/**
 * Gallery header: the mediator-and-globe photo sits quietly behind the mark,
 * with a back button on the left and actions on the right. Floor tile runs
 * along the bottom edge. Used on the gallery and the property page.
 */
export default function ShowcaseHeader({ left = null, right = null }) {
  return (
    <header className="relative isolate overflow-hidden bg-ink-dark">
      <img src={HERO_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 -z-10 w-full h-full object-cover object-[50%_40%] opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-dark/60 to-ink-dark/90" aria-hidden="true" />
      <div
        className="max-w-6xl mx-auto px-4 pb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="flex justify-start gap-2">{left}</div>
        <Link to="/" className="flex flex-col items-center text-center leading-none" aria-label={`${APP_NAME}, home`}>
          <Logo size={48} tone="light" />
          <span className="font-display font-extrabold text-white text-[1.3rem] mt-2 whitespace-nowrap">{APP_NAME}</span>
        </Link>
        <div className="flex justify-end gap-2">{right}</div>
      </div>
      <TileStrip kind="diamonds" palette="ink" size={16} />
    </header>
  );
}
