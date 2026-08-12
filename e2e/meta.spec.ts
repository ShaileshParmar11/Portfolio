import { expect, test } from '@playwright/test';

/**
 * These assertions run against raw HTML fetched without a browser, so no
 * JavaScript executes. That is exactly what a social-card crawler sees — and
 * why Netlify's legacy prerendering is no longer needed for this site.
 */
test.describe('crawler-visible metadata', () => {
  test('the raw document carries every SEO and social tag', async ({ request }) => {
    const html = await (await request.get('/')).text();

    const tag = (attr: 'name' | 'property', key: string) =>
      new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, 'i');

    expect(html).toMatch(/<title>Shailesh Parmar — Frontend Engineer<\/title>/);
    expect(html).toMatch(tag('name', 'description'));
    expect(html).toMatch(tag('name', 'author'));

    for (const key of ['og:type', 'og:url', 'og:title', 'og:description', 'og:image']) {
      expect(html, `missing ${key}`).toMatch(tag('property', key));
    }
    for (const key of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      expect(html, `missing ${key}`).toMatch(tag('name', key));
    }
  });

  test('social images are absolute URLs, as crawlers require', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const images = [...html.matchAll(/(?:og|twitter):image["'][^>]*content=["']([^"']+)["']/g)].map(
      (m) => m[1],
    );

    expect(images.length).toBe(2);
    for (const src of images) {
      expect(src).toBe('https://shailesh-parmar.netlify.app/og-image.png');
    }
  });

  test('ships the gradient favicon inline, needing no extra request', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('rel="icon"');
    expect(html).toContain('data:image/svg+xml');
    expect(html).toContain('%237c3aed'); // violet stop
    expect(html).toContain('%23ec4899'); // pink stop
    expect(html).toContain('%2306b6d4'); // cyan stop
  });

  test('preconnects and loads both Google fonts', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(html).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
    expect(html).toContain('Space+Grotesk');
    expect(html).toContain('Inter');
  });

  test('declares the document language and viewport', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toMatch(/<html lang="en">/);
    expect(html).toMatch(/name="viewport"[^>]+width=device-width/);
  });
});
