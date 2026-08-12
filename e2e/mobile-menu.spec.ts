import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers';

// The menu only exists below the 860px breakpoint.
test.use({ viewport: { width: 393, height: 852 } });

test.describe('mobile menu', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('replaces the desktop links with a toggle', async ({ page }) => {
    await expect(page.locator('.nav-links')).toBeHidden();
    await expect(page.locator('.menu-btn')).toBeVisible();
    await expect(page.locator('.menu-btn')).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens to reveal every destination', async ({ page }) => {
    await page.locator('.menu-btn').click();

    await expect(page.locator('.menu-btn')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.menu-btn')).toHaveText('✕');
    await expect(page.locator('#nav-menu')).toHaveClass(/open/);

    const links = page.locator('#nav-menu a');
    await expect(links).toHaveCount(5);
    await expect(links).toHaveText(['About', 'Work', 'Skills', 'Contact', 'Résumé ↓']);
    for (let i = 0; i < 5; i++) await expect(links.nth(i)).toBeVisible();
  });

  test('is not clipped by its max-height', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await expect(page.locator('#nav-menu')).toHaveClass(/open/);

    // The `open` class lands before the max-height transition finishes, so poll
    // until the panel settles rather than measuring mid-animation.
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const panel = document.querySelector('#nav-menu')!.getBoundingClientRect().height;
          const content = document.querySelector('.nav-menu-in')!.scrollHeight;
          return panel >= content;
        }),
      )
      .toBe(true);
  });

  test('closes and navigates when a section is chosen', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await page.locator('#nav-menu a', { hasText: 'Skills' }).click();

    await expect(page.locator('#nav-menu')).not.toHaveClass(/open/);
    await expect(page.locator('.menu-btn')).toHaveAttribute('aria-expanded', 'false');

    // The anchor still did its job.
    await expect
      .poll(async () => Math.round(await page.evaluate(() => window.scrollY)))
      .toBeGreaterThan(100);
  });

  test('closes on Escape and returns focus to the toggle', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await expect(page.locator('#nav-menu')).toHaveClass(/open/);

    await page.keyboard.press('Escape');

    await expect(page.locator('#nav-menu')).not.toHaveClass(/open/);
    await expect(page.locator('.menu-btn')).toBeFocused();
  });

  test('closes when the viewport grows past the breakpoint', async ({ page }) => {
    await page.locator('.menu-btn').click();
    await expect(page.locator('#nav-menu')).toHaveClass(/open/);

    await page.setViewportSize({ width: 1280, height: 900 });

    await expect(page.locator('.menu-btn')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.nav-links')).toBeVisible();
  });
});
