import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.describe('prefers-reduced-motion', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('disables smooth scrolling', async ({ page }) => {
    // scroll-behavior is neither an animation nor a transition, so the blanket
    // reset in the media query does not cover it — it needs its own rule.
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  });

  test('anchor navigation jumps instead of animating', async ({ page }) => {
    const { target, maxScroll } = await page.evaluate(() => ({
      target: Math.round(
        document.querySelector('#work')!.getBoundingClientRect().top + window.scrollY,
      ),
      maxScroll: Math.round(document.documentElement.scrollHeight - window.innerHeight),
    }));

    // The hero CTA, unlike the nav links, is present at every viewport width.
    await page.locator('.hero .cta-row a[href="#work"]').click();

    // No settling time: with motion reduced the jump is immediate. The browser
    // clamps at the end of the document, so a near-bottom target never lands
    // exactly on its own offset.
    const landed = await page.evaluate(() => Math.round(window.scrollY));
    expect(Math.abs(landed - Math.min(target, maxScroll))).toBeLessThanOrEqual(2);
  });

  test('shows all content without waiting for reveal animations', async ({ page }) => {
    const hidden = await page
      .locator('.reveal')
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length);
    expect(hidden).toBe(0);
  });

  test('stops the decorative animations', async ({ page }) => {
    const running = await page.evaluate(
      () =>
        [...document.querySelectorAll('.blob, .dot, .marquee-track')].filter(
          (el) => getComputedStyle(el).animationName !== 'none',
        ).length,
    );
    expect(running).toBe(0);
  });
});
