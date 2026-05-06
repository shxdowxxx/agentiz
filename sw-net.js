importScripts('/net-bundle.js');

const { AppWorker } = $appLoadWorker();
const netrunner = new AppWorker();
let synced = false;

self.addEventListener('install', (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('message', (e) => { if (e.data?.type === 'PING') e.source?.postMessage?.({ type: 'PONG' }); });

async function wfc(t) {
  if (appWorker.config && appWorker.config.prefix) return true;
  try { const c = await self.clients.matchAll({ includeUncontrolled: true }); for (const x of c) try { x.postMessage({ type: 'APP_REQUEST_CONFIG' }); } catch (_) {} } catch (_) {}
  const s = Date.now();
  while (Date.now() - s < t) {
    if (appWorker.config && appWorker.config.prefix) return true;
    try { appWorker.config = null; await appWorker.loadConfig(); } catch (_) {}
    if (appWorker.config && appWorker.config.prefix) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return !!(appWorker.config && appWorker.config.prefix);
}

async function pt(req) {
  try { return await fetch(req); }
  catch (_) { return Response.error(); }
}

async function hr(event) {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/netrunner/') && !url.pathname.startsWith('/scram/')) return pt(event.request);

  if (!synced) {
    try {
      if (!appWorker.config || !appWorker.config.prefix) { if (!await wfc(4000)) return pt(event.request); }
      appWorker.config = null;
      await appWorker.loadConfig();
      if (!appWorker.config || !appWorker.config.prefix) return pt(event.request);
      synced = true;
    } catch (e) { return pt(event.request); }
  }

  try {
    if (appWorker.route(event)) return await appWorker.fetch(event);
  } catch (e) {
    const m = e?.message || String(e);
    if (/prefix/.test(m)) {
      synced = false;
      try { appWorker.config = null; await appWorker.loadConfig(); if (appWorker.config && appWorker.config.prefix && appWorker.route(event)) { synced = true; return await appWorker.fetch(event); } } catch (_) {}
    }
    try { const c = await self.clients.matchAll(); for (const x of c) x.postMessage({ type: 'PROXY_ERROR', error: m, url: url.pathname }); } catch (_) {}
    return pt(event.request);
  }
  return pt(event.request);
}

self.addEventListener('fetch', (e) => e.respondWith(hr(e).catch(() => Response.error())));
