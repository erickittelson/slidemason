import type { CSSProperties } from 'react';

export interface SankeyFlowProps {
  nodes: Array<{ id: string; label: string }>;
  flows: Array<{ from: string; to: string; value: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const CHART_COLORS = [
  'var(--sm-chart-1, #3b82f6)',
  'var(--sm-chart-2, #10b981)',
  'var(--sm-chart-3, #f59e0b)',
  'var(--sm-chart-4, #ef4444)',
  'var(--sm-chart-5, #8b5cf6)',
  'var(--sm-chart-6, #ec4899)',
];

export function SankeyFlow({
  nodes,
  flows,
  className = '',
  style,
  animate,
}: SankeyFlowProps) {
  const width = 500;
  const height = 300;
  const barWidth = 20;
  const margin = 80;

  // Determine sources (nodes that appear in from) and destinations (nodes in to)
  const sourceIds = [...new Set(flows.map((f) => f.from))];
  const destIds = [...new Set(flows.map((f) => f.to))];

  // Calculate totals for sizing
  const sourceTotals = new Map<string, number>();
  const destTotals = new Map<string, number>();
  for (const flow of flows) {
    sourceTotals.set(flow.from, (sourceTotals.get(flow.from) || 0) + flow.value);
    destTotals.set(flow.to, (destTotals.get(flow.to) || 0) + flow.value);
  }

  const totalFlow = flows.reduce((s, f) => s + f.value, 0);
  const usableHeight = height - 40;

  // Position source nodes
  const sourcePositions = new Map<string, { y: number; h: number }>();
  let sy = 20;
  const sourceGap = Math.max(5, (usableHeight - totalFlow) / Math.max(sourceIds.length - 1, 1));
  for (const id of sourceIds) {
    const total = sourceTotals.get(id) || 0;
    const h = (total / totalFlow) * (usableHeight - sourceGap * (sourceIds.length - 1));
    sourcePositions.set(id, { y: sy, h });
    sy += h + sourceGap;
  }

  // Position destination nodes
  const destPositions = new Map<string, { y: number; h: number }>();
  let dy = 20;
  const destGap = Math.max(5, (usableHeight - totalFlow) / Math.max(destIds.length - 1, 1));
  for (const id of destIds) {
    const total = destTotals.get(id) || 0;
    const h = (total / totalFlow) * (usableHeight - destGap * (destIds.length - 1));
    destPositions.set(id, { y: dy, h });
    dy += h + destGap;
  }

  // Track current y offsets for flow paths
  const sourceOffsets = new Map<string, number>();
  const destOffsets = new Map<string, number>();
  for (const id of sourceIds) sourceOffsets.set(id, sourcePositions.get(id)!.y);
  for (const id of destIds) destOffsets.set(id, destPositions.get(id)!.y);

  const x1 = margin;
  const x2 = width - margin;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`sm-sankey-flow ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Flow paths */}
      {flows.map((flow, i) => {
        const sPos = sourcePositions.get(flow.from);
        const dPos = destPositions.get(flow.to);
        if (!sPos || !dPos) return null;

        const sOffset = sourceOffsets.get(flow.from) || 0;
        const dOffset = destOffsets.get(flow.to) || 0;
        const flowH =
          (flow.value / totalFlow) *
          (usableHeight - sourceGap * (sourceIds.length - 1));

        const path = `
          M ${x1 + barWidth} ${sOffset}
          C ${(x1 + x2) / 2} ${sOffset}, ${(x1 + x2) / 2} ${dOffset}, ${x2} ${dOffset}
          L ${x2} ${dOffset + flowH}
          C ${(x1 + x2) / 2} ${dOffset + flowH}, ${(x1 + x2) / 2} ${sOffset + flowH}, ${x1 + barWidth} ${sOffset + flowH}
          Z
        `;

        sourceOffsets.set(flow.from, sOffset + flowH);
        destOffsets.set(flow.to, dOffset + flowH);

        return (
          <path
            key={`flow-${i}`}
            d={path}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            opacity={0.4}
          />
        );
      })}

      {/* Source bars */}
      {sourceIds.map((id, i) => {
        const pos = sourcePositions.get(id)!;
        const node = nodes.find((n) => n.id === id);
        return (
          <g key={`src-${id}`}>
            <rect
              x={x1}
              y={pos.y}
              width={barWidth}
              height={pos.h}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
            />
            <text
              x={x1 - 5}
              y={pos.y + pos.h / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={11}
            >
              {node?.label || id}
            </text>
          </g>
        );
      })}

      {/* Destination bars */}
      {destIds.map((id, i) => {
        const pos = destPositions.get(id)!;
        const node = nodes.find((n) => n.id === id);
        return (
          <g key={`dst-${id}`}>
            <rect
              x={x2}
              y={pos.y}
              width={barWidth}
              height={pos.h}
              fill={CHART_COLORS[(sourceIds.length + i) % CHART_COLORS.length]}
            />
            <text
              x={x2 + barWidth + 5}
              y={pos.y + pos.h / 2}
              dominantBaseline="central"
              fill="currentColor"
              fontSize={11}
            >
              {node?.label || id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
