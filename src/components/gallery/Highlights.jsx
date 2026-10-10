/** Trust chips built from what the seller actually told us. */
export default function Highlights({ items }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Highlights">
      {items.map(({ icon: Icon, text }) => (
        <li
          key={text}
          className="flex items-center gap-1.5 rounded-md bg-brand-soft text-brand-dark pl-2.5 pr-3 py-1.5 text-[13px] font-semibold"
        >
          <Icon size={14} className="text-brand" />
          {text}
        </li>
      ))}
    </ul>
  );
}
