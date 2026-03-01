import { useState } from 'react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Accordion({
  items,
  defaultOpen,
  style,
  className = '',
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | undefined>(defaultOpen);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              background: 'var(--sm-glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? undefined : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: 'var(--sm-text)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{item.title}</span>
              <span
                style={{
                  display: 'inline-block',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                &#9662;
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 1000 : 0,
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, opacity 0.2s ease',
                padding: isOpen ? '0 16px 12px' : '0 16px 0',
              }}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
