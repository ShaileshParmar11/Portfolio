import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';
import { projects } from '../data/projects';

function cards() {
  const { container } = render(<Projects />);
  return [...container.querySelectorAll('.card')];
}

describe('Projects', () => {
  it('renders one card per data entry rather than hardcoded markup', () => {
    expect(cards()).toHaveLength(projects.length);
  });

  it('renders each project title and description from the data', () => {
    render(<Projects />);
    for (const project of projects) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
    }
  });

  it('renders every chip for every project', () => {
    const rendered = cards();
    projects.forEach((project, i) => {
      const chips = [...rendered[i].querySelectorAll('.chip')].map((c) => c.textContent);
      expect(chips).toEqual(project.chips);
    });
  });

  it('gives the featured project the full-width grid class', () => {
    const rendered = cards();
    projects.forEach((project, i) => {
      expect(rendered[i].classList.contains('feature')).toBe(Boolean(project.featured));
    });
  });

  it('opens every project link in a new tab with a safe rel', () => {
    // Scoped per card: two projects share the label "Live site ↗".
    const rendered = cards();
    projects.forEach((project, i) => {
      const links = [...rendered[i].querySelectorAll('.card-links a')];
      expect(links.map((a) => a.textContent)).toEqual(project.links.map((l) => l.label));
      links.forEach((link, j) => {
        expect(link).toHaveAttribute('href', project.links[j].href);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  it('numbers the section 02', () => {
    const { container } = render(<Projects />);
    expect(container.querySelector('.sec-num')).toHaveTextContent('02');
  });
});
