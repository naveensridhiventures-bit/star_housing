/** Trust chips built from what the seller actually told us. */
export default function Highlights({ items }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Highlights">
      {items.map(({ icon: Icon, text }, i) => (
        <li
          key={text}
          className="fade-up flex items-center gap-1.5 rounded-full bg-[#FFF4D6] text-[#7A5805] ring-1 ring-[#F5B21B]/30 pl-2.5 pr-3 py-1.5 text-[12.5px] font-semibold"
          style={{ "--d": `${200 + i * 70}ms` }}
        >
          <Icon size={14} className="text-[#9A6F06]" />
          {text}
        </li>
      ))}
    </ul>
  );
}
