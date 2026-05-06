let registered = false;

export async function initProxy() {
  if (registered || !('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    registered = true;
  } catch (e) {
    console.warn('[agentiz] SW registration failed:', e);
  }
}
