export interface NumberedStepsProps {
  steps: string[];
  className?: string;
}

export function NumberedSteps({ steps, className = '' }: NumberedStepsProps) {
  return (
    <ol className={`leading-snug text-[var(--sm-text)] ${className}`.trim()} style={{ fontSize: 'clamp(1.1rem, 2vw, 1.875rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vh, 2rem)' }}>
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-5">
          <span className="flex shrink-0 items-center justify-center rounded-full bg-[var(--sm-primary)] font-bold text-[var(--sm-bg)]" style={{ width: 'clamp(2rem, 3vw, 3rem)', height: 'clamp(2rem, 3vw, 3rem)', fontSize: 'clamp(0.875rem, 1.5vw, 1.25rem)' }}>
            {i + 1}
          </span>
          <span className="pt-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}
