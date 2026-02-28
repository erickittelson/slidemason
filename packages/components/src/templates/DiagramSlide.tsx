import type { DiagramSlideProps } from './types';
import { Headline } from '../Headline';
import { Flywheel } from '../diagrams/Flywheel';
import { FunnelChart } from '../diagrams/FunnelChart';
import { CycleDiagram } from '../diagrams/CycleDiagram';
import { PyramidChart } from '../diagrams/PyramidChart';

export function DiagramSlide({ title, subtitle, type, segments }: DiagramSlideProps) {
  let diagram: React.ReactNode;
  switch (type) {
    case 'flywheel':
      diagram = <Flywheel segments={segments} animate="stagger" style={{ width: 'min(80%, 400px)', height: 'auto' }} />;
      break;
    case 'funnel':
      diagram = <FunnelChart stages={segments} animate="stagger" />;
      break;
    case 'cycle':
      diagram = <CycleDiagram stages={segments} animate="stagger" />;
      break;
    case 'pyramid':
      diagram = <PyramidChart layers={segments} animate="stagger" />;
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
