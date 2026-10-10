import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, LayoutGrid, List, Heart, ChevronDown, SlidersHorizontal, AlertTriangle, GitCompareArrows, ChevronRight } from "lucide-react";
import { optimizedImageUrl } from "../lib/cloudinary";
import useFavorites from "../lib/useFavorites";
import useProperties from "../lib/useProperties";
import useRecent from "../lib/useRecent";
import { BUDGET_BANDS, DEFAULT_FILTERS, activeFilterCount, applyFilters, collectionsFor, shortType, sortListings } from "../lib/gallery";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import FeaturedCarousel from "../components/gallery/FeaturedCarousel";
import PropertyCard from "../components/gallery/PropertyCard";
import FilterSheet from "../components/gallery/FilterSheet";
import FilterPanel from "../components/gallery/FilterPanel";
import CountUp from "../components/gallery/CountUp";
import StatsStrip from "../components/gallery/StatsStrip";
import CollectionRail from "../components/gallery/CollectionRail";
import CompareSheet from "../components/gallery/CompareSheet";

const SORT_OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "price-low", label: "Price: low to high" },
  { key: "price-high", label: "Price: high to low" },
];
const SCROLL_KEY = "star_gallery_scroll";

function Tab({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 h-12 px-1 mr-6 text-[15px] font-semibold whitespace-nowrap transition-colors ${active ? "text-ink" : "text-ink/55 hover:text-ink"}`}
    >
      {children}
      {count != null && <span className="ml-1.5 text-[12.5px] font-normal text-ink/45">{count}</span>}
      <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-brand origin-left transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  );
}

export default function Gallery() {
  const favorites = useFavorites();
  const { properties, error } = useProperties();
  const [query, setQuery] = useState("");
  const [params] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    type: params.get("type") || "All",
    area: params.get("area") || "All",
    budget: BUDGET_BANDS.some((b) => b.key === params.get("budget")) ? params.get("budget") : "any",
  }));
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState("grid");
  const [compareOpen, setCompareOpen] = useState(false);
  const recent = useRecent();
  const restored = useRef(false);
  const lastY = useRef(0);

  // Come back from a listing to the same place in the list. The position is
  // tracked while you scroll, because by the time this page unmounts the
  // browser has already shortened it and reset scrollY.
  useEffect(() => {
    const onScroll = () => {
      lastY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      try {
        sessionStorage.setItem(SCROLL_KEY, String(lastY.current));
      } catch {
        // ignore
      }
    };
  }, []);
  useEffect(() => {
    if (!properties || restored.current) return;
    restored.current = true;
    try {
      const y = Number(sessionStorage.getItem(SCROLL_KEY));
      sessionStorage.removeItem(SCROLL_KEY);
      if (y > 0) requestAnimationFrame(() => window.scrollTo(0, y));
    } catch {
      // ignore
    }
  }, [properties]);

  const types = useMemo(() => {
    if (!properties) return [];
    const counts = {};
    properties.forEach((p) => {
      if (p.type) counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([type, n]) => ({ type, n }));
  }, [properties]);

  const areas = useMemo(() => {
    if (!properties) return [];
    return [...new Set(properties.map((p) => p.area).filter(Boolean))].sort();
  }, [properties]);

  const savedCount = useMemo(
    () => (properties ? properties.filter((p) => favorites.has(p.id)).length : 0),
    [properties, favorites]
  );

  const visible = useMemo(() => {
    if (!properties) return [];
    return sortListings(applyFilters(properties, filters, query, savedOnly, favorites.has), sort);
  }, [properties, filters, query, savedOnly, sort, favorites]);

  const featured = useMemo(
    () =>
      visible
        .filter((l) => !l.sold && l.images.length > 0)
        .slice(0, 4)
        .map((l) => ({
          id: l.id,
          title: l.title,
          location: l.location,
          price: l.price,
          image: optimizedImageUrl(l.images[0], 1200),
        })),
    [visible]
  );

  const filterCount = activeFilterCount(filters);

  // Curated shelves only on the clean home view, so they never fight a search.
  const browsing = filterCount === 0 && !query.trim() && !savedOnly && filters.type === "All";
  const collections = useMemo(() => (properties && browsing ? collectionsFor(properties) : []), [properties, browsing]);
  const recentItems = useMemo(() => {
    if (!properties || !browsing) return [];
    return recent.ids.map((id) => properties.find((p) => p.id === id)).filter((l) => l && !l.sold && l.images.length > 0).slice(0, 8);
  }, [properties, browsing, recent.ids]);
  const compareItems = useMemo(
    () => (properties ? properties.filter((p) => favorites.has(p.id) && !p.sold).slice(0, 3) : []),
    [properties, favorites]
  );

  function pickType(type) {
    setSavedOnly(false);
    setFilters((f) => ({ ...f, type }));
  }
  function resetAll() {
    setQuery("");
    setFilters(DEFAULT_FILTERS);
    setSavedOnly(false);
  }

  const loading = properties === null && !error;
  const hasAny = properties !== null && properties.length > 0;
  const allActive = filters.type === "All" && !savedOnly;
  const chips = [];
  if (filters.type !== "All") chips.push({ k: "type", label: shortType(filters.type), clear: () => setFilters((f) => ({ ...f, type: "All" })) });
  if (filters.area !== "All") chips.push({ k: "area", label: filters.area, clear: () => setFilters((f) => ({ ...f, area: "All" })) });
  if (filters.budget !== "any") chips.push({ k: "budget", label: BUDGET_BANDS.find((b) => b.key === filters.budget)?.label, clear: () => setFilters((f) => ({ ...f, budget: "any" })) });
  if (filters.facing && filters.facing !== DEFAULT_FILTERS.facing) chips.push({ k: "facing", label: `${filters.facing} facing`, clear: () => setFilters((f) => ({ ...f, facing: DEFAULT_FILTERS.facing })) });
  if (query.trim()) chips.push({ k: "q", label: `“${query.trim()}”`, clear: () => setQuery("") });

  return (
    <div className="min-h-screen bg-canvas">
      <SiteNav />

      <header className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13.5px] text-ink/55">
            <Link to="/" className="hover:text-ink">Home</Link><ChevronRight size={14} /><span className="text-ink">Properties</span>
          </nav>
          <div className="mt-3 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-[2.3rem] sm:text-[3rem] leading-[1.02] text-ink">Properties for sale</h1>
              <div className="mt-2"><StatsStrip properties={properties || []} /></div>
            </div>
            <div className="relative w-full md:w-[24rem]">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/45" />
              <input
                className="w-full h-12 rounded-lg border border-line bg-canvas pl-11 pr-11 text-[15px] text-ink placeholder:text-ink/45 outline-none focus:border-brand focus:bg-white transition-colors"
                placeholder="Search by title, area or type"
                aria-label="Search listings"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md hover:bg-ink/5 flex items-center justify-center">
                  <X size={16} className="text-ink/50" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-5 flex overflow-x-auto no-scrollbar -mb-px" role="group" aria-label="Filter by property type">
            <Tab active={allActive} onClick={() => pickType("All")}>All</Tab>
            {types.map(({ type, n }) => (
              <Tab key={type} active={!savedOnly && filters.type === type} onClick={() => pickType(type)} count={n}>{shortType(type)}</Tab>
            ))}
            {(savedCount > 0 || savedOnly) && (
              <Tab active={savedOnly} onClick={() => { setSavedOnly(true); setFilters((f) => ({ ...f, type: "All" })); }} count={savedCount}>
                <Heart size={14} className="inline -mt-0.5 mr-1" fill={savedOnly ? "currentColor" : "none"} />Saved
              </Tab>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-8">
        {hasAny && (
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 card p-5 max-h-[calc(100dvh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-[1.35rem] text-ink">Filters</h2>
                {filterCount > 0 && <span className="text-[12px] font-semibold bg-brand text-white rounded px-2 py-0.5">{filterCount}</span>}
              </div>
              <FilterPanel idp="side" filters={filters} onChange={setFilters} types={types} areas={areas} />
            </div>
          </aside>
        )}

        <main className="min-w-0">
          {error && (
            <p className="alert-error max-w-md mx-auto mb-6">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              {error}
            </p>
          )}

          {loading && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[24rem] rounded-2xl skeleton" />)}
            </div>
          )}

          {hasAny && featured.length > 0 && browsing && <FeaturedCarousel items={featured} />}

          {recentItems.length >= 1 && <CollectionRail title="Recently viewed" subtitle="Pick up where you left off" items={recentItems} />}
          {collections.map((c) => <CollectionRail key={c.key} title={c.title} subtitle={c.subtitle} items={c.items} />)}

          {properties !== null && !hasAny && !error && (
            <div className="card p-10 text-center">
              <p className="font-display text-[1.6rem] text-ink">No listings published yet</p>
              <p className="text-[15px] text-ink/60 mt-1.5">New properties appear here as soon as they are shared. Check back soon.</p>
            </div>
          )}

          {hasAny && (
            <section className={browsing && (featured.length > 0 || collections.length > 0) ? "mt-12" : ""} aria-label="All listings">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
                <h2 className="font-display text-[1.6rem] sm:text-[1.9rem] leading-tight text-ink">
                  {savedOnly ? "Saved listings" : browsing ? "All listings" : "Matching listings"}
                  <span className="ml-2 text-[15px] font-sans font-normal text-ink/55"><CountUp value={visible.length} /> found</span>
                </h2>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowFilters(true)} className="lg:hidden btn-ghost !h-10 !px-3.5 text-[14px]" aria-label={filterCount ? `Filters, ${filterCount} active` : "Filters"}>
                    <SlidersHorizontal size={16} /> Filters{filterCount > 0 && <span className="ml-0.5 text-[12px] bg-brand text-white rounded px-1.5">{filterCount}</span>}
                  </button>
                  <label className="relative flex items-center h-10 rounded-lg border border-line bg-white pl-3 pr-8 text-[14px] font-semibold text-ink cursor-pointer">
                    <span className="sr-only">Sort listings</span>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none bg-transparent pr-2 cursor-pointer outline-none">
                      {SORT_OPTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    <ChevronDown size={15} className="absolute right-2.5 pointer-events-none text-ink/50" />
                  </label>
                  <div className="hidden sm:flex rounded-lg border border-line bg-white p-0.5" role="group" aria-label="Layout">
                    {[["grid", LayoutGrid, "Grid view"], ["list", List, "List view"]].map(([k, Icon, lab]) => (
                      <button key={k} type="button" aria-label={lab} aria-pressed={view === k} onClick={() => setView(k)} className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${view === k ? "bg-ink text-white" : "text-ink/55 hover:text-ink"}`}>
                        <Icon size={17} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {chips.map((c) => (
                    <button key={c.k} type="button" onClick={c.clear} className="h-8 pl-3 pr-2 rounded-full bg-brand-soft text-brand-dark text-[13px] font-semibold flex items-center gap-1.5 hover:bg-brand hover:text-white transition-colors">
                      {c.label}<X size={14} />
                    </button>
                  ))}
                  <button type="button" onClick={resetAll} className="text-[13.5px] font-semibold text-ink/60 hover:text-ink underline underline-offset-2 ml-1">Clear all</button>
                </div>
              )}

              {visible.length === 0 ? (
                <div className="mt-6 card p-10 text-center">
                  <p className="font-display text-[1.4rem] text-ink">{savedOnly ? "Nothing saved yet" : "No listings match"}</p>
                  <p className="text-[15px] text-ink/60 mt-1.5">{savedOnly ? "Tap the heart on any property to keep it here." : "Try a different search or clear the filters."}</p>
                  <button type="button" onClick={resetAll} className="btn-ghost mt-5">{savedOnly ? "Browse all listings" : "Clear filters"}</button>
                </div>
              ) : view === "grid" ? (
                <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visible.map((l, i) => <PropertyCard key={l.id} l={l} index={i % 9} saved={favorites.has(l.id)} onToggleSaved={() => favorites.toggle(l.id)} />)}
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {visible.map((l, i) => <PropertyCard key={l.id} l={l} layout="list" index={i % 9} saved={favorites.has(l.id)} onToggleSaved={() => favorites.toggle(l.id)} />)}
                </div>
              )}
            </section>
          )}

          {hasAny && (
            <div className="mt-12 rounded-2xl bg-ink-dark text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-display text-[1.5rem] leading-tight">Have a property to sell, or looking to buy?</p>
                <p className="text-[15px] text-white/65 mt-1">Get listed with Star Housing. It takes a minute.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to="/seller" className="btn-primary">Sell a property</Link>
                <Link to="/buyer" className="btn-outline-light">I want to buy</Link>
              </div>
            </div>
          )}
        </main>
      </div>

      <SiteFooter />

      {compareItems.length >= 2 && !compareOpen && (
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className="rip fixed z-40 left-1/2 -translate-x-1/2 bottom-5 h-12 pl-4 pr-5 rounded-lg bg-ink-dark text-white text-[14px] font-semibold flex items-center gap-2 shadow-lift rise"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <GitCompareArrows size={18} className="text-brand-light" /> Compare {compareItems.length} saved
        </button>
      )}
      {compareOpen && <CompareSheet items={compareItems} onClose={() => setCompareOpen(false)} />}

      {showFilters && (
        <FilterSheet filters={filters} onChange={setFilters} types={types} areas={areas} resultCount={visible.length} onClose={() => setShowFilters(false)} />
      )}
    </div>
  );
}
