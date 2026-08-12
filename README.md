# Shailesh Parmar — Portfolio

Personal portfolio site built with **Vite + React + TypeScript**.

**Live:** <https://shailesh-parmar.netlify.app/>

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build -> dist/
npm run preview  # serve the production build locally
```

## Deployment

Deployed to **Netlify** (see `netlify.toml`):

- Build command: `npm run build`
- Publish directory: `dist`

## Structure

```text
index.html              # document head: meta/OpenGraph tags, fonts, favicon
public/                 # og-image.png, Shailesh-Parmar-Resume.pdf
src/
  main.tsx              # entry point, imports the global stylesheet
  App.tsx               # composes the page sections
  components/           # Nav, Hero, Stats, Marquee, About, Projects, Skills, Contact, Footer
  data/                 # typed projects + skills arrays
  hooks/useReveal.ts    # IntersectionObserver reveal-on-scroll
  styles/global.css     # all styles (design tokens in :root)
  types.ts              # Project and Skill interfaces
```

To update content, edit the typed arrays in `src/data/` — the cards and chips are
rendered from them.

## Legacy

The site was previously a Create React App project. That code was removed in
this rebuild and lives on in git history — commit `680689c` is the last one
with the CRA app intact at its original paths:

```bash
git show 680689c:package.json      # inspect a single file
git checkout 680689c -- src public # restore into the working tree
```

## Credits

Original CRA template by [Tim Baker](https://github.com/tbakerx/react-resume-template),
based on the [Ceevee template by Styleshout](https://www.styleshout.com/free-templates/ceevee/).
