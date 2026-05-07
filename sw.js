/* Agentiz service worker — UV v3.2.10 + bare-mux + bare-mod transport */

// UV v3's BareClient uses BroadcastChannel("bare-mux") internally, so
// bare-mux MUST load before UV. The transport (bare-mod) speaks bare
// protocol v3 directly to the Railway server — no Wisp/epoxy needed.
importScripts('/transport/bare-mux.js');
importScripts('/engine/core.bundle.js');
importScripts('/engine/core.config.js');
importScripts('/engine/core.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'claim') {
        self.clients.claim();
    }
});

self.addEventListener('fetch', (event) => {
    if (!sw.route(event)) return;

    event.respondWith(
        sw.fetch(event).catch((err) => {
            const raw = (err && err.message) ? err.message : String(err);
            // Friendlier message for the common bare-server rate-limit case.
            const overloaded = /keep-alive|429|Too Many|rate limit/i.test(raw);
            const msg = overloaded
              ? 'The proxy server is overloaded right now (too many concurrent connections). Wait a few seconds and reload the iframe.'
              : raw;
            return new Response(
                `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Connection Error</title>
<style>
  body{font-family:'DM Sans',system-ui,sans-serif;background:#0b0b0d;color:#e8e8ec;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:40px;text-align:center}
  .card{max-width:520px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(20px);border-radius:16px;padding:36px}
  h2{margin:0 0 12px;font-weight:600;letter-spacing:-0.01em}
  p{color:#a8a8b0;font-size:14px;line-height:1.5;margin:0 0 18px}
  code{font-family:'DM Mono',monospace;font-size:11px;color:#888;display:block;background:rgba(0,0,0,0.3);padding:10px 12px;border-radius:8px;margin-bottom:18px;word-break:break-all}
  button{padding:10px 22px;background:#f0f0f1;color:#0b0b0d;border:1px solid rgba(255,255,255,0.22);border-radius:9px;cursor:pointer;font-weight:600;font-family:inherit}
  button:hover{opacity:0.88}
</style></head><body>
<div class="card">
<h2>Connection Error</h2>
<p>The proxy could not reach the destination. The bare server may be temporarily unavailable.</p>
<code>${msg}</code>
<button onclick="history.back()">Go back</button>
</div></body></html>`,
                { status: 502, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
            );
        }),
    );
});
