import { ImagePanel, Headline } from '@slidemason/components';

interface ImageCaptionProps {
  headline?: string;
  src: string;
  alt: string;
  caption?: string;
}

export function ImageCaption({ headline, src, alt, caption }: ImageCaptionProps) {
  return (
    <div className="flex flex-col h-full gap-8">
      {headline && <Headline>{headline}</Headline>}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <ImagePanel
          src={src}
          alt={alt}
          caption={caption}
          className="max-h-full"
        />
      </div>
    </div>
  );
}
