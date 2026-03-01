import { useRef, useEffect, useCallback } from 'react';

const THEME_COLORS = [
  { label: 'Primary', value: 'var(--sm-primary)' },
  { label: 'Secondary', value: 'var(--sm-secondary)' },
  { label: 'Accent', value: 'var(--sm-accent)' },
  { label: 'Text', value: 'var(--sm-text)' },
  { label: 'Muted', value: 'var(--sm-muted)' },
  { label: 'Success', value: 'var(--sm-success)' },
  { label: 'Danger', value: 'var(--sm-danger)' },
];

interface EditorToolbarProps {
  x: number;
  y: number;
  themeRoot: HTMLElement | null;
  onTextEdit: () => void;
  onColorSelect: (cssVar: string) => void;
  onReorder: (dir: 'up' | 'down') => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EditorToolbar({
  x, y, themeRoot, onTextEdit, onColorSelect, onReorder, onDelete, onClose,
}: EditorToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [onClose]);

  const resolveVar = useCallback((cssVar: string): string => {
    if (!themeRoot) return '#888';
    const varName = cssVar.replace('var(', '').replace(')', '');
    return window.getComputedStyle(themeRoot).getPropertyValue(varName).trim() || '#888';
  }, [themeRoot]);

  const btnStyle: React.CSSProperties = {
    border: 'none', background: 'transparent', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '4px', borderRadius: '4px', color: 'rgba(255,255,255,0.7)',
    transition: 'background 0.15s, color 0.15s',
  };

  return (
    <div ref={ref} style={{
      position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)', zIndex: 40,
      backgroundColor: 'rgba(24, 24, 27, 0.95)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(63, 63, 70, 0.6)', borderRadius: '10px',
      padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {/* Text edit */}
      <button onClick={onTextEdit} style={btnStyle} title="Edit text">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 11h8M5 3h4M7 3v8" strokeLinecap="round" />
        </svg>
      </button>
      <div style={{ width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }} />
      {/* Color swatches */}
      {THEME_COLORS.map((c) => (
        <button key={c.value} title={c.label} onClick={() => onColorSelect(c.value)} style={{
          width: 18, height: 18, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
          backgroundColor: resolveVar(c.value), cursor: 'pointer', padding: 0, flexShrink: 0,
        }} />
      ))}
      <div style={{ width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }} />
      {/* Reorder up */}
      <button onClick={() => onReorder('up')} style={btnStyle} title="Move up">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 11V3M3 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Reorder down */}
      <button onClick={() => onReorder('down')} style={btnStyle} title="Move down">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 3v8M3 7l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }} />
      {/* Delete */}
      <button onClick={onDelete} style={{ ...btnStyle, color: 'rgba(239,68,68,0.8)' }} title="Delete element">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
