import { useId } from "react";
import { StarShape } from "./Logo";

// Rotating-text ring badge with a star in the centre.
export default function RoleBadge({ label, color = "#0B2559", size = 88, rotate = 0 }) {
  const id = useId().replace(/:/g, "");
  return (
    <span
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="spin-slow absolute inset-0">
        <defs>
          <path id={id} d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" />
        </defs>
        <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="1.5 4" opacity="0.55" />
        <text fill={color} fontSize="11.5" fontWeight="800" letterSpacing="3.2" fontFamily="Montserrat, sans-serif">
          <textPath href={`#${id}`} startOffset="0">
            {`${(label || "").toUpperCase()} • ${(label || "").toUpperCase()} • `}
          </textPath>
        </text>
      </svg>
      <span
        className="relative rounded-full flex items-center justify-center"
        style={{ width: size * 0.5, height: size * 0.5, background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 8px 20px -6px ${color}99` }}
      >
        <StarShape size={size * 0.28} color="#FFD36B" className="twinkle" />
      </span>
    </span>
  );
}
