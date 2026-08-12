import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers';

test.describe('link wiring', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('every external link opens in a new tab with a safe rel', async ({ page }) => {
    const external = await page.locator('a[href^="http"]').evaluateAll((els) =>
      els.map((el) => ({
        href: el.getAttribute('href'),
        target: el.getAttribute('target'),
        rel: el.getAttribute('rel'),
      })),
    );

    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link, `${link.href} should open in a new tab`).toMatchObject({
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    }
  });

  test('in-page, mailto and resume links stay in the current tab', async ({ page }) => {
    const internal = await page
      .locator('a:not([href^="http"])')
      .evaluateAll((els) =>
        els.map((el) => ({ href: el.getAttribute('href'), target: el.getAttribute('target') })),
      );

    expect(internal.length).toBeGreaterThan(0);
    for (const link of internal) {
      expect(link.target, `${link.href} should not open a new tab`).toBeNull();
    }
  });

  test('actually opens a new tab when an external link is clicked', async ({ page, context }) => {
    const popup = context.waitForEvent('page');
    await page.locator('a[href="https://reactplay.io"]').first().click();

    const opened = await popup;
    expect(opened.url()).toContain('reactplay.io');
    // The portfolio is still there behind it.
    expect(page.url()).toContain('localhost');
    await opened.close();
  });

  test('both resume buttons point at the downloadable PDF', async ({ page }) => {
    const resume = page.locator('a[href="/Shailesh-Parmar-Resume.pdf"]');
    await expect(resume).toHaveCount(3); // nav, mobile menu, contact
    for (const el of await resume.all()) {
      await expect(el).toHaveAttribute('download', '');
    }
  });

  test('serves the resume and social image', async ({ request }) => {
    const pdf = await request.get('/Shailesh-Parmar-Resume.pdf');
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()['content-type']).toContain('application/pdf');

    const og = await request.get('/og-image.png');
    expect(og.status()).toBe(200);
    expect(og.headers()['content-type']).toContain('image/png');
  });
});
