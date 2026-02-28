import type { CSSProperties } from 'react';

export interface FlowchartProps {
  nodes: Array<{
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start' | 'end';
  }>;
  edges: Array<{ from: string; to: string; label?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function Flowchart({
  nodes,
  edges,
  className = '',
  style,
  animate,
}: FlowchartProps) {
  const nodeW = 140;
  const nodeH = 50;
  const vSpacing = 90;
  const cx = 220;
  const startY = 40;

  // Position nodes vertically
  const nodePositions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node, i) => {
    nodePositions.set(node.id, { x: cx, y: startY + i * vSpacing });
  });

  const totalHeight = startY + nodes.length * vSpacing + 20;
  const viewWidth = 440;

  function renderNode(
    node: FlowchartProps['nodes'][0],
    pos: { x: number; y: number },
    idx: number
  ) {
    const animProps =
      animate === 'stagger'
        ? {
            className: 'sm-fade-in',
            style: { animationDelay: `${idx * 0.1}s` } as CSSProperties,
          }
        : {};

    switch (node.type) {
      case 'start':
      case 'end':
        return (
          <g key={node.id} {...animProps}>
            <rect
              x={pos.x - nodeW / 2}
              y={pos.y - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx={nodeH / 2}
              fill="var(--sm-surface, #fff)"
              stroke="var(--sm-primary, #3b82f6)"
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={13}
            >
              {node.label}
            </text>
          </g>
        );

      case 'decision': {
        const dSize = nodeH * 0.8;
        return (
          <g key={node.id} {...animProps}>
            <rect
              x={pos.x - dSize}
              y={pos.y - dSize}
              width={dSize * 2}
              height={dSize * 2}
              fill="var(--sm-surface, #fff)"
              stroke="var(--sm-warning, #f59e0b)"
              strokeWidth={2}
              transform={`rotate(45, ${pos.x}, ${pos.y})`}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={11}
            >
              {node.label}
            </text>
          </g>
        );
      }

      case 'process':
      default:
        return (
          <g key={node.id} {...animProps}>
            <rect
              x={pos.x - nodeW / 2}
              y={pos.y - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx={6}
              fill="var(--sm-surface, #fff)"
              stroke="var(--sm-primary, #3b82f6)"
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={13}
            >
              {node.label}
            </text>
          </g>
        );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${totalHeight}`}
      className={`sm-flowchart ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      <defs>
        <marker
          id="sm-flow-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0,0 8,3 0,6" fill="var(--sm-primary, #3b82f6)" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodePositions.get(edge.from);
        const to = nodePositions.get(edge.to);
        if (!from || !to) return null;

        return (
          <g key={`edge-${i}`}>
            <line
              x1={from.x}
              y1={from.y + nodeH / 2}
              x2={to.x}
              y2={to.y - nodeH / 2}
              stroke="var(--sm-primary, #3b82f6)"
              strokeWidth={2}
              markerEnd="url(#sm-flow-arrow)"
            />
            {edge.label && (
              <text
                x={(from.x + to.x) / 2 + 10}
                y={(from.y + nodeH / 2 + (to.y - nodeH / 2)) / 2}
                fill="currentColor"
                fontSize={10}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        return renderNode(node, pos, i);
      })}
    </svg>
  );
}
