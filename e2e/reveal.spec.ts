import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers';

/**
 * These only hold in a real, visible browser: Chrome suspends
 * IntersectionObserver callbacks on backgrounded pages, so a headless-but-hidden
 * context would report every element as never revealed.
 */
test.describe('reveal on scroll', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('every reveal element starts hidden', async ({ page }) => {
    const reveals = page.locator('.reveal');
    await expect(reveals).toHaveCount(12);

    const opacities = await reveals.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).opacity),
    );
    expect(opacities.every((o) => o === '0')).toBe(true);
  });

  test('elements reveal as they are scrolled to', async ({ page }) => {
    const first = page.locator('.reveal').first();
    await expect(first).not.toHaveClass(/\bin\b/);

    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveClass(/\bin\b/);
    await expect(first).toHaveCSS('opacity', '1');
  });

  test('all twelve reveal after scrolling the page', async ({ page }) => {
    await scrollThrough(page);
    await expect(page.locator('.reveal.in')).toHaveCount(12);

    const hidden = await page
      .locator('.reveal')
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity === '0').length);
    expect(hidden).toBe(0);
  });

  test('revealing is one-shot and survives scrolling back up', async ({ page }) => {
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('.reveal.in')).toHaveCount(12);
  });
});

async function scrollThrough(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const step = 400;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 60));
    }
  });
}
