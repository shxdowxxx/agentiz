import { useState } from 'react';
import { getHistory, clearHistory } from '../lib/storage';
import { proxyUrl } from '../lib/codec';

export default function RecentHistory() {
  const [items, setItems] = useState(() => getHistory().slice(0, 8));

  if (items.length === 0) return null;

  const clear = () => { clearHistory(); setItems([]); };
  const launch = (url) => { const dest = proxyUrl(url); if (dest) window.location.href = dest; };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-mute)', margin: 0 }}>
          Recent
        </p>
        <button
          onClick={clear}
          style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '12px', cursor: 'pointer', padding: '2px 4px' }}
        >
          Clear
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => launch(item.url)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px', border: 'none',
              background: 'transparent',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.1s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--surface)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-mute)', flexShrink: 0 }}>🕐</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title || item.url}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', flexShrink: 0 }}>
              {new URL(item.url.startsWith('http') ? item.url : `https://${item.url}`).hostname}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
