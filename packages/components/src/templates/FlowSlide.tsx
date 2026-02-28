import type { FlowSlideProps } from './types';
import { Headline } from '../Headline';
import { Flowchart } from '../diagrams/Flowchart';
import { SankeyFlow } from '../diagrams/SankeyFlow';
import { SwimLanes } from '../lists/SwimLanes';

export function FlowSlide({ title, subtitle, type, flowNodes, edges, sankeyNodes, flows, lanes }: FlowSlideProps) {
  let diagram: React.ReactNode;
  switch (type) {
    case 'flowchart':
      diagram = <Flowchart nodes={flowNodes ?? []} edges={edges ?? []} animate="stagger" />;
      break;
    case 'sankey':
      diagram = <SankeyFlow nodes={sankeyNodes ?? []} flows={flows ?? []} animate="stagger" />;
      break;
    case 'swimlane':
      diagram = <SwimLanes lanes={lanes ?? []} animate="stagger" />;
      break;
  }

  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center justify-center">
        {diagram}
      </div>
    </div>
  );
}
