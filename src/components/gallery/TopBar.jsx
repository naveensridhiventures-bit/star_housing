import { ArrowLeft } from "lucide-react";
import SiteNav from "../SiteNav";

export const roundBtn =
  "relative w-10 h-10 shrink-0 rounded-lg border border-line bg-white flex items-center justify-center transition-colors hover:border-ink/40 active:scale-95";

/**
 * The page header for the secondary gallery pages (photos, enquiry): the site
 * navigation, then a title row with a back button and one slot on the right.
 */
export default function TopBar({ title, onBack, right = null }) {
  return (
    <>
      <SiteNav />
      <div className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button type="button" onClick={onBack} aria-label="Go back" className={`${roundBtn} text-ink`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-[1.7rem] sm:text-[2rem] leading-tight text-ink flex-1 min-w-0 truncate">{title}</h1>
          <div className="flex justify-end">{right}</div>
        </div>
      </div>
    </>
  );
}
