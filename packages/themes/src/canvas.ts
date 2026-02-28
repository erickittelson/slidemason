import type { ThemeConfig } from './types';

export const canvas: ThemeConfig = {
  name: 'canvas',
  colors: {
    background: '#fafaf9',
    surface: '#ffffff',
    text: '#1c1917',
    muted: '#78716c',
    primary: '#292524',
    secondary: '#d97706',
    accent: '#059669',
    border: '#e7e5e4',
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
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
};
