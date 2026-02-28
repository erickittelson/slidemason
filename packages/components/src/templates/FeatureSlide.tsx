import type { FeatureSlideProps } from './types';
import { Headline } from '../Headline';
import { FeatureGrid } from '../cards/FeatureGrid';

export function FeatureSlide({ title, subtitle, features, columns = 3 }: FeatureSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center">
        <FeatureGrid
          features={features.map(f => ({ icon: f.icon ?? 'Circle', title: f.label, description: f.description ?? '' }))}
          columns={columns}
          animate="stagger"
        />
      </div>
    </div>
  );
}
