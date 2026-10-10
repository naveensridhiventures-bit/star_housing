import { useEffect, useMemo } from "react";
import { MOTIF_NAMES, tileUri, TILE_COLORS } from "../lib/tiles";

const PALETTES = ["peacock", "pink", "indigo", "ink"];

/**
 * One-time reveal for the home photo: a wall of floor tiles that turns over,
 * tile by tile from the top-left, to uncover the picture. It covers the photo
 * for under two seconds and then removes itself.
 */
export default function TileReveal({ cols, rows, onDone }) {
  const tiles = useMemo(
    () =>
      Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return {
          key: i,
          delay: (c + r) * 75,
          image: tileUri(MOTIF_NAMES[(c + r * 2) % MOTIF_NAMES.length], TILE_COLORS[PALETTES[(c + r) % PALETTES.length]]),
        };
      }),
    [cols, rows]
  );

  useEffect(() => {
    const t = setTimeout(onDone, (cols + rows) * 75 + 900);
    return () => clearTimeout(t);
  }, [cols, rows, onDone]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-20 grid pointer-events-none"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {tiles.map((t) => (
        <span
          key={t.key}
          className="tile-flip block"
          style={{ "--d": `${t.delay}ms`, backgroundImage: t.image, backgroundSize: "100% 100%" }}
        />
      ))}
    </div>
  );
}
