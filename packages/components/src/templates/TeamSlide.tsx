import type { TeamSlideProps } from './types';
import { Headline } from '../Headline';
import { TeamGrid } from '../cards/TeamGrid';

export function TeamSlide({ title, subtitle, members }: TeamSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center justify-center">
        <TeamGrid members={members} animate="stagger" />
      </div>
    </div>
  );
}
