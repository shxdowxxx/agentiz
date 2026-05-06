import { useState, useRef, useEffect } from 'react';

export default function ProxyFrame({ url, onClose }) {
  const iframeRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) { setCurrentUrl(url); setLoading(true); }
  }, [url]);

  if (!url) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 5000,
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0a',
    }}>
      {/* Toolbar */}
      <div style={{
        height: '44px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 12px',
        background: 'var(--surface, #141414)',
        borderBottom: '1px solid var(--border, rgba(255,255,255,0.07))',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          title="Close proxy"
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,100,100,0.12)',
            color: '#f88', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.12s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,100,100,0.25)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,100,100,0.12)'}
        >
          ✕
        </button>

        {/* URL bar (display only) */}
        <div style={{
          flex: 1, height: '30px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', padding: '0 10px',
          gap: '6px', overflow: 'hidden',
        }}>
          {loading && (
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: '#8888ff',
              animation: 'spin 0.7s linear infinite',
              flexShrink: 0,
            }} />
          )}
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px', color: 'rgba(255,255,255,0.35)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {currentUrl}
          </span>
        </div>

        {/* Agentiz badge */}
        <span style={{
          fontFamily: 'monospace', fontSize: '11px', fontWeight: 500,
          color: 'rgba(136,136,255,0.6)', flexShrink: 0, letterSpacing: '0.06em',
        }}>
          agentiz
        </span>
      </div>

      {/* Spinner CSS */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Proxy iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        onLoad={() => setLoading(false)}
        style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
        allow="fullscreen"
        title="Agentiz Proxy"
      />
    </div>
  );
}
