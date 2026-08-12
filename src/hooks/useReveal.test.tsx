import { describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useReveal } from './useReveal';
import { observerInstances, triggerIntersect } from '../test/setup';

function Probe() {
  const { ref, revealClass } = useReveal<HTMLDivElement>();
  return <div ref={ref} className={revealClass} data-testid="probe" />;
}

const probe = () => screen.getByTestId('probe');

describe('useReveal', () => {
  it('starts hidden, carrying only the reveal class', () => {
    render(<Probe />);
    expect(probe()).toHaveClass('reveal');
    expect(probe()).not.toHaveClass('in');
  });

  it('observes the element it is attached to', () => {
    render(<Probe />);
    const [io] = observerInstances();
    expect(io.observed.has(probe())).toBe(true);
  });

  it('uses a 12% threshold, matching the original design', () => {
    render(<Probe />);
    expect(observerInstances()[0].thresholds).toEqual([0.12]);
  });

  it('reveals once the element intersects', () => {
    render(<Probe />);
    act(() => triggerIntersect());
    expect(probe()).toHaveClass('reveal', 'in');
  });

  it('is one-shot: it stops observing after the first intersection', () => {
    render(<Probe />);
    act(() => triggerIntersect());
    expect(observerInstances()[0].disconnected).toBe(true);
  });

  it('stays revealed if intersection is reported again', () => {
    render(<Probe />);
    act(() => triggerIntersect());
    act(() => triggerIntersect());
    expect(probe()).toHaveClass('in');
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<Probe />);
    const [io] = observerInstances();
    expect(io.disconnected).toBe(false);
    unmount();
    expect(io.disconnected).toBe(true);
  });

  it('stays hidden while the element is reported as not intersecting', () => {
    render(<Probe />);
    act(() => triggerIntersect(false));
    expect(probe()).not.toHaveClass('in');
    expect(observerInstances()[0].disconnected).toBe(false);
  });

  it('does nothing when the ref is never attached to an element', () => {
    renderHook(() => useReveal<HTMLDivElement>());
    expect(observerInstances()).toHaveLength(0);
  });

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    // Without this fallback the content would sit at opacity 0 forever.
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Probe />);
    expect(probe()).toHaveClass('reveal', 'in');
  });
});
