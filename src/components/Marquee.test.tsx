import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Marquee } from './Marquee';

const TECHS = [
  'React',
  'TypeScript',
  'Playwright',
  'Tailwind CSS',
  'D3.js',
  'Node.js',
  'Design Systems',
  'Data Viz',
];

function setup() {
  const { container } = render(<Marquee />);
  const spans = [...container.querySelectorAll('.marquee-track > span')];
  return { container, spans };
}

describe('Marquee', () => {
  it('renders the track twice so the -50% keyframe loops seamlessly', () => {
    const { spans } = setup();
    // 8 techs + 8 bullet separators, duplicated.
    expect(spans).toHaveLength(TECHS.length * 2 * 2);
  });

  it('adds no wrapper elements, which would inherit the span margins', () => {
    const { container } = setup();
    const track = container.querySelector('.marquee-track')!;
    expect([...track.children].every((el) => el.tagName === 'SPAN')).toBe(true);
  });

  it('leaves the first pass readable by assistive tech', () => {
    const { spans } = setup();
    const first = spans.slice(0, spans.length / 2);
    expect(first.some((s) => s.hasAttribute('aria-hidden'))).toBe(false);
  });

  it('hides the duplicate pass from assistive tech', () => {
    const { spans } = setup();
    const second = spans.slice(spans.length / 2);
    expect(second.every((s) => s.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('announces each technology exactly once', () => {
    const { spans } = setup();
    const announced = spans
      .filter((s) => !s.hasAttribute('aria-hidden'))
      .map((s) => s.textContent);
    for (const tech of TECHS) {
      expect(announced.filter((t) => t === tech)).toHaveLength(1);
    }
  });

  it('highlights alternating technologies via the .on class', () => {
    const { spans } = setup();
    const highlighted = spans.filter((s) => s.classList.contains('on')).map((s) => s.textContent);
    expect(highlighted).toEqual([
      'React',
      'Playwright',
      'D3.js',
      'Design Systems',
      'React',
      'Playwright',
      'D3.js',
      'Design Systems',
    ]);
  });
});
