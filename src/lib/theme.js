// Shared colours for the registration flows. The wizard cycles through these
// four, step by step, so every screen feels related but never flat.
export const COLORS = {
  teal: "#0D9488",
  coral: "#EA580C",
  steel: "#2563EB",
  sage: "#B8820A",
};

export const STEP_COLORS = [COLORS.steel, COLORS.teal, COLORS.coral, COLORS.sage];

// Small text needs more contrast than a chip or a border does, so the lighter
// colours get a deeper shade whenever they are used for words.
const TEXT_SHADE = { [COLORS.coral]: "#C2410C", [COLORS.sage]: "#8A6208", [COLORS.teal]: "#0F766E" };
export const textShade = (color) => TEXT_SHADE[color] || color;
