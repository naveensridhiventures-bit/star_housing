// Shared colours for the registration flows. The wizard cycles through these
// four, step by step, so every screen feels related but never flat.
export const COLORS = {
  teal: "#0E8C84",
  coral: "#E8336D",
  steel: "#4F46E5",
  sage: "#C0185A",
};

export const STEP_COLORS = [COLORS.steel, COLORS.teal, COLORS.coral, COLORS.sage];

// Small text needs more contrast than a chip or a border does, so the lighter
// colours get a deeper shade whenever they are used for words.
const TEXT_SHADE = { [COLORS.coral]: "#B81D56", [COLORS.sage]: "#9D1148", [COLORS.teal]: "#0B6B66" };
export const textShade = (color) => TEXT_SHADE[color] || color;
