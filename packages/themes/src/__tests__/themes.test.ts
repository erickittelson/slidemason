import { describe, it, expect } from 'vitest';
import { themes, getTheme } from '../index';

describe('themes', () => {
  it('exports three themes', () => {
    expect(Object.keys(themes)).toHaveLength(3);
    expect(themes).toHaveProperty('slate');
    expect(themes).toHaveProperty('canvas');
    expect(themes).toHaveProperty('signal');
  });

  it('each theme has required token categories', () => {
    for (const theme of Object.values(themes)) {
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('typography');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('radius');
      expect(theme).toHaveProperty('shadow');
      expect(theme.colors).toHaveProperty('background');
      expect(theme.colors).toHaveProperty('text');
      expect(theme.colors).toHaveProperty('primary');
      expect(theme.colors).toHaveProperty('accent');
    }
  });

  it('getTheme returns a theme by name', () => {
    expect(getTheme('slate').name).toBe('slate');
  });

  it('getTheme throws for unknown theme', () => {
    expect(() => getTheme('nonexistent')).toThrow();
  });
});
