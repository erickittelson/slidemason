import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  FullBleedImage,
  ImageGrid,
  ImageTextSplit,
  PhoneMockup,
  BrowserMockup,
  LaptopMockup,
  ScreenshotAnnotated,
  VideoEmbed,
  IconMosaic,
  AvatarStack,
} from '../media';

afterEach(() => cleanup());

describe('FullBleedImage', () => {
  it('renders image with src and alt', () => {
    const { container } = render(<FullBleedImage src="/photo.jpg" alt="Hero" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/photo.jpg');
    expect(img?.getAttribute('alt')).toBe('Hero');
  });

  it('applies className', () => {
    const { container } = render(<FullBleedImage src="/a.jpg" alt="A" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ImageGrid', () => {
  const images = [
    { src: '/a.jpg', alt: 'A' },
    { src: '/b.jpg', alt: 'B' },
  ];

  it('renders all images', () => {
    const { container } = render(<ImageGrid images={images} />);
    expect(container.querySelectorAll('img').length).toBe(2);
  });

  it('applies className', () => {
    const { container } = render(<ImageGrid images={images} className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ImageTextSplit', () => {
  it('renders image and children', () => {
    const { container } = render(
      <ImageTextSplit image={{ src: '/img.jpg', alt: 'Img' }}>
        <p>Content here</p>
      </ImageTextSplit>
    );
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/img.jpg');
    expect(container.textContent).toContain('Content here');
  });

  it('applies className', () => {
    const { container } = render(
      <ImageTextSplit image={{ src: '/img.jpg', alt: 'Img' }} className="test-cls">
        <p>Text</p>
      </ImageTextSplit>
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('PhoneMockup', () => {
  it('renders SVG phone frame', () => {
    const { container } = render(<PhoneMockup src="/screen.png" />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelector('image')?.getAttribute('href')).toBe('/screen.png');
  });

  it('applies className', () => {
    const { container } = render(<PhoneMockup className="test-cls" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('BrowserMockup', () => {
  it('renders browser chrome with URL', () => {
    const { container } = render(<BrowserMockup url="https://example.com" />);
    expect(container.textContent).toContain('https://example.com');
  });

  it('applies className', () => {
    const { container } = render(<BrowserMockup className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('LaptopMockup', () => {
  it('renders SVG laptop frame', () => {
    const { container } = render(<LaptopMockup src="/screen.png" />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelector('image')?.getAttribute('href')).toBe('/screen.png');
  });

  it('applies className', () => {
    const { container } = render(<LaptopMockup className="test-cls" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ScreenshotAnnotated', () => {
  const annotations = [
    { x: 10, y: 20, label: 'Button' },
    { x: 50, y: 60, label: 'Header' },
  ];

  it('renders image and annotation labels', () => {
    const { container } = render(
      <ScreenshotAnnotated src="/shot.png" alt="Screenshot" annotations={annotations} />
    );
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/shot.png');
    expect(container.textContent).toContain('Button');
    expect(container.textContent).toContain('Header');
  });

  it('applies className', () => {
    const { container } = render(
      <ScreenshotAnnotated src="/shot.png" alt="Screenshot" annotations={annotations} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('VideoEmbed', () => {
  it('renders iframe for YouTube URL', () => {
    const { container } = render(<VideoEmbed src="https://youtube.com/embed/abc" />);
    expect(container.querySelector('iframe')).toBeTruthy();
  });

  it('applies className', () => {
    const { container } = render(<VideoEmbed src="/video.mp4" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('IconMosaic', () => {
  it('renders grid container with icons', () => {
    const { container } = render(<IconMosaic icons={['Star', 'Heart']} />);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid).toBeTruthy();
    expect(grid.style.display).toBe('grid');
  });

  it('applies className', () => {
    const { container } = render(<IconMosaic icons={['Star']} className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('AvatarStack', () => {
  const avatars = [
    { name: 'Alice Smith' },
    { name: 'Bob Jones', src: '/bob.jpg' },
    { name: 'Carol Davis' },
  ];

  it('renders avatars with initials', () => {
    const { container } = render(<AvatarStack avatars={avatars} />);
    expect(container.textContent).toContain('AS');
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/bob.jpg');
  });

  it('applies className', () => {
    const { container } = render(<AvatarStack avatars={avatars} className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});
