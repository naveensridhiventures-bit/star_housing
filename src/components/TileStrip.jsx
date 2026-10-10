import { tileUri, TILE_COLORS } from "../lib/tiles";

// A running band of floor tile, used as an edge between sections.
export default function TileStrip({ kind = "corners", palette = "ink", size = 26, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height: size,
        backgroundImage: tileUri(kind, TILE_COLORS[palette]),
        backgroundSize: `${size}px ${size}px`,
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}
