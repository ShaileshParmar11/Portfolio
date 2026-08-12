import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const LINE = 'rgba(255, 255, 255, 0.09)';

test.describe('sticky nav', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('has no border at the top of the page', async ({ page }) => {
    await expect(page.locator('nav')).toHaveCSS('border-bottom-color', TRANSPARENT);
  });

  test('gains a border once scrolled past 20px', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await expect(page.locator('nav')).toHaveClass(/scrolled/);
    await expect(page.locator('nav')).toHaveCSS('border-bottom-color', LINE);
  });

  test('drops the border again back at the top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await expect(page.locator('nav')).toHaveClass(/scrolled/);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('nav')).toHaveCSS('border-bottom-color', TRANSPARENT);
  });
});

test.describe('in-page navigation', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('every nav anchor resolves to a section', async ({ page }) => {
    const hrefs = await page.locator('.nav-links a[href^="#"]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('href')!),
    );
    expect(hrefs).toEqual(['#about', '#work', '#skills', '#contact']);

    for (const href of hrefs) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test('nav targets advance down the page, never backwards', async ({ page }) => {
    // Regression guard: the menu once listed Work before About while the page
    // ran About first, so clicking through it scrolled down, up, then down.
    const offsets = await page.locator('.nav-links a[href^="#"]').evaluateAll((els) =>
      els.map((el) => {
        const target = document.querySelector(el.getAttribute('href')!)!;
        return Math.round(target.getBoundingClientRect().top + window.scrollY);
      }),
    );

    const ascending = offsets.every((y, i) => i === 0 || y > offsets[i - 1]);
    expect(ascending, `offsets should ascend, got ${offsets.join(' -> ')}`).toBe(true);
  });

  test('sections are numbered 01-04 in DOM order', async ({ page }) => {
    await expect(page.locator('.sec-num')).toHaveText(['01', '02', '03']);
    await expect(page.locator('.contact .eyebrow')).toHaveText('04 — Contact');
  });
});
