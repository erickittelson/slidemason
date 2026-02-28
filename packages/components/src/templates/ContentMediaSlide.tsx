import type { ContentMediaSlideProps } from './types';
import { BulletGroup } from '../BulletGroup';
import { TwoColumn } from '../TwoColumn';
import { FeatureGrid } from '../cards/FeatureGrid';
import { Checklist } from '../lists/Checklist';
import { IconList } from '../lists/IconList';

export function ContentMediaSlide({
  title, subtitle, bodyText, bullets = [],
  mediaPosition = 'right', visual = 'icon-grid', visualItems = [],
}: ContentMediaSlideProps) {
  const textContent = (
    <div>
      <h2 className="sm-fade-up font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--sm-text)', margin: '0 0 0.75rem' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 1rem' }}>
          {subtitle}
        </p>
      )}
      {bodyText && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.1rem)', color: 'var(--sm-muted)', margin: '0 0 1rem' }}>
          {bodyText}
        </p>
      )}
      {bullets.length > 0 && <BulletGroup items={bullets} />}
    </div>
  );

  let visualContent: React.ReactNode;
  if (visual === 'checklist') {
    visualContent = (
      <Checklist
        items={visualItems.map(vi => ({ text: vi.label, checked: false }))}
        animate="stagger"
      />
    );
  } else if (visual === 'icon-grid') {
    visualContent = (
      <FeatureGrid
        features={visualItems.map(vi => ({ icon: vi.icon ?? 'Circle', title: vi.label, description: vi.description ?? '' }))}
        columns={2}
        animate="stagger"
      />
    );
  } else {
    visualContent = (
      <IconList
        items={visualItems.map(vi => ({ icon: vi.icon ?? 'Circle', text: vi.label }))}
        animate="stagger"
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center">
      <TwoColumn
        className="w-full items-center"
        left={mediaPosition === 'right' ? textContent : visualContent}
        right={mediaPosition === 'right' ? visualContent : textContent}
      />
    </div>
  );
}
