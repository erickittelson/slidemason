import type { ContentSlideProps } from './types';
import { Headline } from '../Headline';
import { BulletGroup } from '../BulletGroup';
import { TwoColumn } from '../TwoColumn';

export function ContentSlide({ title, subtitle, bullets = [], layout = 'single', rightBullets = [] }: ContentSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Headline>{title}</Headline>
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center">
        {layout === 'two-column' ? (
          <TwoColumn
            className="w-full"
            left={<BulletGroup items={bullets} />}
            right={<BulletGroup items={rightBullets} />}
          />
        ) : (
          <BulletGroup items={bullets} />
        )}
      </div>
    </div>
  );
}
