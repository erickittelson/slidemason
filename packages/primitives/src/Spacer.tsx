interface SpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

const sizes = {
  sm: 'clamp(0.75rem, 1.5vh, 1.25rem)',
  md: 'clamp(1.5rem, 3vh, 2.5rem)',
  lg: 'clamp(2.5rem, 5vh, 4rem)',
  xl: 'clamp(4rem, 8vh, 6rem)',
};

export function Spacer({ size = 'md', style }: SpacerProps) {
  return (
    <div
      data-pptx-type="spacer"
      style={{
        height: sizes[size],
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
