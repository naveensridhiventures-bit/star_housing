import { useLocation } from "react-router-dom";
import { whatsappLink } from "../lib/whatsapp";
import { ADMIN_WHATSAPP_NUMBER } from "../lib/config";

export default function WhatsAppFab() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/control")) return null;
  return (
    <a
      href={whatsappLink(ADMIN_WHATSAPP_NUMBER, "Hi Star Housing, I'd like to know more about your properties.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Star Housing on WhatsApp"
      className="pulse-ring fixed z-40 right-4 bottom-4 sm:right-6 sm:bottom-6 w-14 h-14 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-xl shadow-whatsapp/40 hover:scale-110 transition-transform pop-in"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.27-1.38A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.33-2 1.4-.52.07-1.17.1-1.9-.12a17 17 0 0 1-1.72-.64c-3-1.3-4.95-4.3-5.1-4.5-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.58c.18 0 .43-.07.67.52.25.6.85 2.07.93 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.32.38-.45.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.05 1.13 1 2.08 1.32 2.38 1.47.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.82 2.02.97.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
      </svg>
    </a>
  );
}
