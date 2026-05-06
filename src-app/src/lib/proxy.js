let ready = false;

export async function initProxy() {
  if (ready) return;

  // If SW is already controlling (return visit), unblock immediately
  if (navigator.serviceWorker?.controller) {
    ready = true;
    return;
  }

  if (!('serviceWorker' in navigator)) {
    ready = true; // no SW support — let UI through, proxy won't work but don't block forever
    return;
  }

  // Hard timeout — unblock UI after 4s no matter what
  const timeout = setTimeout(() => { ready = true; }, 4000);

  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    // Wait for SW to take control (fires on first install after clients.claim())
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
      });
    }
  } catch (e) {
    console.warn('[agentiz] SW:', e);
  }

  clearTimeout(timeout);
  ready = true;
}

export function isProxyReady() {
  return ready;
}
