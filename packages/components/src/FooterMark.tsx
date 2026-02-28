export interface FooterMarkProps {
  text: string;
  className?: string;
}

export function FooterMark({ text, className = '' }: FooterMarkProps) {
  return (
    <div className={`text-xs text-[var(--sm-muted)] opacity-60 ${className}`.trim()}>
      {text}
    </div>
  );
}
