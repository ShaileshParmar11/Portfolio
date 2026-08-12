import { describe, expect, it } from 'vitest';
import { skills } from './skills';

describe('skills data', () => {
  it('is non-empty and every category has items', () => {
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) {
      expect(skill.category.trim()).not.toBe('');
      expect(skill.items.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate categories, which are used as React keys', () => {
    const categories = skills.map((s) => s.category);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('has no duplicate items within a category, also React keys', () => {
    for (const skill of skills) {
      expect(new Set(skill.items).size).toBe(skill.items.length);
    }
  });

  it('has no blank items', () => {
    const items = skills.flatMap((s) => s.items);
    expect(items.every((i) => i.trim().length > 0)).toBe(true);
  });
});
