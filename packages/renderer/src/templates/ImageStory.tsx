import { FullBleedImage, HeroText } from '@slidemason/components';

interface ImageStoryProps {
  src: string;
  alt: string;
  text: string;
}

export function ImageStory({ src, alt, text }: ImageStoryProps) {
  return (
    <FullBleedImage src={src} alt={alt} overlay="gradient" style={{ height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          right: '2rem',
          zIndex: 2,
          color: '#fff',
        }}
      >
        <HeroText>{text}</HeroText>
      </div>
    </FullBleedImage>
  );
}
