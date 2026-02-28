export interface KPIStripProps {
  kpis: Array<{ value: string; label: string }>;
  className?: string;
}

export function KPIStrip({ kpis, className = '' }: KPIStripProps) {
  return (
    <div className={`flex items-center justify-around gap-4 ${className}`.trim()}>
      {kpis.map((kpi, i) => (
        <div key={i} className="text-center">
          <div className="text-4xl font-bold text-[var(--sm-primary)]">{kpi.value}</div>
          <div className="text-base uppercase tracking-wide text-[var(--sm-muted)]">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
