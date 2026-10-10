// Star Housing mark — house outline, golden orbit swoosh and a star.
function starPath(cx, cy, R, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

export function StarShape({ className = "", size = 16, color = "#FF5C8A" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={starPath(12, 12.5, 11, 4.6)} fill={color} />
    </svg>
  );
}

export default function Logo({ size = 44, tone = "dark", className = "" }) {
  const body = tone === "light" ? "#FFFFFF" : "#07323A";
  return (
    <svg className={className} width={size} height={size * 0.86} viewBox="0 0 120 100" aria-hidden="true">
      <defs>
        <linearGradient id={`sw-${tone}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#E8336D" />
          <stop offset="1" stopColor="#FF9DB9" />
        </linearGradient>
      </defs>
      <path d="M20 50 L56 22 L92 50" fill="none" stroke={body} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 46 V82 H82 V46" fill="none" stroke={body} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="52" width="24" height="22" rx="2" fill="none" stroke={body} strokeWidth="3.5" />
      <path d="M56 52 V74 M44 63 H68" stroke={body} strokeWidth="3" />
      <path d="M8 86 C -2 56 34 28 88 32" fill="none" stroke={`url(#sw-${tone})`} strokeWidth="6" strokeLinecap="round" />
      <path d={starPath(90, 26, 17, 7)} fill="#FF5C8A" />
    </svg>
  );
}
