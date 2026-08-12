import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the headline across its line break', () => {
    render(<Hero />);
    // The <br /> yields no whitespace in textContent, so assert the parts.
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Frontend engineer');
    expect(heading).toHaveTextContent('data-scale UIs');
  });

  it('gradient-treats only the second half of the headline', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('h1 .grad')).toHaveTextContent('data-scale UIs');
  });

  it('keeps the in-page CTAs in the current tab', () => {
    render(<Hero />);
    for (const [name, href] of [
      ['View my work', '#work'],
      ['Get in touch', '#contact'],
    ]) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).not.toHaveAttribute('target');
    }
  });

  it('opens social profiles in a new tab with a safe rel', () => {
    render(<Hero />);
    for (const name of ['GitHub ↗', 'LinkedIn ↗']) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('leaves the mailto link in the current tab, so no blank tab is stranded', () => {
    render(<Hero />);
    const email = screen.getByRole('link', { name: 'Email ↗' });
    expect(email).toHaveAttribute('href', 'mailto:shailesh.parmar.webdev@gmail.com');
    expect(email).not.toHaveAttribute('target');
  });
});
