import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import QuickTiles from '../components/QuickTiles';
import RecentHistory from '../components/RecentHistory';
import Bookmarks from '../components/Bookmarks';
import { onProxyChange } from '../lib/proxy';
import { getSettings } from '../lib/storage';
import { Icon } from '../lib/icons';

const STATUS_LABEL = {
  init:        'INIT',
  registering: 'REGISTERING',
  reloading:   'RELOADING',
  ready:       'READY',
  unsupported: 'UNSUPPORTED',
  insecure:    'INSECURE',
  blocked:     'BLOCKED',
  error:       'ERROR',
};

const STATUS_HELP = {
  unsupported: 'This browser/context does not expose the Service Worker API.',
  insecure:    'The page is loaded over http:// — service workers require https.',
  blocked:     'A network filter or extension is blocking the proxy worker.',
  error:       'The proxy worker failed to register. See details below.',
};

export default function Home() {
  const proxyEnabled = getSettings().proxyEnabled !== false;
  const [proxy, setProxy] = useState({ status: 'init', ready: false, err: null, diag: null });

  useEffect(() => onProxyChange(setProxy), []);

  const navigate = (dest) => window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));

  const isReady   = proxy.ready && proxy.status === 'ready';
  const isWorking = proxy.status === 'init' || proxy.status === 'registering' || proxy.status === 'reloading';
  const showError = !isReady && !isWorking;

  const tone =
    isReady   ? 'var(--silver)'    :
    isWorking ? 'var(--silver-2)'  :
                'var(--text-mute)';

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

        <div
          className="anim-fade-up"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
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
              animation: isWorking ? 'spin 1.2s linear infinite' : 'none',
            }}
          />
          PROXY · {STATUS_LABEL[proxy.status] || proxy.status.toUpperCase()}
        </div>

        <SearchBar
          proxyReady={isReady && proxyEnabled}
          forceDirectFallback={showError}
          onNavigate={navigate}
        />
      </div>

      {showError && proxy.diag && (
        <div
          className="glass anim-fade-up"
          style={{
            maxWidth: '660px', margin: '0 auto 32px',
            padding: '16px 20px', borderRadius: '12px',
            color: 'var(--text-dim)', fontSize: '12.5px', lineHeight: 1.55,
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ color: 'var(--silver-2)', flexShrink: 0, marginTop: '2px' }}>
              <Icon name="alert" size={14} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                Proxy unavailable.
              </div>
              <div>{STATUS_HELP[proxy.status] || 'Unknown service-worker error.'}</div>
            </div>
          </div>

          {/* Diagnostic — copy-paste friendly */}
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            color: 'var(--text-mute)',
            letterSpacing: '0.02em',
            marginBottom: '10px',
            wordBreak: 'break-all',
          }}>
            <div>status      = {proxy.status}</div>
            <div>secure ctx  = {String(proxy.diag.secure)}</div>
            <div>origin      = {proxy.diag.origin}</div>
            <div>protocol    = {proxy.diag.protocol}</div>
            <div>sw api      = {String(proxy.diag.swApi)}</div>
            <div>in iframe   = {String(proxy.diag.inIframe)}</div>
            {proxy.err?.message && <div>error       = {proxy.err.message}</div>}
          </div>

          {proxy.status === 'insecure' && proxy.diag.protocol === 'http:' && (
            <a
              href={`https://${proxy.diag.host}${location.pathname}${location.search}${location.hash}`}
              style={{
                display: 'inline-block', padding: '8px 14px', borderRadius: '8px',
                background: 'var(--text)', color: 'var(--bg)',
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Switch to https
            </a>
          )}
          {proxy.status !== 'insecure' && (
            <div style={{ fontSize: '11.5px', color: 'var(--text-mute)' }}>
              Try a hard refresh (<span className="kbd-chip">Ctrl+Shift+R</span>), or open in a fresh tab. The search bar below still works in <strong>direct mode</strong> — links open in a new tab without the proxy.
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <QuickTiles proxyReady={isReady && proxyEnabled} forceDirectFallback={showError} onNavigate={navigate} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Bookmarks onNavigate={navigate} />
      </div>

      <RecentHistory onNavigate={navigate} />
    </div>
  );
}
