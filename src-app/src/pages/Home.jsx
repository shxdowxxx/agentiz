import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import QuickTiles from '../components/QuickTiles';
import RecentHistory from '../components/RecentHistory';
import Bookmarks from '../components/Bookmarks';
import { isProxyReady } from '../lib/proxy';

export default function Home() {
  const [proxyReady, setProxyReady] = useState(() => isProxyReady());

  useEffect(() => {
    if (proxyReady) return;
    // Poll until SW controller is confirmed
    const interval = setInterval(() => {
      if (isProxyReady()) {
        setProxyReady(true);
        clearInterval(interval);
      }
    }, 200);
    // Also listen for controllerchange
    const onCtrl = () => { setProxyReady(true); clearInterval(interval); };
    navigator.serviceWorker?.addEventListener('controllerchange', onCtrl);
    return () => { clearInterval(interval); navigator.serviceWorker?.removeEventListener('controllerchange', onCtrl); };
  }, [proxyReady]);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1
          className="chrome-text"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '24px' }}
        >
          agentiz
        </h1>
        <SearchBar proxyReady={proxyReady} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <QuickTiles proxyReady={proxyReady} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Bookmarks />
      </div>

      <RecentHistory />
    </div>
  );
}
