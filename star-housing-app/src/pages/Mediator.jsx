import { useState } from "react";
import RoleBadge from "../components/RoleBadge";
import PageHero from "../components/PageHero";
import ImageUploader from "../components/ImageUploader";
import { addMediatorLead } from "../lib/api";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";

const ACCENT = "#2563EB";

export default function Mediator() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    instaRef: "",
    propertyTitle: "",
    location: "",
    price: "",
    message: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.propertyTitle) return;
    setStatus("saving");
    setErrorMsg("");
    try {
      await addMediatorLead({ ...form, imageUrl });
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Could not save — check your connection and try again.");
      setStatus("error");
    }
  }

  const waMessage =
    `New mediator lead — ${form.propertyTitle || "(property)"}\n` +
    `From: ${form.name} (${form.phone})\n` +
    `Insta reference: ${form.instaRef || "—"}\n` +
    `Location: ${form.location || "—"}\n` +
    `Price: ${form.price || "—"}\n` +
    `Note: ${form.message || "—"}`;

  if (status === "done") {
    return (
      <div className="max-w-md mx-auto px-5 pt-16 text-center">
        <span className="pop-in inline-block"><RoleBadge label="Received" color={ACCENT} size={80} rotate={-10} /></span>
        <h1 className="font-display font-extrabold text-2xl text-navy mt-5 mb-2">
          Saved to our records
        </h1>
        <p className="text-navy/60 mb-7 leading-relaxed">
          Your listing for <strong>{form.propertyTitle}</strong> is logged. Send it to us on
          WhatsApp now so we can start the conversation right away.
        </p>
        <a
          href={whatsappLink(ADMIN_WHATSAPP_NUMBER, waMessage)}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp w-full"
        >
          Message admin on WhatsApp
        </a>
        <a href="/mediator" className="block mt-4 text-sm text-navy/50 hover:text-navy">
          Submit another property
        </a>
      </div>
    );
  }

  return (
    <>
      <PageHero label="Mediator" eyebrow="Bring the deal" title="Mediator details" subtitle="Share the listing you spotted — we connect with you on WhatsApp." accent={ACCENT} />
      <div className="max-w-lg mx-auto px-5 pb-20 -mt-10 relative z-10 fade-up">

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="field-label">Your name</label>
          <input className="field-input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" required />
        </div>
        <div>
          <label className="field-label">Your phone / WhatsApp number</label>
          <input className="field-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="10-digit number" required />
        </div>
        <div>
          <label className="field-label">Which Instagram video / post?</label>
          <input className="field-input" value={form.instaRef} onChange={(e) => update("instaRef", e.target.value)} placeholder="Paste the reel link or describe it" />
        </div>
        <div>
          <label className="field-label">Property title</label>
          <input className="field-input" value={form.propertyTitle} onChange={(e) => update("propertyTitle", e.target.value)} placeholder="e.g. 2BHK near Anna Nagar" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Location</label>
            <input className="field-input" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Area, city" />
          </div>
          <div>
            <label className="field-label">Price</label>
            <input className="field-input" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="₹ amount" />
          </div>
        </div>
        <div>
          <label className="field-label">Message for admin</label>
          <textarea className="field-input min-h-[90px]" value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Anything admin should know" />
        </div>
        <div>
          <label className="field-label">Property photo</label>
          <ImageUploader accentColor={ACCENT} onUploaded={setImageUrl} />
        </div>

        {errorMsg && <p className="text-sm text-danger">{errorMsg}</p>}

        <button type="submit" disabled={status === "saving"} className="btn-primary w-full">
          {status === "saving" ? "Saving…" : "Save & continue to WhatsApp"}
        </button>
      </form>
    </div>
    </>
  );
}
