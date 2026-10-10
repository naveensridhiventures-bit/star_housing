import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import FilterPanel from "./FilterPanel";
import CountUp from "./CountUp";

/**
 * Filters as a slide-in drawer from the right on every screen size (the
 * desktop gallery shows the same controls in a sidebar instead).
 * `types` is [{ type, n }].
 */
export default function FilterSheet({ filters, onChange, types, areas, resultCount, onClose }) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-ink-dark/55 flex justify-end" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="drawer-in bg-surface w-[min(26rem,100vw)] h-[100dvh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-line shrink-0">
          <h2 className="font-display text-[1.4rem] text-ink">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="w-10 h-10 rounded-lg hover:bg-canvas flex items-center justify-center">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <FilterPanel idp="sheet" filters={filters} onChange={onChange} types={types} areas={areas} />
        </div>
        <div className="px-5 pt-3 border-t border-line" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <button type="button" onClick={onClose} className="btn-primary w-full !h-12">
            Show <CountUp value={resultCount} duration={450} /> properties
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
