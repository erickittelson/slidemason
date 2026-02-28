import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TitleSlide } from '../templates/TitleSlide';

describe('TitleSlide', () => {
  it('renders the title', () => {
    render(<TitleSlide title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(<TitleSlide title="Hello" subtitle="World" />);
    expect(screen.getByText('World')).toBeDefined();
  });

  it('renders badge when provided', () => {
    render(<TitleSlide title="Hello" badge="MVP" />);
    expect(screen.getByText('MVP')).toBeDefined();
  });
});
