import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * jsdom has no IntersectionObserver. Rather than a silent no-op stub, this one
 * records every observed element so tests can drive intersection on demand —
 * see `triggerIntersect` below.
 */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  observed = new Set<Element>();
  disconnected = false;

  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.thresholds = [options?.threshold ?? 0].flat();
    MockIntersectionObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.add(el);
  }

  unobserve(el: Element) {
    this.observed.delete(el);
  }

  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Report every currently-observed element, intersecting or not. */
  intersect(isIntersecting = true) {
    const entries = [...this.observed].map(
      (target) => ({ target, isIntersecting }) as IntersectionObserverEntry,
    );
    if (entries.length) this.callback(entries, this);
  }
}

/** Fire an intersection report on every live observer. */
export function triggerIntersect(isIntersecting = true) {
  MockIntersectionObserver.instances.forEach(
    (io) => !io.disconnected && io.intersect(isIntersecting),
  );
}

export function observerInstances() {
  return MockIntersectionObserver.instances;
}

/**
 * jsdom has no matchMedia either. This shim keeps its MediaQueryList objects so
 * `setMediaMatches` can flip a query and notify listeners, letting tests drive
 * breakpoint-dependent behaviour.
 */
interface StubMediaQueryList extends MediaQueryList {
  listeners: Set<(e: MediaQueryListEvent) => void>;
}

const mediaQueryLists = new Map<string, StubMediaQueryList>();

function matchMediaStub(query: string): StubMediaQueryList {
  const existing = mediaQueryLists.get(query);
  if (existing) return existing;

  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: false,
    media: query,
    onchange: null,
    listeners,
    addEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => void listeners.add(l),
    removeEventListener: (_: string, l: (e: MediaQueryListEvent) => void) =>
      void listeners.delete(l),
    addListener: (l: (e: MediaQueryListEvent) => void) => void listeners.add(l),
    removeListener: (l: (e: MediaQueryListEvent) => void) => void listeners.delete(l),
    dispatchEvent: () => true,
  } as unknown as StubMediaQueryList;

  mediaQueryLists.set(query, mql);
  return mql;
}

/** Flip a media query and notify anything listening to it. */
export function setMediaMatches(query: string, matches: boolean) {
  const mql = matchMediaStub(query);
  (mql as { matches: boolean }).matches = matches;
  mql.listeners.forEach((l) => l({ matches, media: query } as MediaQueryListEvent));
}

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  mediaQueryLists.clear();
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  vi.stubGlobal('matchMedia', matchMediaStub);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
