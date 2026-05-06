let registered = false;

export async function initProxy() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    // Wait until the SW is actually controlling this page
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
        // Hard timeout — if something goes wrong, unblock after 5s
        setTimeout(resolve, 5000);
      });
    }

    registered = true;
  } catch (e) {
    console.warn('[agentiz] SW registration failed:', e);
    registered = true; // unblock UI even on failure
  }
}

export function isProxyReady() {
  return registered && !!navigator.serviceWorker?.controller;
}
