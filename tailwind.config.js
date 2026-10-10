/** @type {import('tailwindcss').Config} */
export default {
  // Wrap every hover:/group-hover: style in @media (hover: hover) so taps on
  // phones no longer leave cards stuck lifted/scaled (that caused the jitter).
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Star Housing palette ─────────────────────────────
        navy: { DEFAULT: "#0B2559", light: "#17408F", dark: "#061734" },
        sky: { DEFAULT: "#2E8BFF", light: "#8CC4FF", soft: "#E7F1FF" },
        snow: { DEFAULT: "#F3F7FE", dim: "#E3ECFA" },
        danger: "#DC2626",
        // ── Semantic names used across the app (mapped to Star) ──
        ink: { DEFAULT: "#0B2559", light: "#17408F", dark: "#061734" },
        paper: { DEFAULT: "#F3F7FE", dim: "#E3ECFA" },
        gold: { DEFAULT: "#F5B21B", light: "#FFD36B", dark: "#B8820A" },
        canvas: "#F3F7FE",
        teal: "#0D9488",
        surface: "#FFFFFF",
        coral: "#DC2626",
        sage: "#5B9F96",
        steel: "#2563EB",
        mediator: "#2563EB",
        seller: "#0D9488",
        buyer: "#EA580C",
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["Montserrat", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(46,139,255,0.45)",
        gold: "0 10px 30px -8px rgba(245,178,27,0.55)",
        soft: "0 10px 40px -18px rgba(11,37,89,0.35)",
      },
      backgroundImage: {
        grain: "radial-gradient(#0B255908 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "16px 16px",
      },
    },
  },
  plugins: [],
};
