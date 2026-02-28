export interface BulletGroupProps {
  items: string[];
  className?: string;
}

export function BulletGroup({ items, className = '' }: BulletGroupProps) {
  return (
    <ul className={`flex flex-col gap-[clamp(0.75rem,1.5vh,1.5rem)] text-[var(--sm-text)] ${className}`.trim()} style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
      {items.map((item, i) => (
        <li key={i} className={`sm-fade-up sm-stagger-${i + 1} flex items-baseline gap-[clamp(0.5rem,1vw,1rem)]`}>
          <span className="relative top-[-0.05em] h-[0.45em] w-[0.45em] shrink-0 rounded-full bg-[var(--sm-primary)]" />
          <span style={{ lineHeight: 1.4 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
