importScripts('/engine/core.bundle.js');
importScripts('/engine/core.config.js');
importScripts('/engine/core.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
    if (sw.route(event)) {
        event.respondWith(
            sw.fetch(event).catch(err =>
                new Response(
                    `<!DOCTYPE html><html><head><title>Connection Error</title></head><body style="font-family:sans-serif;background:#0a0a0a;color:#c0c0c0;padding:60px;text-align:center"><h2 style="color:#f66;margin-bottom:12px">Connection Error</h2><p style="color:#888;margin-bottom:20px">${err.message}</p><button onclick="history.back()" style="padding:10px 24px;background:#1a1a1a;border:1px solid #333;color:#ccc;border-radius:8px;cursor:pointer;font-size:14px">Go back</button></body></html>`,
                    { status: 500, headers: { 'Content-Type': 'text/html' } }
                )
            )
        );
    }
});
