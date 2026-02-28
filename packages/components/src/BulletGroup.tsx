export interface BulletGroupProps {
  items: string[];
  className?: string;
}

export function BulletGroup({ items, className = '' }: BulletGroupProps) {
  return (
    <ul className={`space-y-4 text-2xl text-[var(--sm-text)] ${className}`.trim()}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2.5 h-3 w-3 shrink-0 rounded-full bg-[var(--sm-primary)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
