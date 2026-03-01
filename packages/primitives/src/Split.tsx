interface SplitProps {
  ratio?: '35/65' | '40/60' | '50/50' | '60/40' | '65/35';
  reverse?: boolean;
  gap?: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const ratioMap: Record<string, [string, string]> = {
  '35/65': ['35%', '65%'],
  '40/60': ['40%', '60%'],
  '50/50': ['50%', '50%'],
  '60/40': ['60%', '40%'],
  '65/35': ['65%', '35%'],
};

export function Split({
  ratio = '35/65',
  reverse = false,
  gap = 'clamp(1.5rem, 3vw, 3rem)',
  style,
  className = '',
  children,
}: SplitProps) {
  const [left, right] = ratioMap[ratio];
  return (
    <div
      data-pptx-type="split"
      className={className}
      style={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        gap,
        ...style,
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} style={{ flex: `0 0 calc(${i === 0 ? left : right} - ${gap} / 2)` }}>
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
