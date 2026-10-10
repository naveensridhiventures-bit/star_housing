/** @type {import('tailwindcss').Config} */
export default {
  // Wrap every hover:/group-hover: style in @media (hover: hover) so taps on
  // phones no longer leave cards stuck lifted/scaled (that caused the jitter).
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Star Estate palette: ink, iris violet, cool canvas
        ink: { DEFAULT: "#0F1424", light: "#2A3150", dark: "#090C17" },
        brand: { DEFAULT: "#5B3FE0", dark: "#432BC2", light: "#A99BFF", soft: "#EEEAFE" },
        // The app's older semantic names now point at the new palette
        navy: { DEFAULT: "#0F1424", light: "#2A3150", dark: "#090C17" },
        gold: { DEFAULT: "#5B3FE0", light: "#A99BFF", dark: "#432BC2" },
        sky: { DEFAULT: "#7B61FF", light: "#B9AEFF", soft: "#ECEEF8" },
        snow: { DEFAULT: "#F5F6FA", dim: "#E2E5F2" },
        paper: { DEFAULT: "#F5F6FA", dim: "#E2E5F2" },
        peacock: { DEFAULT: "#0F8A5F", dark: "#0B6B49", light: "#CDEBDD" },
        canvas: "#F5F6FA",
        surface: "#FFFFFF",
        line: "#E3E6EF",
        teal: "#0F8A5F",
        coral: "#DC2626",
        danger: "#DC2626",
        sage: "#7C8AB8",
        steel: "#2563EB",
        mediator: "#5B3FE0",
        seller: "#0F8A5F",
        buyer: "#E8590C",
        whatsapp: "#25D366",
      },
      borderRadius: { xl: "10px", "2xl": "12px", "3xl": "16px" },
      fontFamily: {
        display: ["'Newsreader Variable'", "Newsreader", "Georgia", "serif"],
        body: ["'Hanken Grotesk Variable'", "'Hanken Grotesk'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 12px 30px -12px rgba(91,63,224,0.5)",
        gold: "0 12px 30px -12px rgba(91,63,224,0.5)",
        soft: "0 1px 2px rgba(15,20,36,0.06), 0 10px 26px -14px rgba(15,20,36,0.22)",
        lift: "0 2px 4px rgba(15,20,36,0.06), 0 22px 40px -18px rgba(15,20,36,0.35)",
      },
    },
  },
  plugins: [],
};
