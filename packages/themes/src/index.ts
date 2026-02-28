import { slate } from './slate';
import { canvas } from './canvas';
import { signal } from './signal';
import type { ThemeConfig } from './types';

export type { ThemeConfig } from './types';

export const themes: Record<string, ThemeConfig> = { slate, canvas, signal };

export function getTheme(name: string): ThemeConfig {
  const theme = themes[name];
  if (!theme) throw new Error(`Unknown theme: ${name}. Available: ${Object.keys(themes).join(', ')}`);
  return theme;
}
