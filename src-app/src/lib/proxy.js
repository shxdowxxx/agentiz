// Proxy / Service Worker bootstrap.
//
// IMPORTANT: On a fresh visit the page is NOT yet controlled by the SW.
// Even after `clients.claim()` fires, navigation requests issued by
// freshly-created iframes can race the activation and reach S3 directly,
// returning 403 AccessDenied. The reliable cross-browser fix is to
// **reload the page once** as soon as the SW takes control. After the
// reload the page is SW-controlled from the start and every iframe
// navigation is intercepted.

const RELOAD_FLAG = 'agentiz_sw_bootstrapped';

let ready    = false;
let status   = 'init';      // 'init' | 'registering' | 'reloading' | 'ready' | 'unsupported' | 'error'
let lastErr  = null;
const subs   = new Set();

function setStatus(next, err = null) {
  status  = next;
  lastErr = err;
  ready   = (next === 'ready' || next === 'unsupported' || next === 'error');
  subs.forEach(fn => { try { fn({ status, ready, err }); } catch {} });
}

export function onProxyChange(fn) {
  subs.add(fn);
  fn({ status, ready, err: lastErr });
  return () => subs.delete(fn);
}

export async function initProxy() {
  if (status !== 'init') return;

  if (!('serviceWorker' in navigator)) {
    setStatus('unsupported');
    return;
  }

  // Already controlled (return visit) — immediate ready.
  if (navigator.serviceWorker.controller) {
    setStatus('ready');
    return;
  }

  setStatus('registering');

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    // Wait for the SW to actually take control. clients.claim() in the SW
    // activate handler triggers a `controllerchange` event on this page.
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => {
        const onChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', onChange);
          resolve(true);
        };
        navigator.serviceWorker.addEventListener('controllerchange', onChange);

        // If the SW is already activated but controllerchange somehow
        // didn't fire, push it along.
        if (reg.active && reg.active.state === 'activated' && !navigator.serviceWorker.controller) {
          // Forcing claim from the page side (some browsers need a kick).
          reg.active.postMessage({ type: 'claim' });
        }

        // Hard 6s timeout — if SW never claims, we surface error.
        setTimeout(() => resolve(false), 6000);
      });
    }

    if (!navigator.serviceWorker.controller) {
      setStatus('error', new Error('Service worker activated but never claimed this page.'));
      return;
    }

    // First successful activation in this tab — reload once so the page
    // is SW-controlled from initial load. Subsequent visits skip this.
    if (!sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1');
      setStatus('reloading');
      // Tiny delay so React can render the "reloading" badge before reload.
      setTimeout(() => window.location.reload(), 80);
      return;
    }

    setStatus('ready');
  } catch (err) {
    console.warn('[agentiz] proxy SW register failed:', err);
    setStatus('error', err);
  }
}

export function isProxyReady() { return ready && status === 'ready'; }
export function getProxyStatus() { return status; }
export function getProxyError() { return lastErr; }
