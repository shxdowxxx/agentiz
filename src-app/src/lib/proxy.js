// Proxy / Service Worker bootstrap.
//
// The hard-refresh edge case (Ctrl+Shift+R) deliberately leaves the
// reloaded page UNCONTROLLED by the service worker even after the SW
// activates and calls clients.claim(). To recover, if the controller
// is still null after registration completes we trigger a normal
// reload — that load IS controlled and proxy fetches start working.
//
// Status pipeline:
//   init → registering → (reloading) → ready
//                     ↓
//                   error / unsupported / insecure / blocked

const RELOAD_KEY = 'agentiz_sw_reload_count';
const MAX_RELOADS = 2;

let ready    = false;
let status   = 'init';
let lastErr  = null;
let diag     = null;
const subs   = new Set();

function setStatus(next, err = null, extra = null) {
  status  = next;
  lastErr = err;
  if (extra) diag = { ...(diag || {}), ...extra };
  ready   = (next === 'ready');
  subs.forEach(fn => { try { fn({ status, ready, err, diag }); } catch {} });
}

export function onProxyChange(fn) {
  subs.add(fn);
  fn({ status, ready, err: lastErr, diag });
  return () => subs.delete(fn);
}

function gatherDiag() {
  return {
    secure:     typeof window.isSecureContext === 'boolean' ? window.isSecureContext : false,
    origin:     location.origin,
    protocol:   location.protocol,
    host:       location.host,
    swApi:      ('serviceWorker' in navigator),
    inIframe:   window !== window.top,
    controller: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
    ua:         navigator.userAgent.slice(0, 100),
  };
}

function waitForController(reg, timeoutMs) {
  return new Promise((resolve) => {
    if (navigator.serviceWorker.controller) return resolve(true);

    const onChange = () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener('controllerchange', onChange);
        resolve(true);
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', onChange);

    // Backup: ask the active worker to claim again.
    const sw = reg.active || reg.waiting || reg.installing;
    if (sw) {
      try { sw.postMessage({ type: 'claim' }); } catch {}
    }

    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('controllerchange', onChange);
      resolve(!!navigator.serviceWorker.controller);
    }, timeoutMs);
  });
}

export async function initProxy() {
  if (status !== 'init') return;

  diag = gatherDiag();

  if (!diag.secure) {
    setStatus('insecure', new Error('Page loaded over insecure context (http). Service workers require https.'));
    return;
  }
  if (!diag.swApi) {
    setStatus('unsupported', new Error('navigator.serviceWorker is not available in this browser/context.'));
    return;
  }

  // Fast path — return visit, page already controlled.
  if (navigator.serviceWorker.controller) {
    sessionStorage.removeItem(RELOAD_KEY);
    setStatus('ready');
    return;
  }

  setStatus('registering');

  let reg;
  try {
    reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  } catch (err) {
    console.warn('[agentiz] SW register failed:', err);
    setStatus('error', err);
    return;
  }

  // Give the SW up to 6s to take control via clients.claim().
  await waitForController(reg, 6000);

  // STILL not controlling — happens after Ctrl+Shift+R, in some incognito
  // contexts, or when an old SW exists at a different scope. The cure is
  // a normal reload: that navigation will be controlled by the SW.
  if (!navigator.serviceWorker.controller) {
    const count = parseInt(sessionStorage.getItem(RELOAD_KEY) || '0', 10);
    if (count < MAX_RELOADS) {
      sessionStorage.setItem(RELOAD_KEY, String(count + 1));
      diag = gatherDiag();
      setStatus('reloading');
      // Tiny delay so the UI flashes the "RELOADING" pill before navigation.
      setTimeout(() => window.location.reload(), 80);
      return;
    }
    diag = gatherDiag();
    setStatus(
      'blocked',
      new Error('SW activated but never claimed this page after multiple reloads. Close the tab and reopen, or try a different browser.'),
    );
    return;
  }

  // Controller acquired — clear the counter for the next visit.
  sessionStorage.removeItem(RELOAD_KEY);
  diag = gatherDiag();
  setStatus('ready');
}

export function isProxyReady()    { return ready; }
export function getProxyStatus()  { return status; }
export function getProxyError()   { return lastErr; }
export function getProxyDiag()    { return diag; }
