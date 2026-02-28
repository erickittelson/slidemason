import type { CSSProperties } from 'react';

export interface OrgChartProps {
  nodes: Array<{ id: string; label: string; parentId?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

interface LayoutNode {
  id: string;
  label: string;
  x: number;
  y: number;
  children: LayoutNode[];
  parentId?: string;
}

function buildTree(
  nodes: OrgChartProps['nodes']
): LayoutNode[] {
  const map = new Map<string, LayoutNode>();
  const roots: LayoutNode[] = [];

  for (const n of nodes) {
    map.set(n.id, { ...n, x: 0, y: 0, children: [] });
  }

  for (const n of nodes) {
    const node = map.get(n.id)!;
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function countLeaves(node: LayoutNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

function layoutTree(
  node: LayoutNode,
  x: number,
  y: number,
  hSpacing: number,
  vSpacing: number
): void {
  node.x = x;
  node.y = y;
  if (node.children.length === 0) return;

  const totalLeaves = node.children.reduce((s, c) => s + countLeaves(c), 0);
  const totalWidth = totalLeaves * hSpacing;
  let currentX = x - totalWidth / 2;

  for (const child of node.children) {
    const childLeaves = countLeaves(child);
    const childWidth = childLeaves * hSpacing;
    const childX = currentX + childWidth / 2;
    layoutTree(child, childX, y + vSpacing, hSpacing, vSpacing);
    currentX += childWidth;
  }
}

function collectNodes(node: LayoutNode, result: LayoutNode[], depth: number): void {
  result.push(node);
  for (const child of node.children) {
    collectNodes(child, result, depth + 1);
  }
}

export function OrgChart({
  nodes,
  className = '',
  style,
  animate,
}: OrgChartProps) {
  const roots = buildTree(nodes);
  const boxW = 120;
  const boxH = 40;
  const hSpacing = 140;
  const vSpacing = 80;

  // Layout each root
  const totalLeaves = roots.reduce((s, r) => s + countLeaves(r), 0);
  const totalWidth = Math.max(totalLeaves * hSpacing, 400);
  let currentX = 0;

  for (const root of roots) {
    const leaves = countLeaves(root);
    const width = leaves * hSpacing;
    layoutTree(root, currentX + width / 2, 40, hSpacing, vSpacing);
    currentX += width;
  }

  const allNodes: LayoutNode[] = [];
  for (const root of roots) {
    collectNodes(root, allNodes, 0);
  }

  // Determine viewBox
  const maxY = Math.max(...allNodes.map((n) => n.y)) + boxH + 20;
  const viewWidth = Math.max(totalWidth, 400);

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${maxY}`}
      className={`sm-org-chart ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Connector lines */}
      {allNodes.map((node) =>
        node.children.map((child) => (
          <line
            key={`${node.id}-${child.id}`}
            x1={node.x}
            y1={node.y + boxH / 2}
            x2={child.x}
            y2={child.y - boxH / 2}
            stroke="var(--sm-border, #d1d5db)"
            strokeWidth={2}
          />
        ))
      )}

      {/* Node boxes */}
      {allNodes.map((node, i) => (
        <g
          key={node.id}
          className={animate === 'stagger' ? 'sm-fade-in' : ''}
          style={
            animate === 'stagger'
              ? ({ animationDelay: `${i * 0.08}s` } as CSSProperties)
              : undefined
          }
        >
          <rect
            x={node.x - boxW / 2}
            y={node.y - boxH / 2}
            width={boxW}
            height={boxH}
            rx={6}
            fill="var(--sm-surface, #fff)"
            stroke="var(--sm-primary, #3b82f6)"
            strokeWidth={2}
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={12}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
