/** @type {import('tailwindcss').Config} */
export default {
  // Wrap every hover:/group-hover: style in @media (hover: hover) so taps on
  // phones no longer leave cards stuck lifted/scaled (that caused the jitter).
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Athangudi palette: peacock, bougainvillea, indigo on mint-white
        navy: { DEFAULT: "#07323A", light: "#0E5B63", dark: "#031E23" },
        sky: { DEFAULT: "#14A89E", light: "#7FD6CE", soft: "#E3F1EC" },
        snow: { DEFAULT: "#F0F7F3", dim: "#DCEBE4" },
        danger: "#DC2626",
        // Semantic names used across the app
        ink: { DEFAULT: "#07323A", light: "#0E5B63", dark: "#031E23" },
        paper: { DEFAULT: "#F0F7F3", dim: "#DCEBE4" },
        gold: { DEFAULT: "#FF5C8A", light: "#FF9DB9", dark: "#C0185A" },
        peacock: { DEFAULT: "#0E8C84", dark: "#0B6B66", light: "#7FD6CE" },
        canvas: "#F0F7F3",
        teal: "#0E8C84",
        surface: "#FFFFFF",
        coral: "#DC2626",
        sage: "#5B9F96",
        steel: "#4F46E5",
        mediator: "#4F46E5",
        seller: "#0E8C84",
        buyer: "#E8336D",
        whatsapp: "#25D366",
      },
      borderRadius: {
        // Tile-square corners instead of soft blobs
        xl: "10px",
        "2xl": "13px",
        "3xl": "16px",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque Variable'", "'Bricolage Grotesque'", "system-ui", "sans-serif"],
        body: ["'Bricolage Grotesque Variable'", "'Bricolage Grotesque'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(14,140,132,0.45)",
        gold: "0 10px 30px -8px rgba(255,92,138,0.5)",
        soft: "0 3px 0 0 rgba(7,50,58,0.08), 0 14px 30px -20px rgba(7,50,58,0.35)",
        tile: "0 4px 0 0 rgba(7,50,58,0.9)",
      },
    },
  },
  plugins: [],
};
