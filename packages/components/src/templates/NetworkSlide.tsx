import type { NetworkSlideProps } from './types';
import { Headline } from '../Headline';
import { OrgChart } from '../diagrams/OrgChart';
import { MindMap } from '../diagrams/MindMap';
import { HubSpoke } from '../diagrams/HubSpoke';
import { ConcentricCircles } from '../diagrams/ConcentricCircles';

export function NetworkSlide({ title, subtitle, type, nodes, center, branches, spokes, rings }: NetworkSlideProps) {
  let diagram: React.ReactNode;
  switch (type) {
    case 'org-chart':
      diagram = <OrgChart nodes={nodes ?? []} animate="stagger" />;
      break;
    case 'mind-map':
      diagram = <MindMap center={center ?? ''} branches={branches ?? []} animate="stagger" />;
      break;
    case 'hub-spoke':
      diagram = <HubSpoke center={center ?? ''} spokes={spokes ?? []} animate="stagger" />;
      break;
    case 'concentric':
      diagram = <ConcentricCircles rings={rings ?? []} animate="stagger" />;
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
