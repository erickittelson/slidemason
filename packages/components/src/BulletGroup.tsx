export interface BulletGroupProps {
  items: string[];
  className?: string;
}

export function BulletGroup({ items, className = '' }: BulletGroupProps) {
  return (
    <ul className={`space-y-2 text-[var(--sm-text)] ${className}`.trim()}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--sm-primary)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
