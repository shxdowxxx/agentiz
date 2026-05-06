import { useState } from 'react';
import { getBookmarks, removeBookmark } from '../lib/storage';
import { proxyUrl } from '../lib/codec';

export default function Bookmarks({ onNavigate }) {
  const [items, setItems] = useState(() => getBookmarks());

  if (items.length === 0) return null;

  const launch = (url) => { const dest = proxyUrl(url); if (dest) onNavigate?.(dest); };
  const remove = (e, url) => {
    e.stopPropagation();
    removeBookmark(url);
    setItems(getBookmarks());
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '12px' }}>
        Bookmarks
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{ position: 'relative' }}
            onMouseEnter={e => e.currentTarget.querySelector('.bk-remove').style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.querySelector('.bk-remove').style.opacity = '0'}
          >
            <button
              onClick={() => launch(item.url)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 36px 12px 12px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.12s',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span style={{ fontSize: '14px' }}>🔖</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </span>
            </button>
            <button
              className="bk-remove"
              onClick={(e) => remove(e, item.url)}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-mute)',
                cursor: 'pointer', fontSize: '12px', padding: '4px',
                opacity: 0, transition: 'opacity 0.12s',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
