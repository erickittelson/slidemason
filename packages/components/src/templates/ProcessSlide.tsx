import type { ProcessSlideProps } from './types';
import { Headline } from '../Headline';
import { ProcessFlow } from '../lists/ProcessFlow';

export function ProcessSlide({ title, subtitle, steps }: ProcessSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center justify-center">
        <ProcessFlow
          steps={steps.map(s => ({ label: s.label, icon: s.icon }))}
          animate="stagger"
        />
      </div>
    </div>
  );
}
