export interface ThreeCardProps {
  cards: Array<{ title: string; content: string }>;
  className?: string;
}

export function ThreeCard({ cards, className = '' }: ThreeCardProps) {
  return (
    <div className={`grid grid-cols-3 gap-6 ${className}`.trim()}>
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-[var(--sm-radius)] border border-[var(--sm-border)] bg-[var(--sm-surface)] p-6"
        >
          <h3 className="mb-2 text-lg font-semibold text-[var(--sm-text)]">{card.title}</h3>
          <p className="text-sm text-[var(--sm-muted)]">{card.content}</p>
        </div>
      ))}
    </div>
  );
}
