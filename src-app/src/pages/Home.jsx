import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import QuickTiles from '../components/QuickTiles';
import RecentHistory from '../components/RecentHistory';
import Bookmarks from '../components/Bookmarks';
import { onProxyChange, getProxyError } from '../lib/proxy';
import { getSettings } from '../lib/storage';
import { Icon } from '../lib/icons';

const STATUS_LABEL = {
  init:         'INIT',
  registering:  'REGISTERING',
  reloading:    'RELOADING',
  ready:        'READY',
  unsupported:  'UNSUPPORTED',
  error:        'ERROR',
};

const STATUS_TONE = {
  ready:       'var(--silver)',
  registering: 'var(--silver-2)',
  reloading:   'var(--silver-2)',
  init:        'var(--silver-2)',
  unsupported: 'var(--text-mute)',
  error:       'var(--text-mute)',
};

export default function Home() {
  const proxyEnabled = getSettings().proxyEnabled !== false;
  const [proxy, setProxy] = useState({ status: 'init', ready: false, err: null });

  useEffect(() => {
    return onProxyChange(setProxy);
  }, []);

  const navigate = (dest) => window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));

  const isReady = proxy.ready && proxy.status === 'ready';
  const tone    = STATUS_TONE[proxy.status] || 'var(--silver-2)';

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 20px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          className="chrome-text anim-fade-up"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 500,
            letterSpacing: '0.10em',
            marginBottom: '12px',
          }}
        >
          agentiz
        </h1>

        {/* SW status badge — visible state for the proxy */}
        <div
          className="anim-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1px solid var(--border-2)',
            background: 'var(--surface)',
            backdropFilter: 'blur(12px)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            color: 'var(--text-dim)',
            letterSpacing: '0.14em',
            marginBottom: '34px',
            animationDelay: '60ms',
          }}
          title={proxy.err?.message || ''}
        >
          <span
            style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: tone,
              boxShadow: isReady ? `0 0 8px ${tone}` : 'none',
              animation: (proxy.status === 'registering' || proxy.status === 'init' || proxy.status === 'reloading') ? 'spin 1.2s linear infinite' : 'none',
            }}
          />
          PROXY · {STATUS_LABEL[proxy.status] || proxy.status.toUpperCase()}
        </div>

        <SearchBar proxyReady={isReady && proxyEnabled} onNavigate={navigate} />
      </div>

      {/* Error helper */}
      {proxy.status === 'error' && (
        <div
          className="glass anim-fade-up"
          style={{
            maxWidth: '660px', margin: '0 auto 32px',
            padding: '14px 18px', borderRadius: '12px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            color: 'var(--text-dim)', fontSize: '12.5px', lineHeight: 1.5,
          }}
        >
          <span style={{ color: 'var(--silver-2)', flexShrink: 0, marginTop: '2px' }}>
            <Icon name="alert" size={14} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Proxy did not start.
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', marginBottom: '8px' }}>
              {proxy.err?.message || 'Unknown service-worker error.'}
            </div>
            <div>
              Try a hard refresh (<span className="kbd-chip">Ctrl+Shift+R</span>) or open this site in a private window. If your browser blocks service workers (rare), the proxy cannot run.
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <QuickTiles proxyReady={isReady && proxyEnabled} onNavigate={navigate} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Bookmarks onNavigate={navigate} />
      </div>

      <RecentHistory onNavigate={navigate} />
    </div>
  );
}
