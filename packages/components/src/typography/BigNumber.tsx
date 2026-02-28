import type { CSSProperties } from 'react';

export interface BigNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BigNumber({
  value,
  prefix,
  suffix,
  className = '',
  style,
  animate,
}: BigNumberProps) {
  const animClass = animate ? 'sm-scale-in' : '';

  return (
    <div
      className={`font-bold text-[var(--sm-primary)] ${animClass} ${className}`.trim()}
      style={{
        fontSize: 'clamp(3rem, 7vw, 6rem)',
        lineHeight: 1.1,
        ...style,
      }}
    >
      {prefix}
      {value}
      {suffix}
    </div>
  );
}
