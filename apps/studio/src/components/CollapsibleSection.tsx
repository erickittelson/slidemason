import { useState, type ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '6px',
          padding: '10px 0', backgroundColor: 'transparent', border: 'none',
          cursor: 'pointer', color: '#fff', fontSize: '0.8rem', fontWeight: 600,
        }}
      >
        <span style={{
          color: '#888', fontSize: '0.6rem', width: '12px', textAlign: 'center',
          transition: 'transform 0.15s',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          ▶
        </span>
        {title}
      </button>
      {open && (
        <div style={{ paddingBottom: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
