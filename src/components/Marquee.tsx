import { Fragment } from 'react';

interface MarqueeItem {
  label: string;
  /** Highlighted items render in full-contrast text instead of muted. */
  on: boolean;
}

const items: MarqueeItem[] = [
  { label: 'React', on: true },
  { label: 'TypeScript', on: false },
  { label: 'Playwright', on: true },
  { label: 'Tailwind CSS', on: false },
  { label: 'D3.js', on: true },
  { label: 'Node.js', on: false },
  { label: 'Design Systems', on: true },
  { label: 'Data Viz', on: false },
];

// The track is rendered twice so the -50% keyframe loops seamlessly. The second
// pass is a purely visual duplicate, so it is hidden from assistive tech —
// marked per-span rather than with a wrapper, since `.marquee-track span` adds
// horizontal margins that an extra element would bake into the layout.
const passes = [
  { id: 'a', decorative: false },
  { id: 'b', decorative: true },
];

export function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {passes.map((pass) => (
          <Fragment key={pass.id}>
            {items.map((item) => (
              <Fragment key={item.label}>
                <span
                  className={item.on ? 'on' : undefined}
                  aria-hidden={pass.decorative || undefined}
                >
                  {item.label}
                </span>
                <span aria-hidden={pass.decorative || undefined}>•</span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
