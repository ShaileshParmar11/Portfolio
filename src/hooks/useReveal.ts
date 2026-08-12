import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll, ported from the original inline IntersectionObserver script.
 *
 * Attach `ref` to the element and spread `revealClass` into its className. The
 * element starts at `.reveal` (faded + nudged down) and gains `.in` the first
 * time it crosses the 12% threshold — it never reverts, matching the original's
 * `io.unobserve()` one-shot behaviour.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or SSR/JSDOM): show the content rather than
    // leaving it permanently invisible.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealClass: revealed ? 'reveal in' : 'reveal' } as const;
}
