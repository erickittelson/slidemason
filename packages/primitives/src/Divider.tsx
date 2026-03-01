interface DividerProps {
  width?: string;
  style?: React.CSSProperties;
}

export function Divider({ width = 'clamp(2.5rem, 5vw, 3.5rem)', style }: DividerProps) {
  return (
    <div
      style={{
        width,
        height: 3,
        background: 'linear-gradient(90deg, var(--sm-primary), var(--sm-secondary))',
        borderRadius: 2,
        ...style,
      }}
    />
  );
}
