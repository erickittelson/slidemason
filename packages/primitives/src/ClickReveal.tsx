import { useState } from 'react';
import { isPptxMode } from './pptxMode';

interface ClickRevealProps {
  children: React.ReactNode;
  prompt?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function ClickReveal({
  children,
  prompt = 'Click to reveal',
  style,
  className = '',
}: ClickRevealProps) {
  const pptx = isPptxMode();
  const [revealed, setRevealed] = useState(false);

  if (pptx) {
    return <div className={className} style={style} data-pptx-type="passthrough">{children}</div>;
  }

  if (revealed) {
    return <div className={className} style={style} data-pptx-type="passthrough">{children}</div>;
  }

  return (
    <div
      className={className}
      data-pptx-type="passthrough"
      onClick={() => setRevealed(true)}
      style={{
        border: '2px dashed var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(1.25rem, 2.5vw, 2rem)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--sm-muted)',
        fontSize: '0.9rem',
        ...style,
      }}
    >
      {prompt}
    </div>
  );
}
