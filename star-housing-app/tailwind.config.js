/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0B2559", light: "#17408F", dark: "#061734" },
        sky: { DEFAULT: "#2E8BFF", light: "#8CC4FF", soft: "#E7F1FF" },
        gold: { DEFAULT: "#F5B21B", light: "#FFD36B", dark: "#B8820A" },
        snow: { DEFAULT: "#F3F7FE", dim: "#E3ECFA" },
        mediator: "#2563EB",
        seller: "#0D9488",
        buyer: "#EA580C",
        danger: "#DC2626",
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
    },
  },
  plugins: [],
};
