import { useState, useRef, useEffect } from 'react';
import { Icon } from '../lib/icons';

export default function ProxyFrame({ url, onClose }) {
  const iframeRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) { setCurrentUrl(url); setLoading(true); }
  }, [url]);

  if (!url) return null;

  return (
    <div
      className="anim-fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 5000,
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <div
        className="glass-strong"
        style={{
          height: '46px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 14px',
          borderBottom: '1px solid var(--border-2)',
        }}
      >
        <button onClick={onClose} className="icon-btn" title="Close" style={{ width: '32px', height: '32px' }}>
          <Icon name="close" size={14} />
        </button>

        <div style={{
          flex: 1, height: '30px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', padding: '0 12px',
          gap: '8px', overflow: 'hidden',
        }}>
          {loading && (
            <div style={{
              width: '11px', height: '11px', borderRadius: '50%',
              border: '2px solid var(--border-2)',
              borderTopColor: 'var(--silver)',
              animation: 'spin 0.7s linear infinite',
              flexShrink: 0,
            }} />
          )}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px', color: 'var(--text-mute)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
          }}>
            {currentUrl}
          </span>
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 500,
          color: 'var(--text-mute)', flexShrink: 0, letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          agentiz
        </span>
      </div>

      <iframe
        ref={iframeRef}
        src={url}
        onLoad={() => setLoading(false)}
        className="proxy-frame"
        style={{ flex: 1, border: 'none', width: '100%' }}
        allow="fullscreen; clipboard-read; clipboard-write"
        title="Agentiz Proxy"
      />
    </div>
  );
}
