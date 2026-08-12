import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('composes every section in page order', () => {
    const { container } = render(<App />);
    const landmarks = [...container.querySelectorAll('nav, header, div.stats, div.marquee, section, footer')].map(
      (el) => el.id || el.className.split(' ')[0] || el.tagName.toLowerCase(),
    );
    expect(landmarks).toEqual([
      'nav',
      'header',
      'stats',
      'marquee',
      'about',
      'work',
      'skills',
      'contact',
      'footer',
    ]);
  });

  it('renders a single h1', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });
});
