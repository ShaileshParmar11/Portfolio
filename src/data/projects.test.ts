import { describe, expect, it } from 'vitest';
import { projects } from './projects';

describe('projects data', () => {
  it('is non-empty', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it.each(projects.map((p) => [p.title, p] as const))('%s has complete content', (_t, project) => {
    expect(project.tag.trim()).not.toBe('');
    expect(project.title.trim()).not.toBe('');
    expect(project.description.trim()).not.toBe('');
    expect(project.chips.length).toBeGreaterThan(0);
    expect(project.links.length).toBeGreaterThan(0);
  });

  it('has exactly one featured project', () => {
    // The full-width grid slot (.proj-grid .feature) assumes a single card.
    expect(projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it('uses absolute, parseable URLs for every link', () => {
    const hrefs = projects.flatMap((p) => p.links.map((l) => l.href));
    for (const href of hrefs) {
      expect(() => new URL(href)).not.toThrow();
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  it('gives every link a visible label', () => {
    const labels = projects.flatMap((p) => p.links.map((l) => l.label));
    expect(labels.every((l) => l.trim().length > 0)).toBe(true);
  });

  it('has no duplicate titles, which are used as React keys', () => {
    const titles = projects.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('has no duplicate link hrefs within a project, also React keys', () => {
    for (const project of projects) {
      const hrefs = project.links.map((l) => l.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it('has no duplicate chips within a project, also React keys', () => {
    for (const project of projects) {
      expect(new Set(project.chips).size).toBe(project.chips.length);
    }
  });
});
