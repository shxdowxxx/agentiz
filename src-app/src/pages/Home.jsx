import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import QuickTiles from '../components/QuickTiles';
import RecentHistory from '../components/RecentHistory';
import Bookmarks from '../components/Bookmarks';
import { isProxyReady } from '../lib/proxy';
import { getSettings } from '../lib/storage';

export default function Home() {
  const [proxyReady, setProxyReady] = useState(() => isProxyReady());
  const proxyEnabled = getSettings().proxyEnabled !== false;

  useEffect(() => {
    if (proxyReady) return;
    const iv = setInterval(() => {
      if (isProxyReady()) { setProxyReady(true); clearInterval(iv); }
    }, 200);
    const onCtrl = () => { setProxyReady(true); clearInterval(iv); };
    navigator.serviceWorker?.addEventListener('controllerchange', onCtrl);
    return () => { clearInterval(iv); navigator.serviceWorker?.removeEventListener('controllerchange', onCtrl); };
  }, [proxyReady]);

  // All page navigation is bubbled to App via the agentiz:open-frame event,
  // which mounts the global ProxyFrame overlay. This avoids top-level
  // navigation off the S3 origin (which would 403 before SW intercepts).
  const navigate = (dest) => window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 20px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>
        <h1
          className="chrome-text anim-fade-up"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 500,
            letterSpacing: '0.10em',
            marginBottom: '10px',
          }}
        >
          agentiz
        </h1>
        <p className="anim-fade-up" style={{
          color: 'var(--text-mute)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '34px',
          animationDelay: '90ms',
        }}>
          {proxyEnabled ? 'secure · monochrome · workspace' : 'proxy disabled — enable in settings'}
        </p>
        <SearchBar proxyReady={proxyReady && proxyEnabled} onNavigate={navigate} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <QuickTiles proxyReady={proxyReady && proxyEnabled} onNavigate={navigate} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Bookmarks onNavigate={navigate} />
      </div>

      <RecentHistory onNavigate={navigate} />
    </div>
  );
}
