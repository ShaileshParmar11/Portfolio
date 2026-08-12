import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers';

/**
 * Invariant-based fidelity: assert the tokens, breakpoints and structure that
 * shouldn't drift by accident, rather than pixel snapshots (which depend on the
 * OS font renderer and fail in CI containers).
 */
test.describe('design invariants', () => {
  test.beforeEach(async ({ page }) => await gotoStable(page));

  test('root colour tokens match the original design', async ({ page }) => {
    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const read = (name: string) => cs.getPropertyValue(name).trim();
      return {
        bg: read('--bg'),
        bg2: read('--bg2'),
        txt: read('--txt'),
        muted: read('--muted'),
        v: read('--v'),
        p: read('--p'),
        c: read('--c'),
      };
    });

    // --card and --line are deliberately absent: esbuild rewrites their
    // rgba() form to #ffffff09 / #ffffff17 in the bundle. They are covered
    // below via the colours they resolve to on real elements.
    expect(tokens).toEqual({
      bg: '#08080c',
      bg2: '#0d0d14',
      txt: '#f2f2f5',
      muted: '#9a9aa7',
      v: '#7c3aed',
      p: '#ec4899',
      c: '#06b6d4',
    });
  });

  test('translucent surface tokens resolve to the original colours', async ({ page }) => {
    await expect(page.locator('.pill')).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.035)');
    await expect(page.locator('.card').first()).toHaveCSS(
      'border-top-color',
      'rgba(255, 255, 255, 0.09)',
    );
  });

  test('page background and body typography are unchanged', async ({ page }) => {
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(8, 8, 12)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(242, 242, 245)');
    const font = await page.locator('body').evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toContain('Inter');
  });

  test('gradient text uses the three-stop brand gradient clipped to the glyphs', async ({
    page,
  }) => {
    const grad = page.locator('h1 .grad');
    await expect(grad).toHaveCSS('background-clip', 'text');
    await expect(grad).toHaveCSS('color', 'rgba(0, 0, 0, 0)');
    const image = await grad.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(image).toContain('rgb(124, 58, 237)');
    expect(image).toContain('rgb(236, 72, 153)');
    expect(image).toContain('rgb(6, 182, 212)');
  });

  test('display headings use Space Grotesk', async ({ page }) => {
    const font = await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toContain('Space Grotesk');
  });

  test('sections appear in the intended order', async ({ page }) => {
    const order = await page.evaluate(() =>
      [...document.querySelectorAll('section[id], div.stats, div.marquee, header, footer')].map(
        (el) => el.id || el.className.split(' ')[0] || el.tagName.toLowerCase(),
      ),
    );
    expect(order).toEqual([
      'header',
      'stats',
      'marquee',
      'about',
      'work',
      'skills',
      'contact',
      'footer',
    ]);
  });

  test('the marquee halves are equal width, so the loop is seamless', async ({ page }) => {
    const { first, second } = await page.evaluate(() => {
      const spans = [...document.querySelectorAll('.marquee-track > span')];
      const width = (arr: Element[]) =>
        Math.round(
          arr.reduce((sum, el) => {
            const cs = getComputedStyle(el);
            return (
              sum +
              el.getBoundingClientRect().width +
              parseFloat(cs.marginLeft) +
              parseFloat(cs.marginRight)
            );
          }, 0),
        );
      const half = spans.length / 2;
      return { first: width(spans.slice(0, half)), second: width(spans.slice(half)) };
    });
    expect(first).toBe(second);
  });

  test('animations are wired up', async ({ page }) => {
    await expect(page.locator('.blob1')).toHaveCSS('animation-name', 'float');
    await expect(page.locator('.dot')).toHaveCSS('animation-name', 'pulse');
    await expect(page.locator('.marquee-track')).toHaveCSS('animation-name', 'scroll');
  });
});

test.describe('responsive layout', () => {
  test('collapses to a single column below the breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 859, height: 900 });
    await gotoStable(page);

    await expect(page.locator('.nav-links')).toBeHidden();
    await expect(page.locator('.menu-btn')).toBeVisible();

    expect(await columnCount(page, '.proj-grid')).toBe(1);
    expect(await columnCount(page, '.about-grid')).toBe(1);
    expect(await columnCount(page, '.skills-grid')).toBe(1);
    expect(await columnCount(page, '.stats-in')).toBe(2);
  });

  test('uses the full multi-column layout above the breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 861, height: 900 });
    await gotoStable(page);

    await expect(page.locator('.nav-links')).toBeVisible();
    await expect(page.locator('.menu-btn')).toBeHidden();

    expect(await columnCount(page, '.proj-grid')).toBe(2);
    expect(await columnCount(page, '.about-grid')).toBe(2);
    expect(await columnCount(page, '.skills-grid')).toBe(3);
    expect(await columnCount(page, '.stats-in')).toBe(4);
  });
});

async function columnCount(page: import('@playwright/test').Page, selector: string) {
  return page
    .locator(selector)
    .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
}
