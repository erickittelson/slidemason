export interface BulletGroupProps {
  items: string[];
  className?: string;
}

export function BulletGroup({ items, className = '' }: BulletGroupProps) {
  return (
    <ul className={`flex flex-col text-[var(--sm-text)] ${className}`.trim()} style={{ fontSize: 'clamp(1.1rem, 2vw, 1.875rem)' }}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="mt-2.5 h-3 w-3 shrink-0 rounded-full bg-[var(--sm-primary)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
