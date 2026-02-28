export interface NumberedStepsProps {
  steps: string[];
  className?: string;
}

export function NumberedSteps({ steps, className = '' }: NumberedStepsProps) {
  return (
    <ol className={`space-y-3 text-[var(--sm-text)] ${className}`.trim()}>
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--sm-primary)] text-sm font-bold text-[var(--sm-bg)]">
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}
