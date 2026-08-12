import { useEffect, useState } from 'react';

// Order matches the page: About (01), Work (02), Skills (03), Contact (04),
// so stepping through the nav always scrolls in one direction.
const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
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
