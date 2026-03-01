interface GhostNumberProps {
  n: number | string;
  style?: React.CSSProperties;
}

export function GhostNumber({ n, style }: GhostNumberProps) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 'clamp(1rem, 3vw, 2rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 'clamp(10rem, 25vw, 18rem)',
        fontWeight: 900,
        lineHeight: 1,
        color: 'var(--sm-text)',
        opacity: 0.06,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {n}
    </div>
  );
}
