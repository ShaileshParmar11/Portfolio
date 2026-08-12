const socials = [
  { label: 'GitHub ↗', href: 'https://github.com/ShaileshParmar11' },
  { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/shailesh-parmar-dev' },
  { label: 'Email ↗', href: 'mailto:shailesh.parmar.webdev@gmail.com' },
];

export function Hero() {
  return (
    <header>
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
      <div className="wrap hero-in hero">
        <div className="pill">
          <span className="dot" /> Open to frontend / SDE opportunities
        </div>
        <h1>
          Frontend engineer
          <br />
          building <span className="grad">data-scale UIs</span>.
        </h1>
        <p className="lead">
          I'm <b>Shailesh Parmar</b> — a core UI committer on <b>OpenMetadata</b>{' '}
          (15k+ ⭐), where I own the <b>Data Observability</b> experience used by
          enterprises worldwide. 5+ years turning complex data problems into
          interfaces people love.
        </p>
        <div className="cta-row">
          <a href="#work" className="btn btn-primary">
            View my work
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in touch
          </a>
        </div>
        <div className="socials">
          {socials.map((social) => (
            <a key={social.href} href={social.href}>
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
