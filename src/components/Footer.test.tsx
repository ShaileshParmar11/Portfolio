import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

afterEach(() => vi.useRealTimers());

describe('Footer', () => {
  it('shows the current year', () => {
    render(<Footer />);
    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
  });

  it('tracks the clock rather than hardcoding a year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2031-03-04T00:00:00Z'));
    render(<Footer />);
    expect(screen.getByText('2031')).toBeInTheDocument();
  });

  it('opens its external links in a new tab with a safe rel', () => {
    render(<Footer />);
    for (const name of ['GitHub', 'LinkedIn', 'Snippet Builder']) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
