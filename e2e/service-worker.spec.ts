import { expect, test } from '@playwright/test';

/**
 * The site was previously a Create React App project, which called
 * registerServiceWorker() in production. That registered a worker at
 * /service-worker.js which precached the old app shell, and CRA's
 * unregister-on-404 recovery only ever ran on localhost — so the worker is
 * still installed in every browser that visited the old site, serving asset
 * URLs that no longer exist.
 *
 * The file these tests cover is a kill switch: it replaces that worker, drops
 * every cache, unregisters itself and reloads the tab. It must keep being
 * served at exactly the old path until returning visitors have been healed.
 */
test.describe('legacy service worker kill switch', () => {
  test('is served at the path the old CRA app registered', async ({ request }) => {
    const res = await request.get('/service-worker.js');

    expect(res.status(), 'a 404 here leaves the stale worker in place').toBe(200);
    expect(res.headers()['content-type']).toContain('javascript');

    const body = await res.text();
    expect(body).toContain('unregister');
    expect(body).toContain('caches.delete');
  });

  test('unregisters itself and clears caches when registered', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(async () => {
      // Seed a cache so we can prove the worker empties it.
      const cache = await caches.open('stale-cra-precache');
      await cache.put('/legacy-asset', new Response('old'));

      await navigator.serviceWorker.register('/service-worker.js');

      // The worker skips waiting, so activation and teardown are immediate.
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const cacheKeys = await caches.keys();
        if (registrations.length === 0 && cacheKeys.length === 0) {
          return { registrations: 0, cacheKeys: 0 };
        }
        await new Promise((r) => setTimeout(r, 100));
      }

      return {
        registrations: (await navigator.serviceWorker.getRegistrations()).length,
        cacheKeys: (await caches.keys()).length,
      };
    });

    expect(result).toEqual({ registrations: 0, cacheKeys: 0 });
  });
});
