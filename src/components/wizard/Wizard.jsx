import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Pencil, Clock, RotateCcw, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import BrandHeader from "./BrandHeader";
import Logo from "../Logo";
import { APP_NAME } from "../../lib/config";
import SuccessCheck from "../gallery/SuccessCheck";
import { STEP_COLORS, textShade } from "../../lib/theme";

const primaryBtn =
  "rip relative flex-1 h-14 rounded-full text-white text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 " +
  "transition-[transform,opacity,box-shadow] active:scale-[0.98] shadow-[0_12px_24px_-12px_var(--accent)]";

const hasValues = (form) => Object.values(form).some((v) => String(v ?? "").trim() !== "");

/**
 * One-question-at-a-time flow shared by Buyer, Seller and Mediator.
 *
 * Screens run: landing → each step → review → success.
 *   - Each step has its own validity rule. Continue looks muted until it
 *     passes; pressing it early shakes and tells you what's missing.
 *   - Steps flagged `auto` (a single tap answers them) move on by themselves.
 *   - Steps flagged `optional` can be skipped straight to the review.
 *   - Answers are kept on this device as you go, so a refresh or a phone
 *     call doesn't lose them; the landing offers to pick up where you left.
 *   - A "so far" strip of chips builds up as you answer.
 *   - The review lists every answer; tapping a row jumps back to that step
 *     and returns straight to the review when you save.
 *
 * Props
 *   role          "Buyer" | "Seller" | "Mediator"
 *   initialForm   starting form values (same keys the backend already expects)
 *   landing       { title, subtitle, note, items: [{ label, text, color }], cta }
 *   steps         [{ label, title, hint, optional, auto, valid(form), render(form, set, ctx) }]
 *   chips         (form) => string[]   short answers shown as the "so far" strip
 *   reviewTitle, reviewNote
 *   reviewRows    (form) => [{ label, value, step }]   (empty values are hidden)
 *   submit        async (form) => void
 *   submitLabel   text on the final button
 *   success       { title, text(form), next: [{ title, text }], primary(form), againLabel }
 */
export default function Wizard({
  role,
  initialForm,
  landing,
  steps,
  chips,
  reviewTitle,
  reviewNote,
  reviewRows,
  submit,
  submitLabel,
  success,
}) {
  const draftKey = `star_draft_${role.toLowerCase()}_v1`;
  const [form, setForm] = useState(initialForm);
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [error, setError] = useState("");
  const [fromReview, setFromReview] = useState(false);
  const [shake, setShake] = useState(0);
  const [autoTick, setAutoTick] = useState(0);
  const [draft, setDraft] = useState(() => {
    try {
      const d = JSON.parse(localStorage.getItem(draftKey) || "null");
      return d && d.form && hasValues(d.form) ? d : null;
    } catch {
      return null;
    }
  });
  const titleRef = useRef(null);
  const stepRef = useRef(null);

  const n = steps.length;
  const reviewPos = n + 1;
  const successPos = n + 2;
  const atLanding = pos === 0;
  const atReview = pos === reviewPos;
  const atSuccess = pos === successPos;
  const step = pos >= 1 && pos <= n ? steps[pos - 1] : null;

  const color = STEP_COLORS[pos % STEP_COLORS.length];
  const textColor = textShade(color);
  const allValid = steps.every((s) => Boolean(s.valid(form)));
  const canContinue = atLanding ? true : atReview ? allValid : step ? Boolean(step.valid(form)) : true;
  const chipList = useMemo(() => (chips ? chips(form).filter(Boolean) : []), [chips, form]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (step?.auto && value) setAutoTick((t) => t + 1);
  }

  // Keep answers on this device while the person is mid-way.
  useEffect(() => {
    if (atSuccess || status === "done") return;
    try {
      if (hasValues(form)) localStorage.setItem(draftKey, JSON.stringify({ form, pos: Math.min(pos, reviewPos) }));
    } catch {
      // storage unavailable: the form still works
    }
  }, [form, pos, atSuccess, status, draftKey, reviewPos]);

  function clearDraft() {
    setDraft(null);
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  }

  // New screen → back to the top, move focus to the heading for screen readers,
  // and on a computer put the cursor in the first text box.
  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus({ preventScroll: true });
    if (step && window.matchMedia?.("(pointer: fine)").matches) {
      const t = setTimeout(() => stepRef.current?.querySelector("input:not([type=range]), textarea")?.focus({ preventScroll: true }), 420);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [pos, step]);

  function go(next, direction = 1) {
    setDir(direction);
    setPos(next);
  }

  function goNext() {
    if (!canContinue) {
      setShake((s) => s + 1);
      return;
    }
    if (fromReview) {
      setFromReview(false);
      go(reviewPos);
      return;
    }
    go(pos + 1);
  }
  const goNextRef = useRef(goNext);
  useEffect(() => {
    goNextRef.current = goNext;
  });

  // A tap that fully answers an `auto` step moves on after a beat, so the pop is seen.
  useEffect(() => {
    if (!autoTick || !step?.auto || !canContinue) return undefined;
    const t = setTimeout(() => goNextRef.current(), 480);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTick]);

  function goBack() {
    if (fromReview) {
      setFromReview(false);
      go(reviewPos, -1);
      return;
    }
    go(Math.max(0, pos - 1), -1);
  }

  function editStep(i) {
    setFromReview(true);
    go(i);
  }

  async function handleSubmit() {
    if (!allValid) {
      setShake((s) => s + 1);
      return;
    }
    if (status === "saving") return;
    setStatus("saving");
    setError("");
    try {
      await submit(form);
      setStatus("done");
      clearDraft();
      go(successPos);
    } catch (err) {
      setError(err.message || "Could not save. Check your connection and try again.");
      setStatus("error");
    }
  }

  function reset() {
    setForm(initialForm);
    setStatus("idle");
    setError("");
    setFromReview(false);
    go(0, -1);
  }

  function resume() {
    setForm({ ...initialForm, ...draft.form });
    go(Math.max(1, draft.pos || 1));
  }

  function startFresh() {
    clearDraft();
    setForm(initialForm);
  }

  function onFormSubmit(e) {
    e.preventDefault();
    if (atReview) handleSubmit();
    else goNext();
  }

  // Progress: how far through, with a friendly time left.
  const fraction = atLanding ? 0 : Math.min(1, pos / reviewPos);
  const secsLeft = Math.max(0, (reviewPos - pos) * 12 + 8);
  const timeLeft = secsLeft <= 20 ? "Almost done" : secsLeft <= 45 ? "About half a minute left" : `About ${Math.ceil(secsLeft / 60)} min left`;
  const stepWord = atReview ? "Final check" : `Step ${pos} of ${n}`;

  const title = atLanding ? landing.title : atReview ? reviewTitle : atSuccess ? success.title : step.title;
  const subtitle = atLanding ? landing.subtitle : atReview ? reviewNote : atSuccess ? "" : step?.hint;

  const rows = atReview ? reviewRows(form).filter((r) => r.value !== "" && r.value != null) : [];
  const successAction = atSuccess && success.primary ? success.primary(form) : null;
  const approxMins = Math.max(1, Math.round((n * 12) / 60));

  const stages = [...steps.map((s) => s.label || s.title), "Review"];
  const stageNow = atLanding ? -1 : atSuccess ? stages.length : pos - 1;

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[26rem_minmax(0,1fr)] xl:grid-cols-[30rem_minmax(0,1fr)]">
      <aside className="hidden lg:flex sticky top-0 h-screen flex-col relative isolate overflow-hidden bg-ink-dark text-white p-10 xl:p-12">
        <img src="/brand/globe.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-10 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-dark/70 via-ink-dark/80 to-ink-dark" aria-hidden="true" />
        <Link to="/" className="flex items-center gap-3" aria-label="Star Housing home">
          <Logo size={40} tone="light" />
          <span className="font-display font-semibold text-[1.35rem] leading-none">{APP_NAME}</span>
        </Link>
        <div className="mt-auto">
          <p className="text-brand-light text-[14px] font-semibold">{role} registration</p>
          <h2 className="mt-2 font-display text-[2.4rem] leading-[1.05] text-balance">{landing.title}</h2>
          <ol className="mt-8 space-y-0" aria-label="Progress">
            {stages.map((label, i) => {
              const done = i < stageNow;
              const here = i === stageNow;
              return (
                <li key={label + i} className="flex items-stretch gap-4">
                  <span className="flex flex-col items-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[12.5px] font-bold border-2 transition-colors ${
                        done ? "bg-brand-light border-brand-light text-ink-dark" : here ? "border-white text-white" : "border-white/25 text-white/40"
                      }`}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </span>
                    {i < stages.length - 1 && <span className={`w-0.5 flex-1 min-h-[1rem] ${done ? "bg-brand-light" : "bg-white/20"}`} />}
                  </span>
                  <span className={`pb-4 pt-0.5 text-[15px] ${here ? "text-white font-semibold" : done ? "text-white/80" : "text-white/45"}`}>{label}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-[13px] text-white/55 leading-relaxed">Your answers are saved on this device as you go. A person on our team reads every submission.</p>
        </div>
      </aside>

      <div className="min-w-0">
      <div
        className="mx-auto w-full max-w-md lg:max-w-xl min-h-[100dvh] lg:min-h-0 lg:my-12 bg-surface lg:rounded-2xl lg:border lg:border-line lg:shadow-soft flex flex-col overflow-x-clip"
        style={{ "--accent": color }}
      >
        <BrandHeader color={color} className="lg:hidden" />

        <form onSubmit={onFormSubmit} noValidate className="flex-1 flex flex-col">
          <div key={pos} ref={stepRef} className={`flex-1 px-5 pt-6 pb-8 ${dir >= 0 ? "step-fwd" : "step-back"}`}>
            {/* Progress: a track that fills with a glowing head, plus where you are and time left */}
            {!atLanding && !atSuccess && (
              <div className="mb-6 lg:hidden">
                <div className="flex items-center justify-between text-[12.5px] font-semibold mb-2.5">
                  <span style={{ color: textColor }}>{stepWord}</span>
                  <span className="flex items-center gap-1.5 text-ink/45"><Clock size={12} />{timeLeft}</span>
                </div>
                <div
                  className="relative h-2 mx-2 rounded-full bg-ink/[0.08]"
                  role="progressbar"
                  aria-label={`${role} form progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(fraction * 100)}
                >
                  <span className="progress-fill absolute inset-y-0 left-0 rounded-full" style={{ width: `${fraction * 100}%`, backgroundColor: color }} />
                  <span className="progress-head absolute top-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full ring-[3px] ring-white shadow" style={{ left: `${fraction * 100}%`, backgroundColor: color }} />
                </div>
              </div>
            )}

            {/* The "so far" strip: each answer drops in as a chip */}
            {step && chipList.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-1.5" aria-label="Your answers so far">
                {chipList.map((c) => (
                  <span key={c} className="chip-pop text-[12px] font-semibold rounded-full px-3 py-1 bg-ink/[0.05] text-ink/70 ring-1 ring-ink/[0.06]">{c}</span>
                ))}
              </div>
            )}

            {atSuccess ? (
              <div className="flex flex-col items-center text-center pt-2">
                <SuccessCheck size={92} />
                <h1 ref={titleRef} tabIndex={-1} className="mt-5 font-display font-bold text-[1.6rem] leading-tight text-ink outline-none text-balance">
                  {title}
                </h1>
                <p className="mt-3 text-[14.5px] text-ink/60 leading-relaxed max-w-xs">{success.text(form)}</p>

                {chipList.length > 0 && (
                  <div className="receipt-in mt-6 w-full rounded-3xl bg-[#F6F7FB] ring-1 ring-ink/[0.06] p-4 text-left">
                    <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink/55"><ShieldCheck size={14} className="text-[#0B6B49]" /> What we received</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {chipList.map((c) => <span key={c} className="text-[12.5px] font-semibold rounded-full px-3 py-1 bg-white ring-1 ring-ink/[0.08] text-ink/75">{c}</span>)}
                    </div>
                  </div>
                )}

                {success.next?.length > 0 && (
                  <ol className="mt-7 w-full text-left space-y-4" aria-label="What happens next">
                    {success.next.map((s, i) => (
                      <li key={s.title} className="next-item flex gap-3.5" style={{ "--i": i }}>
                        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-display font-bold text-[14px]" style={{ backgroundColor: STEP_COLORS[i % STEP_COLORS.length] }}>{i + 1}</span>
                        <span>
                          <span className="block font-semibold text-[15px] text-ink leading-snug">{s.title}</span>
                          <span className="block text-[13.5px] text-ink/55 leading-snug mt-0.5">{s.text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}

                <div className="w-full mt-8 space-y-3">
                  {successAction && (
                    <a
                      href={successAction.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rip btn-shine w-full h-14 rounded-full bg-whatsapp text-white text-[15px] font-bold flex items-center justify-center shadow-[0_14px_28px_-12px_rgba(37,211,102,0.8)] active:scale-[0.98] transition-transform"
                    >
                      {successAction.label}
                    </a>
                  )}
                  <Link to="/gallery" className="rip w-full h-14 rounded-full bg-ink text-white text-[15px] font-bold flex items-center justify-center active:scale-[0.98] transition-transform">
                    Browse the property gallery
                  </Link>
                  <button type="button" onClick={reset} className="rip w-full h-12 rounded-full border border-ink/20 text-ink text-[14px] font-semibold hover:bg-ink/5 transition-colors">
                    {success.againLabel || "Register another"}
                  </button>
                  <Link to="/" className="block text-[13px] text-ink/50 hover:text-ink pt-2">
                    Back to home
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 ref={titleRef} tabIndex={-1} className="font-display font-bold text-[1.65rem] leading-[1.15] text-ink outline-none text-balance">
                  {title}
                </h1>
                {subtitle && <p className="mt-2 text-[14.5px] text-ink/55 leading-relaxed">{subtitle}</p>}
                {step?.optional && (
                  <p className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink/60 bg-ink/5 rounded-full px-3 py-1">
                    <Sparkles size={12} /> Optional, skip any time
                  </p>
                )}

                {atLanding && (
                  <div className="mt-6 space-y-3 stagger">
                    {draft && (
                      <div className="welcome-in rounded-2xl bg-[#EEEAFE] ring-1 ring-[#5B3FE0]/40 p-4">
                        <p className="font-display font-bold text-[1.05rem] text-ink flex items-center gap-2"><RotateCcw size={16} className="text-[#432BC2]" /> Welcome back{draft.form.name ? `, ${draft.form.name.trim().split(" ")[0]}` : ""}</p>
                        <p className="text-[13.5px] text-ink/60 mt-1">You have an unfinished form on this device. Pick up where you left off?</p>
                        <div className="mt-3 flex gap-2.5">
                          <button type="button" onClick={resume} className="rip h-11 flex-1 rounded-full bg-ink text-white text-[14px] font-bold active:scale-[0.98] transition-transform">Continue</button>
                          <button type="button" onClick={startFresh} className="rip h-11 px-5 rounded-full border border-ink/20 text-[14px] font-semibold text-ink/70 active:scale-[0.98] transition-transform">Start fresh</button>
                        </div>
                      </div>
                    )}
                    {landing.items.map((it, i) => (
                      <div
                        key={it.label}
                        className="rounded-2xl border-2 px-4 py-3.5 flex items-start gap-3.5"
                        style={{ "--i": i, borderColor: it.color, backgroundColor: `color-mix(in srgb, ${it.color} 6%, white)` }}
                      >
                        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-display font-bold text-[14px]" style={{ backgroundColor: it.color }}>{i + 1}</span>
                        <span>
                          <span className="block text-[15px] font-bold" style={{ color: textShade(it.color) }}>{it.label}</span>
                          <span className="block text-[13.5px] text-ink/65 mt-0.5 leading-snug">{it.text}</span>
                        </span>
                      </div>
                    ))}
                    <p className="flex items-center gap-2 text-[12.5px] text-ink/50 pt-1.5">
                      <Clock size={13} className="shrink-0" /> About {approxMins} minute{approxMins === 1 ? "" : "s"}. Your answers are saved on this device as you go.
                    </p>
                    {landing.note && <p className="text-[12.5px] text-ink/45">{landing.note}</p>}
                  </div>
                )}

                {step && <div className="mt-6">{step.render(form, update, { n, pos })}</div>}

                {atReview && (
                  <ul className="mt-5 divide-y divide-ink/[0.07] stagger">
                    {rows.map((r, i) => (
                      <li key={r.label} style={{ "--i": Math.min(i, 14) * 0.5 }}>
                        <button
                          type="button"
                          onClick={() => editStep(r.step)}
                          aria-label={`Edit ${r.label}`}
                          className="group w-full flex items-start justify-between gap-4 py-3.5 text-left"
                        >
                          <span className="text-[13px] font-semibold text-ink/50 pt-px shrink-0">{r.label}</span>
                          <span className="flex items-start gap-2 min-w-0 text-[14.5px] font-semibold text-ink text-right">
                            <span className="break-words min-w-0">{r.value}</span>
                            <Pencil size={13} className="text-ink/25 mt-1 shrink-0 transition-colors group-hover:text-[color:var(--accent)]" />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Footer: stays pinned to the bottom of the screen on phones */}
          {!atSuccess && (
            <div
              className="sticky bottom-0 bg-surface/95 backdrop-blur border-t border-ink/5 px-5 pt-3 lg:rounded-b-2xl"
              style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
            >
              {error && (
                <p className="alert-error mb-3">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </p>
              )}
              {!canContinue && !atLanding && (
                <p key={shake} className={`text-[13px] text-center mb-2.5 ${shake ? "shake text-coral font-semibold" : "text-ink/50"}`} role="status">
                  {atReview ? "Some required answers are missing. Tap Back to fill them in." : "Answer the starred questions to continue."}
                </p>
              )}
              <div className="flex gap-3">
                {!atLanding && (
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="rip w-14 h-14 rounded-full border border-ink/15 text-ink flex items-center justify-center shrink-0 hover:bg-ink/5 transition-colors active:scale-95"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                {atReview ? (
                  <button
                    type="submit"
                    aria-disabled={!allValid || status === "saving"}
                    className={`${primaryBtn} bg-coral ${status === "saving" ? "btn-saving overflow-hidden" : ""} ${!allValid ? "opacity-50" : ""}`}
                    style={{ "--accent": "#DC2626" }}
                  >
                    {status === "saving" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Saving
                      </>
                    ) : (
                      submitLabel
                    )}
                  </button>
                ) : (
                  <button
                    key={shake}
                    type="submit"
                    aria-disabled={!canContinue}
                    className={`${primaryBtn} bg-ink ${!canContinue ? "opacity-45 " : ""}${shake && !canContinue ? "shake" : ""}`}
                  >
                    {atLanding ? landing.cta || "Get started" : fromReview ? "Save changes" : "Continue"}
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
              {step?.optional && !fromReview && allValid && (
                <button type="button" onClick={() => go(reviewPos)} className="block mx-auto mt-2.5 text-[13.5px] font-semibold text-ink/55 hover:text-ink underline underline-offset-4">
                  Skip the rest and review
                </button>
              )}
              {atLanding && (
                <Link to="/" className="block text-center text-[13px] text-ink/50 hover:text-ink mt-3">
                  Back to home
                </Link>
              )}
            </div>
          )}
        </form>
      </div>
      </div>
    </div>
  );
}
