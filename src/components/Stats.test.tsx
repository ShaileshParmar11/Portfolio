import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Stats } from './Stats';

describe('Stats', () => {
  it('renders each headline figure with its caption', () => {
    const { container } = render(<Stats />);
    const pairs = [...container.querySelectorAll('.stat')].map((s) => [
      s.querySelector('h3')?.textContent,
      s.querySelector('p')?.textContent,
    ]);
    expect(pairs).toEqual([
      ['15k+', 'OpenMetadata stars I help build'],
      ['1,100+', 'Merged pull requests'],
      ['5+', 'Years of frontend engineering'],
      ['600+', 'E2E tests migrated to Playwright'],
    ]);
  });

  it('applies the gradient treatment to every figure', () => {
    const { container } = render(<Stats />);
    const figures = [...container.querySelectorAll('.stat h3')];
    expect(figures.every((h) => h.classList.contains('grad'))).toBe(true);
  });
});
