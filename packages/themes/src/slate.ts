import type { ThemeConfig } from './types';

export const slate: ThemeConfig = {
  name: 'slate',
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    muted: '#94a3b8',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    border: '#334155',
  },
  typography: {
    headingFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    monoFont: "'JetBrains Mono', ui-monospace, monospace",
  },
  spacing: {
    slidePadding: '3rem',
    elementGap: '1.5rem',
  },
  radius: '0.5rem',
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
  },
};
