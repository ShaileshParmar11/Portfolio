import { useEffect, useRef, useState } from 'react';

// Order matches the page: About (01), Work (02), Skills (03), Contact (04),
// so stepping through the nav always scrolls in one direction.
const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const RESUME = '/Shailesh-Parmar-Resume.pdf';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); // browsers restore scroll position on reload
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuBtn.current?.focus();
    };

    // The panel is display:none above the breakpoint; close it on the way out
    // so the button doesn't report aria-expanded="true" from a stale state.
    const wide = window.matchMedia('(min-width: 861px)');
    const onBreakpoint = () => wide.matches && setMenuOpen(false);

    window.addEventListener('keydown', onKeyDown);
    wide.addEventListener('change', onBreakpoint);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      wide.removeEventListener('change', onBreakpoint);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

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
          <a href={RESUME} className="btn btn-ghost" download>
            Résumé ↓
          </a>
        </div>
        <button
          ref={menuBtn}
          className="menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div id="nav-menu" className={menuOpen ? 'nav-menu open' : 'nav-menu'}>
        <div className="nav-menu-in">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <a href={RESUME} className="btn btn-ghost" download onClick={close}>
            Résumé ↓
          </a>
        </div>
      </div>
    </nav>
  );
}
