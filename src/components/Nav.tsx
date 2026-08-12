import { useEffect, useState } from 'react';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); // browsers restore scroll position on reload
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : undefined}>
      <div className="nav-in">
        <div className="logo">
          Shailesh<span>.</span>
        </div>
        <div className="nav-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="/Shailesh-Parmar-Resume.pdf" className="btn btn-ghost" download>
            Résumé ↓
          </a>
        </div>
        <button className="menu-btn" aria-label="Menu">
          ☰
        </button>
      </div>
    </nav>
  );
}
