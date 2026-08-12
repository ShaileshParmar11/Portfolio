import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';
import { skills } from '../data/skills';

describe('Skills', () => {
  it('renders one category block per data entry', () => {
    const { container } = render(<Skills />);
    expect(container.querySelectorAll('.skill-cat')).toHaveLength(skills.length);
  });

  it('renders each category heading from the data', () => {
    render(<Skills />);
    for (const skill of skills) {
      expect(screen.getByRole('heading', { name: skill.category })).toBeInTheDocument();
    }
  });

  it('renders every item as a chip, in data order', () => {
    const { container } = render(<Skills />);
    const blocks = [...container.querySelectorAll('.skill-cat')];
    skills.forEach((skill, i) => {
      const chips = [...blocks[i].querySelectorAll('.chip')].map((c) => c.textContent);
      expect(chips).toEqual(skill.items);
    });
  });

  it('numbers the section 03', () => {
    const { container } = render(<Skills />);
    expect(container.querySelector('.sec-num')).toHaveTextContent('03');
  });
});
