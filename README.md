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

## Testing

```bash
npm test           # unit + component tests (Vitest, jsdom)
npm run test:watch # same, in watch mode
npm run test:coverage
npm run test:e2e   # Playwright, against a production build
```

Two layers, split by what each can honestly verify:

- **Vitest + Testing Library** covers pure logic, data integrity and component
  render output.
- **Playwright** covers everything needing a real browser — reveal-on-scroll,
  the sticky-nav border, the mobile menu, breakpoints, `prefers-reduced-motion`
  and crawler-visible metadata.

The split is deliberate: jsdom implements neither `IntersectionObserver` nor
layout, so a jsdom-only suite would report green while reveal-on-scroll and
smooth anchor scrolling were broken. `playwright.config.ts` builds the site and
serves `dist/`, so E2E runs against the same bundle Netlify deploys.

CI runs lint, type-check, build, both suites and uploads the Playwright report
on failure.

## Deployment

Deployed to **Netlify** (see `netlify.toml`):

- Build command: `npm run build`
- Publish directory: `dist`
- `NODE_VERSION = "22"` — Vite 8 requires Node `^20.19.0 || >=22.12.0`, and CI
  pins the same version so it matches the deploy build.

This only runs if the Netlify site is linked to this repo for continuous
deployment (**Project configuration → Build & deploy**). Without that link,
pushing to `master` does not publish.

## Structure

```text
index.html               # document head: meta/OpenGraph tags, fonts, favicon
netlify.toml             # build command, publish dir, Node version
public/                  # og-image.png, Shailesh-Parmar-Resume.pdf
src/
  main.tsx               # entry point, imports the global stylesheet
  App.tsx                # composes the page sections
  components/            # Nav, Hero, Stats, Marquee, About, Projects, Skills, Contact, Footer
  data/                  # typed projects + skills arrays
  hooks/useReveal.ts     # IntersectionObserver reveal-on-scroll
  utils/links.ts         # new-tab props for external links
  styles/global.css      # all styles (design tokens in :root)
  types.ts               # Project and Skill interfaces
  test/setup.ts          # jsdom stubs for IntersectionObserver and matchMedia
  **/*.test.ts(x)        # unit and component tests, beside what they cover
e2e/                     # Playwright specs + gotoStable() helper
.github/workflows/ci.yml # lint, build, both test suites
```

Config lives at the root: `vite.config.ts` (build + Vitest), `playwright.config.ts`,
and `tsconfig.{app,node,test}.json` behind the solution `tsconfig.json`.

To update content, edit the typed arrays in `src/data/` — the cards and chips are
rendered from them, and `src/data/*.test.ts` guards against blank fields and
duplicate React keys.
