import type { FullBleedSlideProps } from './types';
import { GradientBg } from '../backgrounds/GradientBg';

const bgColors: Record<string, { from: string; to: string }> = {
  blue: { from: '#1e3a5f', to: '#0f172a' },
  emerald: { from: '#064e3b', to: '#0f172a' },
  purple: { from: '#3b0764', to: '#0f172a' },
  amber: { from: '#78350f', to: '#0f172a' },
  rose: { from: '#881337', to: '#0f172a' },
  dark: { from: '#18181b', to: '#000000' },
};

export function FullBleedSlide({ title, subtitle, gradient = 'dark' }: FullBleedSlideProps) {
  const colors = bgColors[gradient] ?? bgColors.dark;
  return (
    <GradientBg from={colors.from} to={colors.to} type="radial" className="flex flex-1 flex-col items-center justify-center text-center">
      <h2
        className="sm-fade-up sm-ease-cinematic sm-duration-slow font-extrabold tracking-tighter"
        style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', color: 'var(--sm-text)', maxWidth: '80%' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="sm-fade-up sm-stagger-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'var(--sm-muted)', marginTop: '1rem', maxWidth: '60%' }}>
          {subtitle}
        </p>
      )}
    </GradientBg>
  );
}
