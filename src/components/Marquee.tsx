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

// The track is rendered twice so the -50% keyframe loops seamlessly.
const passes = [0, 1];

export function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {passes.map((pass) => (
          <Fragment key={pass}>
            {items.map((item) => (
              <Fragment key={item.label}>
                <span className={item.on ? 'on' : undefined}>{item.label}</span>
                <span>•</span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
