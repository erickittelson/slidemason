import type { TableSlideProps } from './types';
import { Headline } from '../Headline';
import { NextStepsGrid } from '../interactive/NextStepsGrid';

export function TableSlide({ title, subtitle, steps }: TableSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center">
        <NextStepsGrid
          steps={steps}
          className="w-full"
          animate="stagger"
        />
      </div>
    </div>
  );
}
