import { Headline, BrowserMockup } from '@slidemason/components';

interface ScreenshotDemoProps {
  headline: string;
  src: string;
  url?: string;
  variant?: 'browser' | 'phone';
}

export function ScreenshotDemo({ headline, src, url }: ScreenshotDemoProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <BrowserMockup src={src} url={url} />
      </div>
    </div>
  );
}
