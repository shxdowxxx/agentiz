importScripts('/engine/core.bundle.js');
importScripts('/engine/core.config.js');
importScripts('/engine/core.sw.js');

const sw = new UVServiceWorker();

// Ensure BareClient uses the configured bare server URL, not the default /bare/
if (self.Ultraviolet && self.Ultraviolet.BareClient && self.__uv$config && self.__uv$config.bare) {
    sw.bareClient = new self.Ultraviolet.BareClient(self.__uv$config.bare);
}

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
    if (sw.route(event)) {
        event.respondWith(
            sw.fetch(event).catch(err =>
                new Response(
                    `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0a0a0a;color:#ccc;padding:40px;text-align:center"><h2 style="color:#f66">Connection Error</h2><p>${err.message}</p><button onclick="history.back()" style="padding:10px 24px;background:#1a1a1a;border:1px solid #333;color:#ccc;border-radius:8px;cursor:pointer">Go back</button></body></html>`,
                    { status: 500, headers: { 'Content-Type': 'text/html' } }
                )
            )
        );
    }
});
