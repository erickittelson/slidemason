import { Headline, OrgChart } from '@slidemason/components';

interface OrgStructureProps {
  headline: string;
  nodes: Array<{ id: string; label: string; parentId?: string }>;
}

export function OrgStructure({ headline, nodes }: OrgStructureProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <OrgChart nodes={nodes} />
      </div>
    </div>
  );
}
