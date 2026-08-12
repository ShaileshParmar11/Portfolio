import { useReveal } from '../hooks/useReveal';

interface GlanceRow {
  label: string;
  value: string;
  /** The "Open to work" status renders in green. */
  accent?: boolean;
}

const glance: GlanceRow[] = [
  { label: 'Role', value: 'Frontend Engineer · UI Committer' },
  { label: 'Company', value: 'Collate / OpenMetadata' },
  { label: 'Focus', value: 'Data Observability UI' },
  { label: 'Stack', value: 'React · TypeScript' },
  { label: 'Based in', value: 'Mumbai, India' },
  { label: 'Status', value: 'Open to work', accent: true },
];

export function About() {
  const head = useReveal<HTMLDivElement>();
  const copy = useReveal<HTMLDivElement>();
  const card = useReveal<HTMLDivElement>();

  return (
    <section className="blk" id="about">
      <div className="wrap">
        <div className={`sec-head ${head.revealClass}`} ref={head.ref}>
          <span className="sec-num">01</span>
          <h2 className="sec-title">The OpenMetadata story</h2>
        </div>
        <div className="about-grid">
          <div className={copy.revealClass} ref={copy.ref}>
            <p>
              I build enterprise-scale frontends in React and TypeScript. For 5+
              years I've been a <b>core UI committer at Collate</b>, the company
              behind <b>OpenMetadata</b> — the open-source data platform now at
              15k+ GitHub stars.
            </p>
            <p>
              I <b>own the Data Observability domain</b> — the product's core
              differentiator. I architected the Data Quality UI from scratch,
              built the Data Profiler and Incident Manager end-to-end, and
              shipped Column-Level Lineage that lets teams trace data across
              complex pipelines.
            </p>
            <p>
              I also <b>founded the team's Playwright testing infrastructure</b>,
              migrating 600+ tests off Cypress into a stable safety net — and I
              mentor engineers, review code, and run frontend interviews along
              the way.
            </p>
          </div>
          <div className={`hl-card ${card.revealClass}`} ref={card.ref}>
            <h4>At a glance</h4>
            <ul>
              {glance.map((row) => (
                <li key={row.label}>
                  {row.label}{' '}
                  <span style={row.accent ? { color: '#22c55e' } : undefined}>
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
