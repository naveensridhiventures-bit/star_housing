import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Heart, Share2, Check, Images, Phone, MessageCircle, ChevronRight, Send, CalendarCheck, Clock, Grid2x2 } from "lucide-react";
import useProperties from "../lib/useProperties";
import useFavorites from "../lib/useFavorites";
import useRecent from "../lib/useRecent";
import { specsFor, highlightsFor, emiFrom, inr, listedAgo, similarTo } from "../lib/gallery";
import { optimizedImageUrl } from "../lib/cloudinary";
import { whatsappLink, callLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";
import SoldOutStamp from "../components/SoldOutStamp";
import PhotoSlider from "../components/gallery/PhotoSlider";
import ImmersiveViewer from "../components/gallery/ImmersiveViewer";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import Highlights from "../components/gallery/Highlights";
import EmiCalculator from "../components/gallery/EmiCalculator";
import VisitSheet from "../components/gallery/VisitSheet";
import AboutProperty from "../components/gallery/AboutProperty";
import Burst from "../components/gallery/Burst";
import CollectionRail from "../components/gallery/CollectionRail";

const heroBtn =
  "relative pointer-events-auto w-10 h-10 rounded-full bg-ink-dark/55 text-white flex items-center justify-center hover:bg-ink-dark/75 transition-colors active:scale-95";

function PageShell({ children }) {
  return <div className="min-h-screen bg-canvas flex flex-col"><SiteNav />{children}</div>;
}

function Crumbs({ title }) {
  return (
    <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-1.5 text-[13.5px] text-ink/55 pt-5">
      <Link to="/" className="hover:text-ink">Home</Link><ChevronRight size={14} />
      <Link to="/gallery" className="hover:text-ink">Properties</Link><ChevronRight size={14} />
      <span className="text-ink truncate max-w-[24rem]">{title}</span>
    </nav>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, error } = useProperties();
  const favorites = useFavorites();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [shared, setShared] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [burst, setBurst] = useState(0);
  const recent = useRecent();
  const recordRecent = recent.record;
  const onIndex = useCallback((i) => setPhotoIndex(i), []);

  const listing = properties ? properties.find((p) => p.id === id) || null : undefined;
  const listingId = listing ? listing.id : null;
  useEffect(() => {
    if (listingId) recordRecent(listingId);
  }, [listingId, recordRecent]);

  if (error) {
    return (
      <PageShell>
        <div className="flex items-center justify-center px-5 py-16">
          <p className="alert-error max-w-sm">{error}</p>
        </div>
      </PageShell>
    );
  }

  if (listing === undefined) {
    return (
      <PageShell>
        <div className="max-w-7xl w-full mx-auto sm:px-6 lg:pt-6">
          <div className="aspect-[4/3.1] lg:aspect-[21/9] lg:rounded-2xl skeleton" />
          <div className="px-5 lg:px-0 pt-6 space-y-3">
            <div className="h-8 w-2/3 rounded-md skeleton" />
            <div className="h-4 w-1/3 rounded-md skeleton" />
            <div className="h-7 w-1/4 rounded-md skeleton" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (listing === null) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center px-5 py-24 text-center gap-4">
          <h2 className="font-display text-[2rem] text-ink">This property isn't available anymore</h2>
          <p className="text-[15px] text-ink/60">It may have been sold or removed.</p>
          <Link to="/gallery" className="btn-primary">See all properties</Link>
        </div>
      </PageShell>
    );
  }

  const l = listing;
  const saved = favorites.has(l.id);
  const specs = specsFor(l);
  const attrEntries = Object.entries(l.attrs).filter(([, v]) => v);
  const heroImages = l.images.map((u) => optimizedImageUrl(u, 1200));
  const count = l.images.length;
  const highlights = highlightsFor(l);
  const emiMonthly = emiFrom(l);
  const ago = listedAgo(l);
  const similar = similarTo(l, properties);
  const enquiryText = `Hi, I'm interested in this property: ${l.title}${l.location ? ` (${l.location})` : ""}${l.price ? ` — ${l.price}` : ""}${l.refId ? `\n\nProperty ref: ${l.refId}` : ""}\n\nCan you share more details?`;

  // Share sheet on phones; copies the link everywhere else.
  async function handleShare() {
    const url = window.location.href;
    const text = `${l.title}${l.location ? `, ${l.location}` : ""}${l.price ? ` (${l.price})` : ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: l.title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // cancelled or not allowed: nothing to do
    }
  }

  const waHref = whatsappLink(ADMIN_WHATSAPP_NUMBER, enquiryText);
  const side = heroImages.slice(1, 5);

  const actions = l.sold ? (
    <span className="h-12 rounded-lg bg-ink/10 text-ink/50 text-[14px] font-semibold flex items-center justify-center">No longer available</span>
  ) : (
    <div className="grid gap-2.5">
      <button type="button" onClick={() => setVisitOpen(true)} className="btn-primary !h-12 w-full"><CalendarCheck size={18} /> Book a visit</button>
      <a href={waHref} target="_blank" rel="noreferrer" className="btn-whatsapp !h-12 w-full"><MessageCircle size={18} /> Chat on WhatsApp</a>
      <div className="grid grid-cols-2 gap-2.5">
        <a href={callLink(ADMIN_WHATSAPP_NUMBER)} className="btn-ghost !h-11 text-[14.5px]"><Phone size={16} /> Call</a>
        <Link to={`/gallery/${l.id}/enquiry`} className="btn-ghost !h-11 text-[14.5px]"><Send size={16} /> Enquire</Link>
      </div>
    </div>
  );

  return (
    <PageShell>
      <div className="flex-1 max-w-7xl w-full mx-auto sm:px-6">
        <Crumbs title={l.title} />

        {/* Phones: swipeable photos */}
        <PhotoSlider
          images={heroImages}
          alt={l.title}
          onOpen={count ? setViewerIndex : undefined}
          onIndexChange={onIndex}
          className={`lg:hidden aspect-[4/3.1] sm:rounded-2xl sm:mt-4 ${l.sold ? "[&_img]:grayscale" : ""}`}
          overlayClass="bg-gradient-to-b from-ink-dark/40 via-transparent to-transparent"
        >
          <div className="absolute top-0 inset-x-0 flex items-start justify-between px-4 pt-3">
            <Link to="/gallery" aria-label="Back to all properties" className={heroBtn}><ArrowLeft size={21} /></Link>
            <div className="flex gap-2">
              {!l.sold && (
                <button type="button" onClick={() => { if (!saved) setBurst((n) => n + 1); favorites.toggle(l.id); }} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save this property"} className={`${heroBtn} ${saved ? "!bg-white !text-[#DC2626]" : ""}`}>
                  <Heart size={20} fill={saved ? "currentColor" : "none"} className={burst && saved ? "heart-beat" : ""} />
                  <Burst fire={burst} count={10} spread={40} />
                </button>
              )}
              <button type="button" onClick={handleShare} aria-label="Share this property" className={heroBtn}>{shared ? <Check size={20} /> : <Share2 size={20} />}</button>
            </div>
          </div>
          {count > 0 && (
            <Link to={`/gallery/${l.id}/photos`} aria-label={`See all ${count} photos`} className="pointer-events-auto absolute right-4 bottom-4 flex items-center gap-1.5 rounded-md bg-ink-dark/70 text-white text-[13px] font-semibold px-2.5 py-1.5">
              <Images size={15} />{photoIndex + 1}/{count}
            </Link>
          )}
          {l.sold && <SoldOutStamp size="lg" />}
        </PhotoSlider>

        {/* Computers: a photo mosaic that opens the full-screen viewer */}
        {count > 0 && (
          <div className={`hidden lg:grid mt-4 gap-2 rounded-2xl overflow-hidden h-[28rem] ${side.length >= 2 ? "grid-cols-[2fr_1fr_1fr] grid-rows-2" : side.length === 1 ? "grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
            <button type="button" onClick={() => setViewerIndex(0)} className={`relative overflow-hidden group bg-ink-dark ${side.length >= 2 ? "row-span-2" : ""} ${l.sold ? "grayscale" : ""}`} aria-label="Open photo 1">
              <img src={heroImages[0]} alt={l.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              {l.sold && <SoldOutStamp size="lg" />}
            </button>
            {side.map((u, i) => (
              <button key={u} type="button" onClick={() => setViewerIndex(i + 1)} className={`relative overflow-hidden group bg-ink-dark ${side.length === 2 ? "row-span-2" : side.length === 3 && i === 2 ? "col-span-2" : ""}`} aria-label={`Open photo ${i + 2}`}>
                <img src={u} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {i === side.length - 1 && count > side.length + 1 && (
                  <span className="absolute inset-0 bg-ink-dark/55 text-white flex items-center justify-center gap-2 font-semibold text-[15px]"><Grid2x2 size={18} /> +{count - side.length - 1} photos</span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="px-5 sm:px-0 pt-6 lg:pt-8 pb-28 lg:pb-16 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-[1.9rem] sm:text-[2.5rem] leading-[1.08] text-ink">{l.title}</h1>
                {l.location && (
                  <p className="mt-2 flex items-center gap-1.5 text-[15px] text-ink/65"><MapPin size={16} className="shrink-0 text-brand" />{l.location}</p>
                )}
              </div>
              <div className="hidden lg:flex gap-2 shrink-0">
                {!l.sold && (
                  <button type="button" onClick={() => { if (!saved) setBurst((n) => n + 1); favorites.toggle(l.id); }} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save this property"} className={`relative w-11 h-11 rounded-lg border border-line bg-white flex items-center justify-center hover:border-ink/40 transition-colors ${saved ? "!text-[#DC2626] !border-[#DC2626]/40" : "text-ink/70"}`}>
                    <Heart size={19} fill={saved ? "currentColor" : "none"} className={burst && saved ? "heart-beat" : ""} />
                    <Burst fire={burst} count={10} spread={40} />
                  </button>
                )}
                <button type="button" onClick={handleShare} aria-label="Share this property" className="w-11 h-11 rounded-lg border border-line bg-white text-ink/70 flex items-center justify-center hover:border-ink/40 transition-colors">{shared ? <Check size={19} /> : <Share2 size={19} />}</button>
              </div>
            </div>

            <div className="mt-5 flex items-baseline flex-wrap gap-x-4 gap-y-1 lg:hidden">
              <p className={`font-display ${l.price ? "text-[2rem]" : "text-[1.1rem] text-ink/50"} ${l.sold ? "text-ink/40 line-through" : "text-ink"}`}>{l.price || "Price on request"}</p>
              {l.pricePerSqft && !l.sold && <span className="text-[13.5px] text-ink/60">{inr(l.pricePerSqft)} / sq.ft</span>}
              {emiMonthly > 0 && <a href="#emi" className="text-[13.5px] font-semibold text-brand underline underline-offset-2">EMI from {inr(emiMonthly)}/mo</a>}
            </div>

            {highlights.length > 0 && <div className="mt-5"><Highlights items={highlights} /></div>}

            {specs.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 border border-line rounded-xl bg-white divide-x divide-y sm:divide-y-0 divide-line overflow-hidden">
                {specs.map(({ icon: Icon, text }) => (
                  <li key={text} className="p-4 flex items-center gap-3">
                    <Icon size={22} strokeWidth={1.6} className="text-brand shrink-0" />
                    <span className="text-[14px] font-semibold text-ink leading-tight">{text}</span>
                  </li>
                ))}
              </ul>
            )}

            <AboutProperty description={l.description} sellerNote={l.sellerNote} />

            {attrEntries.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-[1.5rem] text-ink mb-3">Property details</h2>
                <dl className="rounded-xl border border-line bg-white divide-y divide-line">
                  {attrEntries.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[9rem_1fr] sm:grid-cols-[12rem_1fr] gap-3 px-4 py-3">
                      <dt className="text-[14px] text-ink/55">{k}</dt>
                      <dd className="text-[14.5px] text-ink font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {!l.sold && l.priceNum >= 500000 && (
              <div id="emi" className="mt-10 scroll-mt-24"><EmiCalculator price={l.priceNum} /></div>
            )}

            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              {count > 0 && (
                <Link to={`/gallery/${l.id}/photos`} className="flex items-center gap-3 rounded-xl bg-white border border-line px-4 py-3.5 hover:border-brand transition-colors">
                  <Images size={20} className="text-brand" />
                  <span className="flex-1 text-[15px] font-semibold text-ink">All photos ({count})</span>
                  <ChevronRight size={18} className="text-ink/40" />
                </Link>
              )}
              {l.location && (
                <Link to={`/gallery/${l.id}/photos?tab=location`} className="flex items-center gap-3 rounded-xl bg-white border border-line px-4 py-3.5 hover:border-brand transition-colors">
                  <MapPin size={20} className="text-brand" />
                  <span className="flex-1 text-[15px] font-semibold text-ink">Location &amp; map</span>
                  <ChevronRight size={18} className="text-ink/40" />
                </Link>
              )}
            </div>

            {similar.length >= 2 && <CollectionRail title="Similar properties" subtitle="Close in type, area and budget" items={similar} />}
          </div>

          {/* Desktop contact card */}
          <aside className="hidden lg:block" aria-label="Contact">
            <div className="sticky top-24 card p-6">
              <p className="text-[13.5px] text-ink/55">{l.sold ? "Sold" : "Asking price"}</p>
              <p className={`font-display text-[2.4rem] leading-none mt-1 ${l.sold ? "text-ink/40 line-through" : "text-ink"}`}>{l.price || "On request"}</p>
              <div className="mt-2 text-[14px] text-ink/60 space-y-0.5">
                {l.pricePerSqft && !l.sold && <p>{inr(l.pricePerSqft)} per sq.ft</p>}
                {emiMonthly > 0 && !l.sold && <p><a href="#emi" className="font-semibold text-brand hover:underline">EMI from {inr(emiMonthly)}/mo</a></p>}
                {ago && !l.sold && <p className="flex items-center gap-1.5"><Clock size={13} />{ago}</p>}
              </div>
              <div className="mt-5">{actions}</div>
              <p className="mt-4 text-[12.5px] text-ink/50 leading-relaxed">Seller phone number and exact address stay private. Our team arranges every visit.</p>
            </div>
          </aside>
        </div>
      </div>

      <div className="hidden lg:block"><SiteFooter /></div>

      {/* Phones: pinned actions */}
      <div className="lg:hidden sticky bottom-0 z-20 bg-white border-t border-line" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="px-4 py-3 grid grid-cols-[3.25rem_1fr_3.25rem] gap-2.5">
          {l.sold ? (
            <span className="col-span-3 h-12 rounded-lg bg-ink/10 text-ink/50 text-[14px] font-semibold flex items-center justify-center">No longer available</span>
          ) : (
            <>
              <a href={callLink(ADMIN_WHATSAPP_NUMBER)} className="h-12 rounded-lg border border-line text-ink flex items-center justify-center" aria-label="Call"><Phone size={19} /></a>
              <button type="button" onClick={() => setVisitOpen(true)} className="btn-primary !h-12"><CalendarCheck size={18} /> Book a visit</button>
              <a href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="h-12 rounded-lg bg-whatsapp text-white flex items-center justify-center"><MessageCircle size={20} /></a>
            </>
          )}
        </div>
      </div>

      {visitOpen && <VisitSheet listing={l} onClose={() => setVisitOpen(false)} />}

      {viewerIndex !== null && (
        <ImmersiveViewer
          images={l.images}
          startIndex={viewerIndex}
          title={l.title}
          saved={saved}
          onToggleSaved={l.sold ? undefined : () => favorites.toggle(l.id)}
          onShare={handleShare}
          shared={shared}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </PageShell>
  );
}
