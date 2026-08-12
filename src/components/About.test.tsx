import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About', () => {
  it('numbers the section 01 and titles it', () => {
    const { container } = render(<About />);
    expect(container.querySelector('.sec-num')).toHaveTextContent('01');
    expect(screen.getByRole('heading', { name: 'The OpenMetadata story' })).toBeInTheDocument();
  });

  it('renders every at-a-glance row as a label/value pair', () => {
    const { container } = render(<About />);
    const rows = [...container.querySelectorAll('.hl-card li')];
    expect(rows.map((li) => li.querySelector('span')?.textContent)).toEqual([
      'Frontend Engineer · UI Committer',
      'Collate / OpenMetadata',
      'Data Observability UI',
      'React · TypeScript',
      'Mumbai, India',
      'Open to work',
    ]);
  });

  it('accents the availability status in green', () => {
    const { container } = render(<About />);
    const status = [...container.querySelectorAll('.hl-card li')]
      .find((li) => li.textContent?.includes('Open to work'))!
      .querySelector('span')!;
    expect(status).toHaveStyle({ color: '#22c55e' });
  });
});
