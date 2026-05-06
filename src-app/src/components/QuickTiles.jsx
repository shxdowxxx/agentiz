import { proxyUrl } from '../lib/codec';
import { Icon } from '../lib/icons';

const TILES = [
  { id: 'classroom', label: 'Classroom',   url: 'https://classroom.google.com',  icon: 'graduation' },
  { id: 'canvas',    label: 'Canvas',      url: 'https://canvas.instructure.com', icon: 'clipboard' },
  { id: 'docs',      label: 'Docs',        url: 'https://docs.google.com',        icon: 'document' },
  { id: 'youtube',   label: 'YouTube',     url: 'https://youtube.com',            icon: 'play' },
  { id: 'wikipedia', label: 'Wikipedia',   url: 'https://en.wikipedia.org',       icon: 'book' },
  { id: 'google',    label: 'Google',      url: 'https://google.com',             icon: 'globe' },
  { id: 'reddit',    label: 'Reddit',      url: 'https://reddit.com',             icon: 'message' },
  { id: 'chatgpt',   label: 'ChatGPT',     url: 'https://chat.openai.com',        icon: 'sparkle' },
];

export default function QuickTiles({ proxyReady = true, onNavigate }) {
  const launch = (tile) => {
    if (!proxyReady) return;
    const dest = proxyUrl(tile.url);
    if (dest) onNavigate?.(dest);
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '14px' }}>
        Quick Launch
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {TILES.map((tile, i) => (
          <button
            key={tile.id}
            onClick={() => launch(tile)}
            className="tile-btn glass anim-fade-up"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px', padding: '22px 8px',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'center',
              animationDelay: `${i * 50}ms`,
              color: 'var(--text-dim)',
            }}
          >
            <div
              style={{
                width: '46px', height: '46px',
                borderRadius: '12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--silver)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              <Icon name={tile.icon} size={20} stroke={1.6} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 500 }}>
              {tile.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
