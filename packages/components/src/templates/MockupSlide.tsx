import type { MockupSlideProps } from './types';
import { Headline } from '../Headline';
import { PhoneMockup } from '../media/PhoneMockup';
import { BrowserMockup } from '../media/BrowserMockup';
import { LaptopMockup } from '../media/LaptopMockup';
import { TwoColumn } from '../TwoColumn';
import { BulletGroup } from '../BulletGroup';

export function MockupSlide({ title, subtitle, type, src, url, bullets, mediaPosition = 'left' }: MockupSlideProps) {
  let mockup: React.ReactNode;
  switch (type) {
    case 'phone':
      mockup = <PhoneMockup src={src} animate="stagger" />;
      break;
    case 'browser':
      mockup = <BrowserMockup src={src} url={url} animate="stagger" />;
      break;
    case 'laptop':
      mockup = <LaptopMockup src={src} animate="stagger" />;
      break;
  }

  const hasBullets = bullets && bullets.length > 0;

  const content = hasBullets ? (
    mediaPosition === 'left' ? (
      <TwoColumn left={mockup} right={<BulletGroup items={bullets} />} />
    ) : (
      <TwoColumn left={<BulletGroup items={bullets} />} right={mockup} />
    )
  ) : (
    mockup
  );

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
