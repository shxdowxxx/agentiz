let ready = false;
let registered = false;

export async function initProxy() {
  if (ready) return;

  if (!('serviceWorker' in navigator)) {
    ready = true;
    return;
  }

  // Already controlled (return visit) — unblock immediately.
  if (navigator.serviceWorker.controller) {
    ready = true;
    registered = true;
    return;
  }

  // Hard 4s timeout — never block UI longer than this.
  const timeout = setTimeout(() => { ready = true; }, 4000);

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    registered = true;

    // Wait for an active controller (clients.claim() in the SW activate handler).
    if (!navigator.serviceWorker.controller) {
      const active = await new Promise((resolve) => {
        const sw = reg.installing || reg.waiting || reg.active;
        if (sw && sw.state === 'activated' && navigator.serviceWorker.controller) {
          return resolve(true);
        }
        const onChange = () => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.removeEventListener('controllerchange', onChange);
            resolve(true);
          }
        };
        navigator.serviceWorker.addEventListener('controllerchange', onChange);
        // Failsafe — resolve in 3.5s anyway so the timeout above can mark ready.
        setTimeout(() => resolve(false), 3500);
      });
      void active;
    }
  } catch (err) {
    console.warn('[agentiz] proxy SW register failed:', err);
  }

  clearTimeout(timeout);
  ready = true;
}

export function isProxyReady() { return ready; }
export function isProxyRegistered() { return registered; }
