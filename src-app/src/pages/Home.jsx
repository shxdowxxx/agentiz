import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import QuickTiles from '../components/QuickTiles';
import RecentHistory from '../components/RecentHistory';
import Bookmarks from '../components/Bookmarks';
import ProxyFrame from '../components/ProxyFrame';
import { isProxyReady } from '../lib/proxy';

export default function Home() {
  const [proxyReady, setProxyReady] = useState(() => isProxyReady());
  const [frameUrl, setFrameUrl] = useState(null);

  useEffect(() => {
    if (proxyReady) return;
    const iv = setInterval(() => {
      if (isProxyReady()) { setProxyReady(true); clearInterval(iv); }
    }, 200);
    const onCtrl = () => { setProxyReady(true); clearInterval(iv); };
    navigator.serviceWorker?.addEventListener('controllerchange', onCtrl);
    return () => { clearInterval(iv); navigator.serviceWorker?.removeEventListener('controllerchange', onCtrl); };
  }, [proxyReady]);

  const navigate = (dest) => setFrameUrl(dest);

  // Listen for command palette opens from App-level
  useEffect(() => {
    const handler = (e) => { if (e.detail?.url) setFrameUrl(e.detail.url); };
    window.addEventListener('agentiz:open-frame', handler);
    return () => window.removeEventListener('agentiz:open-frame', handler);
  }, []);

  return (
    <>
      {/* Full-screen proxy iframe — stays inside the SW-controlled page */}
      <ProxyFrame url={frameUrl} onClose={() => setFrameUrl(null)} />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            className="chrome-text"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '24px' }}
          >
            agentiz
          </h1>
          <SearchBar proxyReady={proxyReady} onNavigate={navigate} />
        </div>

        <div style={{ marginBottom: '40px' }}>
          <QuickTiles proxyReady={proxyReady} onNavigate={navigate} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <Bookmarks onNavigate={navigate} />
        </div>

        <RecentHistory onNavigate={navigate} />
      </div>
    </>
  );
}
