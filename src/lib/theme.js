// Shared colours for the registration flows. The wizard cycles through these
// four, step by step, so every screen feels related but never flat.
export const COLORS = {
  teal: "#0F8A5F",
  coral: "#E8590C",
  steel: "#2563EB",
  sage: "#5B3FE0",
};

export const STEP_COLORS = [COLORS.sage, COLORS.teal, COLORS.coral, COLORS.steel];

// Small text needs more contrast than a chip or a border does, so the lighter
// colours get a deeper shade whenever they are used for words.
const TEXT_SHADE = { [COLORS.coral]: "#C2480A", [COLORS.teal]: "#0B6B49", [COLORS.sage]: "#432BC2" };
export const textShade = (color) => TEXT_SHADE[color] || color;
