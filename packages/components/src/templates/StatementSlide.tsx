import type { StatementSlideProps } from './types';
import { GradientText } from '../typography/GradientText';
import { TypewriterText } from '../typography/TypewriterText';
import { BigNumber } from '../typography/BigNumber';
import { PullQuote } from '../typography/PullQuote';
import { TextReveal } from '../typography/TextReveal';
import { HighlightBox } from '../typography/HighlightBox';
import { MeshGradient } from '../backgrounds/MeshGradient';
import { GeometricPattern } from '../backgrounds/GeometricPattern';
import { NoisyGradient } from '../backgrounds/NoisyGradient';
import { SpotlightEffect } from '../backgrounds/SpotlightEffect';

export function StatementSlide({
  title,
  type,
  text,
  lines,
  value,
  prefix,
  suffix,
  quote,
  attribution,
  variant,
  background,
}: StatementSlideProps) {
  let typography: React.ReactNode;
  switch (type) {
    case 'gradient-text':
      typography = (
        <GradientText animate="stagger" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.2 }}>
          {text}
        </GradientText>
      );
      break;
    case 'typewriter':
      typography = <TypewriterText text={text ?? ''} animate="stagger" />;
      break;
    case 'big-number':
      typography = <BigNumber value={value ?? 0} prefix={prefix} suffix={suffix} animate="stagger" />;
      break;
    case 'pull-quote':
      typography = <PullQuote quote={quote ?? ''} attribution={attribution} animate="stagger" />;
      break;
    case 'text-reveal':
      typography = <TextReveal lines={lines ?? []} animate="stagger" />;
      break;
    case 'highlight':
      typography = (
        <HighlightBox variant={variant} animate="stagger">
          {text}
        </HighlightBox>
      );
      break;
  }

  const content = (
    <div className="flex flex-1 flex-col items-center justify-center" style={{ textAlign: 'center', padding: 'clamp(1rem, 3vw, 3rem)' }}>
      {title && (
        <p className="sm-fade-up" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', color: 'var(--sm-muted)', marginBottom: 'clamp(0.5rem, 1.5vh, 1.5rem)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {title}
        </p>
      )}
      {typography}
    </div>
  );

  switch (background) {
    case 'mesh':
      return <MeshGradient style={{ display: 'flex', flex: 1 }}>{content}</MeshGradient>;
    case 'geometric':
      return <GeometricPattern style={{ display: 'flex', flex: 1 }}>{content}</GeometricPattern>;
    case 'noisy':
      return <NoisyGradient style={{ display: 'flex', flex: 1 }}>{content}</NoisyGradient>;
    case 'spotlight':
      return <SpotlightEffect style={{ display: 'flex', flex: 1 }}>{content}</SpotlightEffect>;
    case 'none':
    default:
      return <div className="flex flex-1 flex-col">{content}</div>;
  }
}
