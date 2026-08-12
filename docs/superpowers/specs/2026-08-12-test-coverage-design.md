# Test coverage for the Vite + React + TS portfolio

Date: 2026-08-12
Status: approved

## Goal

Add a test suite that serves four purposes at once, agreed with the repo owner:

1. **Showcase of testing craft** — the repo is public and the owner's résumé leads
   with Playwright expertise, so the specs are read as work product.
2. **Regression safety net** — copy, projects and styles will keep changing.
3. **CI gate** — a broken merge must not reach Netlify.
4. **Design-fidelity lock**, *invariant-based* — assert tokens, breakpoints and
   structure rather than pixels, so deliberate design changes stay cheap.

## Approach

Two layers, chosen deliberately:

- **Vitest + React Testing Library (jsdom)** for deterministic logic — pure
  functions, data integrity, component render output, hook state machines.
- **Playwright** for everything only a real browser can answer.

The split is not stylistic. During the rebuild, two behaviours read as broken
until they were checked in a real, visible browser: reveal-on-scroll (Chrome
suspends `IntersectionObserver` on backgrounded pages) and nav anchor clicks
(`scroll-behavior: smooth` is driven by `requestAnimationFrame`). jsdom
implements neither `IntersectionObserver` nor layout, so a jsdom-only suite
would report green while those features were dead. Anything depending on
layout, geometry, media queries, scrolling or intersection belongs in
Playwright; everything else belongs in Vitest, where feedback is faster.

Rejected alternatives: **Playwright-only** (pays a server boot and page load to
assert a pure function, clumsy for data integrity) and **Vitest-only** (blind to
every high-risk behaviour in this project). Vitest browser mode could later
merge the two runners, but it is young and adds config surface; not now.

## Tooling and layout

```text
vite.config.ts             # + test block, via a vitest/config reference
playwright.config.ts       # webServer runs build && preview
tsconfig.test.json         # vitest types for tests; app config stays clean
src/test/setup.ts          # RTL matchers + IntersectionObserver mock
src/**/*.test.ts(x)        # co-located unit and component tests
e2e/*.spec.ts              # Playwright specs
.github/workflows/ci.yml
```

New dev dependencies: `vitest`, `@vitest/coverage-v8`, `jsdom`,
`@testing-library/react`, `@testing-library/jest-dom`,
`@testing-library/user-event`, `@playwright/test`.

New scripts:

```json
"test":          "vitest run",
"test:watch":    "vitest",
"test:coverage": "vitest run --coverage",
"test:e2e":      "playwright test"
```

Two decisions worth recording:

- `tsconfig.app.json` gains an `exclude` for `src/**/*.test.ts`,
  `src/**/*.test.tsx` and `src/test/**`, so `npm run build` does not
  type-check tests. `tsconfig.test.json` covers them instead and is added to the
  solution config's `references`.
- Playwright's `webServer` runs `npm run build && npm run preview` on port 4173,
  so E2E exercises the exact production bundle Netlify serves, not the dev
  server. `reuseExistingServer` is enabled outside CI.

## Vitest layer

| File | Assertions |
|---|---|
| `src/utils/links.test.ts` | `http`/`https` return `target="_blank"` and `rel="noopener noreferrer"`; `mailto:`, `#anchor` and `/file.pdf` return `{}`; uppercase `HTTPS://` still matches; protocol-relative `//host` returns `{}` (documents current behaviour) |
| `src/data/projects.test.ts` | every field non-empty; exactly one entry has `featured: true`, since the full-width grid slot depends on it; every `links[].href` parses as an absolute URL; no duplicate titles, which are used as React keys |
| `src/data/skills.test.ts` | no duplicate categories; no duplicate items within a category; both are React keys |
| `src/hooks/useReveal.test.ts` | initial class is `reveal`; becomes `reveal in` when the observer reports intersection; observer disconnects after the first hit (one-shot); falls back to revealed when `IntersectionObserver` is undefined; disconnects on unmount |
| `src/components/Projects.test.tsx` | one card per data entry; chips match the data; the featured entry receives the `feature` class; project links carry `target` and `rel` |
| `src/components/Skills.test.tsx` | one category block per entry; chips match the data |
| `src/components/Marquee.test.tsx` | items render exactly twice; the first pass carries no `aria-hidden`; every span of the second pass is `aria-hidden`; accessible text names each technology once |
| `src/components/Nav.test.tsx` | menu closed initially; toggle flips `aria-expanded` and swaps ☰/✕; clicking a link closes it; Escape closes it and returns focus to the button; link order is About, Work, Skills, Contact |
| `src/components/Footer.test.tsx` | renders the current year |
| `src/components/Hero.test.tsx` | résumé link points at `/Shailesh-Parmar-Resume.pdf` and carries `download`; social links carry `target` and `rel`; the `mailto:` link does not |

`src/test/setup.ts` installs a controllable `IntersectionObserver` stub so
components using `useReveal` (About, Projects, Skills, Contact) render, and so
`useReveal` tests can trigger intersection on demand.

## Playwright layer

Projects: `desktop-chromium` at 1280×900 and `mobile-chromium` at 393×852.

| Spec | Assertions |
|---|---|
| `e2e/reveal.spec.ts` | all 12 `.reveal` elements start at `opacity: 0`; each gains `.in` once scrolled to; they stay revealed after scrolling back (one-shot); none remain hidden at the bottom of the page |
| `e2e/nav.spec.ts` | nav border is transparent at the top, `--line` past 20px, transparent again on return; nav link targets strictly increase down the page, locking the menu-order fix; every `#anchor` resolves to an element |
| `e2e/mobile-menu.spec.ts` | at 393px the desktop links are hidden and ☰ is shown; toggling sets `aria-expanded` and swaps the icon; the panel is not clipped by its `max-height`; clicking a link both closes the panel and navigates; Escape closes it and restores focus; growing past 860px closes it |
| `e2e/links.spec.ts` | every `http(s)` anchor has `target="_blank"` and `rel="noopener noreferrer"`; anchors, `mailto:` and the résumé deliberately do not; `/Shailesh-Parmar-Resume.pdf` responds 200 `application/pdf`; `/og-image.png` responds 200 `image/png` |
| `e2e/design-invariants.spec.ts` | `:root` tokens resolve to the original values (`--bg #08080c`, `--bg2 #0d0d14`, `--txt #f2f2f5`, `--muted #9a9aa7`, `--v #7c3aed`, `--p #ec4899`, `--c #06b6d4`); `.grad` carries the three-stop gradient with `background-clip: text`; at 859px the project, about and skills grids are single-column and the stats grid is two-column; at 861px the project grid is two-column, the about grid is `1.35fr 1fr`, the skills grid is three-column and the stats grid is four-column; the two marquee halves are equal width; sections appear in DOM order about, work, skills, contact and are numbered 01–04 |
| `e2e/reduced-motion.spec.ts` | with `reducedMotion: 'reduce'`, `scroll-behavior` computes to `auto` and an anchor click lands immediately rather than animating; `.reveal` elements are visible without scrolling |
| `e2e/meta.spec.ts` | raw HTML fetched via `request.get('/')` — no JavaScript executed, i.e. exactly a crawler's view — contains the title, description, all OpenGraph and Twitter tags, and the gradient favicon data URI |

`e2e/meta.spec.ts` is the one that encodes *why* Netlify's legacy prerendering
can be switched off: it proves the social and SEO metadata is present before any
script runs.

One trap to avoid when implementing the token assertions: `--card` and `--line`
are deliberately absent from the list. esbuild's CSS minifier rewrites
`rgba(255,255,255,.035)` to `#ffffff09` and `rgba(255,255,255,.09)` to
`#ffffff17` in the production bundle, so asserting their authored form against
the built site fails even though the rendered colour is identical. Assert the
colours those variables *resolve to* on a real element instead — for example
`.pill` background and `.card` border — not the raw custom-property text.

## CI

`.github/workflows/ci.yml`, triggered on push and pull request:

1. checkout, `actions/setup-node` with Node 22 and npm cache — Node 22 matches
   `netlify.toml`, so CI and the deploy build agree
2. `npm ci`
3. `npm run lint`
4. `npm run build`
5. `npm run test:coverage`
6. `npx playwright install --with-deps chromium`
7. `npm run test:e2e`
8. upload the Playwright HTML report as an artifact when a run fails

Coverage thresholds apply to `src/utils/**`, `src/hooks/**` and `src/data/**`
only, at 90% lines and branches. Presentational components are deliberately
excluded from thresholds: they are covered by both layers, and blanket
thresholds there reward assertion-padding rather than safety.

## Out of scope

- Screenshot or pixel-diff testing — rejected in favour of invariant assertions,
  because screenshots depend on the OS font renderer and typically pass locally
  while failing in CI's Linux containers.
- WebKit and Firefox projects. The config is structured so they are a few lines
  to add, but CI stays on Chromium to keep runs fast.
- Testing the archived Create React App code, which was deleted in this rebuild.
- Any change to application behaviour. If a test uncovers a genuine bug, it is
  raised separately rather than fixed silently inside this work.
