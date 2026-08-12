const socials = [
  { label: 'GitHub', href: 'https://github.com/ShaileshParmar11' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/shailesh-parmar-dev' },
  { label: 'Snippet Builder', href: 'https://snippetbuilder.com' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        © <span id="yr">{year}</span> Shailesh Parmar — built with care.
        <div className="socials">
          {socials.map((social) => (
            <a key={social.href} href={social.href}>
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
