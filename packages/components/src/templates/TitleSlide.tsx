import type { TitleSlideProps } from './types';
import { gradientMap } from './gradients';

export function TitleSlide({
  title,
  subtitle,
  badge,
  gradient = 'blue-purple',
}: TitleSlideProps) {
  const grad = gradientMap[gradient] ?? gradientMap['blue-purple'];

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center" style={{ gap: 'clamp(1rem, 2vh, 2rem)' }}>
      {badge && (
        <span className="sm-fade-up inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase bg-white/5 border border-zinc-800" style={{ color: 'var(--sm-muted)' }}>
          {badge}
        </span>
      )}

      <h1
        className={`sm-fade-up sm-stagger-1 sm-ease-cinematic sm-duration-slow font-extrabold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r ${grad}`}
        style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)' }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="sm-fade-up sm-stagger-2 font-light leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.75rem)', color: 'var(--sm-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
