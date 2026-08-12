import { useReveal } from '../hooks/useReveal';

export function Contact() {
  const { ref, revealClass } = useReveal<HTMLDivElement>();

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className={revealClass} ref={ref}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>
            04 — Contact
          </p>
          <h2>
            Let's build something
            <br />
            <span className="grad">worth shipping.</span>
          </h2>
          <p>
            Open to frontend / SDE roles and interesting collaborations. The
            fastest way to reach me is email.
          </p>
          <div className="cta-row">
            <a
              href="mailto:shailesh.parmar.webdev@gmail.com"
              className="btn btn-primary"
            >
              Say hello →
            </a>
            <a
              href="/Shailesh-Parmar-Resume.pdf"
              className="btn btn-ghost"
              download
            >
              Download résumé ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
