import type { Page } from '@playwright/test';

/**
 * Navigate, then wait for web fonts to finish loading.
 *
 * Space Grotesk and Inter are fetched from Google Fonts asynchronously. Until
 * they land the page renders in the fallback face, and swapping them in reflows
 * every section — shifting element offsets by tens of pixels. Any assertion
 * about a position, height or column width must wait for that, or it races the
 * reflow and fails intermittently.
 */
export async function gotoStable(page: Page, path = '/') {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}
