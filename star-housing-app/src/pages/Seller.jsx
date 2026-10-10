import { useState } from "react";
import RoleBadge from "../components/RoleBadge";
import PageHero from "../components/PageHero";
import ImageUploader from "../components/ImageUploader";
import { addSellerLead } from "../lib/api";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";

const ACCENT = "#0D9488";

export default function Seller() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    propertyType: "House",
    location: "",
    price: "",
    details: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.price) return;
    setStatus("saving");
    setErrorMsg("");
    try {
      await addSellerLead({ ...form, imageUrl });
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Could not save — check your connection and try again.");
      setStatus("error");
    }
  }

  const waMessage =
    `New seller listing — ${form.propertyType}\n` +
    `From: ${form.name} (${form.phone})\n` +
    `Location: ${form.location}\n` +
    `Price: ${form.price}\n` +
    `Details: ${form.details || "—"}`;

  if (status === "done") {
    return (
      <div className="max-w-md mx-auto px-5 pt-16 text-center">
        <span className="pop-in inline-block"><RoleBadge label="Listed" color={ACCENT} size={80} rotate={6} /></span>
        <h1 className="font-display font-extrabold text-2xl text-navy mt-5 mb-2">
          Your property is on record
        </h1>
        <p className="text-navy/60 mb-7 leading-relaxed">
          We've saved your <strong>{form.propertyType.toLowerCase()}</strong> in {form.location}.
          Send it across on WhatsApp and we'll follow up with you directly.
        </p>
        <a
          href={whatsappLink(ADMIN_WHATSAPP_NUMBER, waMessage)}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp w-full"
        >
          Message admin on WhatsApp
        </a>
        <a href="/seller" className="block mt-4 text-sm text-navy/50 hover:text-navy">
          List another property
        </a>
      </div>
    );
  }

  return (
    <>
      <PageHero label="Seller" eyebrow="List your property" title="Seller details" subtitle="Tell us about your property and our team follows up directly." accent={ACCENT} />
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
          <label className="field-label">Property type</label>
          <select className="field-input" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
            <option>House</option>
            <option>Shop</option>
            <option>Land / Plot</option>
            <option>Apartment</option>
            <option>Other</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Location</label>
            <input className="field-input" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Area, city" required />
          </div>
          <div>
            <label className="field-label">Price</label>
            <input className="field-input" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="₹ amount" required />
          </div>
        </div>
        <div>
          <label className="field-label">Full details</label>
          <textarea className="field-input min-h-[110px]" value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Size, rooms, amenities, condition, why you're selling — anything a buyer should know" />
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
