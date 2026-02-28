export interface KPIStripProps {
  kpis: Array<{ value: string; label: string }>;
  className?: string;
}

export function KPIStrip({ kpis, className = '' }: KPIStripProps) {
  return (
    <div className={`flex items-center justify-around gap-4 ${className}`.trim()}>
      {kpis.map((kpi, i) => (
        <div key={i} className="text-center">
          <div className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>{kpi.value}</div>
          <div className="uppercase tracking-wide text-[var(--sm-muted)]" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}>{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
