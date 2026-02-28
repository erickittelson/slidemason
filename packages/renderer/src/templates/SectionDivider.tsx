import { SectionLabel } from '@slidemason/components';

interface SectionDividerProps {
  label: string;
  subtitle?: string;
}

export function SectionDivider({ label, subtitle }: SectionDividerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <SectionLabel label={label} className="w-full max-w-2xl text-2xl" />
      {subtitle && (
        <p className="text-lg text-[var(--sm-muted)] text-center max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
