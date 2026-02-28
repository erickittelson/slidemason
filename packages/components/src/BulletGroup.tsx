export interface BulletGroupProps {
  items: string[];
  className?: string;
}

export function BulletGroup({ items, className = '' }: BulletGroupProps) {
  return (
    <ul className={`space-y-6 text-3xl leading-snug text-[var(--sm-text)] ${className}`.trim()}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="mt-3 h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--sm-primary)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
