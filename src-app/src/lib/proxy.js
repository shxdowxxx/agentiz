let registered = false;

export async function initProxy() {
  if (registered || !('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    // If a SW is already controlling the page, we're good
    if (navigator.serviceWorker.controller) {
      registered = true;
      return;
    }

    // Wait for the SW to activate and claim this page
    await new Promise((resolve) => {
      const onControllerChange = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        resolve();
      };

      if (reg.active) {
        // SW is active but not yet controlling — reload to let it claim
        reg.active.postMessage({ type: 'CLAIM' });
      }

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      // Timeout after 3s — SW might already be ready
      setTimeout(resolve, 3000);
    });

    registered = true;
  } catch (e) {
    console.warn('[agentiz] SW registration failed:', e);
  }
}

export function isProxyReady() {
  return !!navigator.serviceWorker?.controller;
}
