export interface NumberedStepsProps {
  steps: string[];
  className?: string;
}

export function NumberedSteps({ steps, className = '' }: NumberedStepsProps) {
  return (
    <ol className={`space-y-8 text-3xl leading-snug text-[var(--sm-text)] ${className}`.trim()}>
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--sm-primary)] text-xl font-bold text-[var(--sm-bg)]">
            {i + 1}
          </span>
          <span className="pt-1.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}
