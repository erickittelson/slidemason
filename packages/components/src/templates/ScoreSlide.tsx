import type { ScoreSlideProps } from './types';
import { Headline } from '../Headline';
import { ScoreCard } from '../comparison/ScoreCard';
import { TrafficLight } from '../comparison/TrafficLight';
import { HarveyBallMatrix } from '../comparison/HarveyBallMatrix';
import { GaugeChart } from '../dataviz/GaugeChart';
import { RatingStars } from '../comparison/RatingStars';

export function ScoreSlide({ title, subtitle, type, criteria, statusItems, harveyCriteria, harveyOptions, gauges, ratings }: ScoreSlideProps) {
  let content: React.ReactNode;
  switch (type) {
    case 'scorecard':
      content = <ScoreCard criteria={criteria ?? []} animate="stagger" />;
      break;
    case 'traffic-light':
      content = <TrafficLight items={statusItems ?? []} animate="stagger" />;
      break;
    case 'harvey-ball':
      content = <HarveyBallMatrix criteria={harveyCriteria ?? []} options={harveyOptions ?? []} animate="stagger" />;
      break;
    case 'gauge':
      content = (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {(gauges ?? []).map((g, i) => (
            <div
              key={i}
              className={`sm-fade-up sm-stagger-${i + 1}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <GaugeChart value={g.value} min={g.min} max={g.max} label={g.label} animate="stagger" />
            </div>
          ))}
        </div>
      );
      break;
    case 'rating':
      content = <RatingStars items={ratings ?? []} animate="stagger" />;
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
        {content}
      </div>
    </div>
  );
}
