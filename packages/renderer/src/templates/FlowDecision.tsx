import { Headline, Flowchart } from '@slidemason/components';

interface FlowDecisionProps {
  headline: string;
  nodes: Array<{ id: string; label: string; type: 'process' | 'decision' | 'start' | 'end' }>;
  edges: Array<{ from: string; to: string; label?: string }>;
}

export function FlowDecision({ headline, nodes, edges }: FlowDecisionProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <Flowchart nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}
