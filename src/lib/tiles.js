// Athangudi-style floor tiles, drawn as SVG and used as repeating backgrounds.
// Four motifs; each takes a background and two ink colours.
const MOTIFS = {
  // quarter circles meeting at the corners
  corners: ({ bg, a, b }) =>
    `<rect width="80" height="80" fill="${bg}"/>` +
    `<path d="M0 0H40A40 40 0 0 1 0 40Z" fill="${a}"/><path d="M80 80H40A40 40 0 0 1 80 40Z" fill="${a}"/>` +
    `<path d="M80 0V40A40 40 0 0 1 40 0Z" fill="${b}"/><path d="M0 80V40A40 40 0 0 1 40 80Z" fill="${b}"/>`,
  // nested diamonds
  diamonds: ({ bg, a, b }) =>
    `<rect width="80" height="80" fill="${bg}"/>` +
    `<path d="M40 3L77 40L40 77L3 40Z" fill="${a}"/><path d="M40 15L65 40L40 65L15 40Z" fill="${bg}"/>` +
    `<path d="M40 27L53 40L40 53L27 40Z" fill="${b}"/>`,
  // four-petal flower
  flower: ({ bg, a, b }) =>
    `<rect width="80" height="80" fill="${bg}"/>` +
    `<circle cx="22" cy="40" r="19" fill="${a}"/><circle cx="58" cy="40" r="19" fill="${a}"/>` +
    `<circle cx="40" cy="22" r="19" fill="${b}"/><circle cx="40" cy="58" r="19" fill="${b}"/>` +
    `<circle cx="40" cy="40" r="8" fill="${bg}"/>`,
  // eight-point star
  star8: ({ bg, a, b }) =>
    `<rect width="80" height="80" fill="${bg}"/>` +
    `<rect x="14" y="14" width="52" height="52" fill="${a}"/>` +
    `<rect x="14" y="14" width="52" height="52" fill="${b}" transform="rotate(45 40 40)"/>` +
    `<circle cx="40" cy="40" r="9" fill="${bg}"/>`,
};

export const MOTIF_NAMES = Object.keys(MOTIFS);

export function tileUri(kind, colors) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${MOTIFS[kind](colors)}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// The palette the tiles are painted with
export const TILE_COLORS = {
  peacock: { bg: "#F0F7F3", a: "#0E8C84", b: "#07323A" },
  pink: { bg: "#F0F7F3", a: "#FF5C8A", b: "#07323A" },
  indigo: { bg: "#F0F7F3", a: "#4F46E5", b: "#FF5C8A" },
  ink: { bg: "#07323A", a: "#0E8C84", b: "#FF5C8A" },
};
