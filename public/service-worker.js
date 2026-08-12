/*
 * Kill switch for the Create React App service worker.
 *
 * The previous version of this site called registerServiceWorker() in
 * production, which registered a worker at this exact path that precached the
 * old app shell. CRA's "script 404s, so unregister" recovery only ran on
 * localhost, so that worker is still installed in every browser that visited
 * the old site — serving a cached shell whose asset URLs no longer exist.
 *
 * Serving this file replaces that worker. It drops every cache, unregisters
 * itself, and reloads any tab it controls, healing the visitor in one visit.
 *
 * Safe to delete once returning visitors have had time to pick it up; browsers
 * re-check a registered worker's script at least every 24 hours.
 */

self.addEventListener('install', () => {
  // Take over from the old worker immediately rather than waiting for every
  // tab to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // waitUntil keeps the worker alive for the teardown; without it the browser
  // may terminate before the caches are cleared.
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      await Promise.all(
        // navigate() rejects for clients this worker doesn't control, which is
        // the normal case for a first-time visitor. Nothing to do there.
        clients.map((client) => client.navigate(client.url).catch(() => {})),
      );
    })(),
  );
});
