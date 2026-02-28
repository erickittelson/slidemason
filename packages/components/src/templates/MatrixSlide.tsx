import type { MatrixSlideProps } from './types';
import { Headline } from '../Headline';
import { SWOTGrid } from '../comparison/SWOTGrid';
import { FeatureMatrix } from '../comparison/FeatureMatrix';
import { PriorityMatrix } from '../comparison/PriorityMatrix';
import { CompetitorMap } from '../comparison/CompetitorMap';

export function MatrixSlide({ title, subtitle, type, strengths, weaknesses, opportunities, threats, features, products, items, xAxis, yAxis }: MatrixSlideProps) {
  let matrix: React.ReactNode;
  switch (type) {
    case 'swot':
      matrix = <SWOTGrid strengths={strengths ?? []} weaknesses={weaknesses ?? []} opportunities={opportunities ?? []} threats={threats ?? []} animate="stagger" />;
      break;
    case 'feature':
      matrix = <FeatureMatrix features={features ?? []} products={products ?? []} animate="stagger" />;
      break;
    case 'priority':
      matrix = <PriorityMatrix items={(items ?? []).map(i => ({ label: i.label, effort: i.effort ?? 0, impact: i.impact ?? 0 }))} animate="stagger" />;
      break;
    case 'competitor':
    case 'quadrant':
      matrix = <CompetitorMap items={(items ?? []).map(i => ({ label: i.label, x: i.x ?? 0, y: i.y ?? 0 }))} xAxis={xAxis ?? ''} yAxis={yAxis ?? ''} animate="stagger" />;
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
        {matrix}
      </div>
    </div>
  );
}
