import type { GallerySlideProps } from './types';
import { Headline } from '../Headline';
import { ImageGrid } from '../media/ImageGrid';
import { LogoGrid } from '../cards/LogoGrid';
import { IconMosaic } from '../media/IconMosaic';

export function GallerySlide({ title, subtitle, type, images, logos, icons, columns }: GallerySlideProps) {
  let content: React.ReactNode;
  switch (type) {
    case 'images':
      content = <ImageGrid images={images ?? []} columns={columns} animate="stagger" />;
      break;
    case 'logos':
      content = <LogoGrid logos={logos ?? []} animate="stagger" />;
      break;
    case 'icons':
      content = <IconMosaic icons={icons ?? []} columns={columns} animate="stagger" />;
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
      <div className="flex flex-1 items-center">
        {content}
      </div>
    </div>
  );
}
