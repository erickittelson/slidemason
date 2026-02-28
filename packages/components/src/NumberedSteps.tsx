export interface NumberedStepsProps {
  steps: string[];
  className?: string;
}

export function NumberedSteps({ steps, className = '' }: NumberedStepsProps) {
  return (
    <ol className={`space-y-5 text-2xl text-[var(--sm-text)] ${className}`.trim()}>
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sm-primary)] text-lg font-bold text-[var(--sm-bg)]">
            {i + 1}
          </span>
          <span className="pt-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}
