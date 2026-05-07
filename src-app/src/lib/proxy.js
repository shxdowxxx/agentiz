// Proxy / Service Worker bootstrap.
//
// Status pipeline:
//   init → registering → (reloading once) → ready
//                     ↓
//                   error / unsupported / insecure / blocked
//
// On first activation we reload once so the page is SW-controlled from
// its initial load — otherwise iframe navigations race the SW and bypass
// it (they hit S3 directly and return AccessDenied).

const RELOAD_FLAG = 'agentiz_sw_bootstrapped';

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
    ua:         navigator.userAgent.slice(0, 100),
  };
}

export async function initProxy() {
  if (status !== 'init') return;

  diag = gatherDiag();

  // ---- Insecure context (http://) — SWs are unavailable.
  if (!diag.secure) {
    setStatus('insecure', new Error('Page loaded over insecure context (http). Service workers require https.'));
    return;
  }

  // ---- Browser doesn't expose the SW API at all (very rare).
  if (!diag.swApi) {
    setStatus('unsupported', new Error('navigator.serviceWorker is not available in this browser/context.'));
    return;
  }

  // ---- Already controlled (return visit) — instant ready.
  if (navigator.serviceWorker.controller) {
    setStatus('ready');
    return;
  }

  setStatus('registering');

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    if (!navigator.serviceWorker.controller) {
      const claimed = await new Promise((resolve) => {
        const onChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', onChange);
          resolve(true);
        };
        navigator.serviceWorker.addEventListener('controllerchange', onChange);

        // Backup kick — message the active SW asking it to claim this client.
        if (reg.active && reg.active.state === 'activated') {
          try { reg.active.postMessage({ type: 'claim' }); } catch {}
        }

        setTimeout(() => resolve(false), 6000);
      });

      if (!claimed && !navigator.serviceWorker.controller) {
        setStatus('blocked', new Error('Service worker activated but could not take control of this page (commonly caused by a network filter blocking the worker).'));
        return;
      }
    }

    // First activation in this tab — reload once so the page is
    // SW-controlled from initial load and iframes are intercepted.
    if (!sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1');
      setStatus('reloading');
      setTimeout(() => window.location.reload(), 80);
      return;
    }

    setStatus('ready');
  } catch (err) {
    console.warn('[agentiz] SW register failed:', err);
    setStatus('error', err);
  }
}

export function isProxyReady()    { return ready; }
export function getProxyStatus()  { return status; }
export function getProxyError()   { return lastErr; }
export function getProxyDiag()    { return diag; }
