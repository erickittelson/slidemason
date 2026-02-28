export interface ComparisonMatrixProps {
  headers: [string, string];
  rows: Array<{ label: string; values: [string, string] }>;
  className?: string;
}

export function ComparisonMatrix({ headers, rows, className = '' }: ComparisonMatrixProps) {
  return (
    <table
      className={`w-full border-collapse text-left text-[var(--sm-text)] ${className}`.trim()}
    >
      <thead>
        <tr>
          <th className="border-b border-[var(--sm-border)] p-3 text-sm font-semibold text-[var(--sm-muted)]" />
          <th className="border-b border-[var(--sm-border)] p-3 text-sm font-semibold text-[var(--sm-primary)]">
            {headers[0]}
          </th>
          <th className="border-b border-[var(--sm-border)] p-3 text-sm font-semibold text-[var(--sm-primary)]">
            {headers[1]}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td className="border-b border-[var(--sm-border)] p-3 font-medium">{row.label}</td>
            <td className="border-b border-[var(--sm-border)] p-3">{row.values[0]}</td>
            <td className="border-b border-[var(--sm-border)] p-3">{row.values[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
