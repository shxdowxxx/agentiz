import { proxyUrl } from '../lib/codec';

const TILES = [
  { id: 'classroom', label: 'Classroom',   url: 'https://classroom.google.com',  icon: '🎓', bg: 'rgba(15,157,88,0.12)',   glow: 'rgba(15,157,88,0.18)'   },
  { id: 'canvas',    label: 'Canvas',      url: 'https://canvas.instructure.com', icon: '📋', bg: 'rgba(230,80,0,0.10)',    glow: 'rgba(230,80,0,0.16)'    },
  { id: 'docs',      label: 'Docs',        url: 'https://docs.google.com',        icon: '📄', bg: 'rgba(26,115,232,0.10)', glow: 'rgba(26,115,232,0.18)'  },
  { id: 'youtube',   label: 'YouTube',     url: 'https://youtube.com',            icon: '▶️', bg: 'rgba(255,0,0,0.10)',    glow: 'rgba(255,0,0,0.16)'     },
  { id: 'wikipedia', label: 'Wikipedia',   url: 'https://en.wikipedia.org',       icon: '📖', bg: 'rgba(120,120,120,0.10)',glow: 'rgba(120,120,120,0.16)' },
  { id: 'google',    label: 'Google',      url: 'https://google.com',             icon: '🌐', bg: 'rgba(66,133,244,0.10)', glow: 'rgba(66,133,244,0.18)'  },
  { id: 'reddit',    label: 'Reddit',      url: 'https://reddit.com',             icon: '💬', bg: 'rgba(255,69,0,0.10)',   glow: 'rgba(255,69,0,0.16)'    },
  { id: 'chatgpt',   label: 'ChatGPT',     url: 'https://chat.openai.com',        icon: '🤖', bg: 'rgba(16,163,127,0.10)', glow: 'rgba(16,163,127,0.18)'  },
];

export default function QuickTiles({ proxyReady = true, onNavigate }) {
  const launch = (tile) => {
    if (!proxyReady) return;
    const dest = proxyUrl(tile.url);
    if (dest) onNavigate?.(dest);
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '14px' }}>
        Quick Launch
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {TILES.map((tile, i) => (
          <button
            key={tile.id}
            onClick={() => launch(tile)}
            className="tile-btn anim-fade-up"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '10px', padding: '20px 8px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'center',
              animationDelay: `${i * 55}ms`,
            }}
          >
            {/* Icon container */}
            <div style={{
              width: '46px', height: '46px',
              borderRadius: '12px',
              background: tile.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
              transition: 'box-shadow 0.18s',
            }}>
              {tile.icon}
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--text-dim)' }}>
              {tile.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
