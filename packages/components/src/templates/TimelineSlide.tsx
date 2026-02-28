import type { TimelineSlideProps } from './types';
import { Headline } from '../Headline';
import { TimelineVertical } from '../lists/TimelineVertical';
import { MilestoneTracker } from '../lists/MilestoneTracker';

const statusMap: Record<string, 'completed' | 'current' | 'upcoming'> = {
  'completed': 'completed',
  'in-progress': 'current',
  'upcoming': 'upcoming',
};

export function TimelineSlide({ title, subtitle, items, variant = 'vertical' }: TimelineSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center">
        {variant === 'horizontal' ? (
          <MilestoneTracker
            milestones={items.map(it => ({ label: `${it.phase}\n${it.title}`, status: statusMap[it.status ?? 'upcoming'] ?? 'upcoming' }))}
            className="w-full"
            animate="stagger"
          />
        ) : (
          <TimelineVertical
            events={items.map(it => ({ date: it.phase, title: it.title, description: it.description }))}
            animate="stagger"
          />
        )}
      </div>
    </div>
  );
}
