import { proxyUrl } from '../lib/codec';

const TILES = [
  { id: 'classroom', label: 'Classroom',  url: 'https://classroom.google.com',  emoji: '🎓' },
  { id: 'canvas',    label: 'Canvas',     url: 'https://canvas.instructure.com', emoji: '📋' },
  { id: 'docs',      label: 'Google Docs',url: 'https://docs.google.com',        emoji: '📄' },
  { id: 'youtube',   label: 'YouTube',    url: 'https://youtube.com',            emoji: '▶️' },
  { id: 'wikipedia', label: 'Wikipedia',  url: 'https://en.wikipedia.org',       emoji: '📖' },
  { id: 'google',    label: 'Google',     url: 'https://google.com',             emoji: '🔍' },
  { id: 'reddit',    label: 'Reddit',     url: 'https://reddit.com',             emoji: '💬' },
  { id: 'chatgpt',   label: 'ChatGPT',    url: 'https://chat.openai.com',        emoji: '🤖' },
];

export default function QuickTiles() {
  const launch = (tile) => {
    const dest = proxyUrl(tile.url);
    if (dest) window.location.href = dest;
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '14px' }}>
        Quick Launch
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {TILES.map(tile => (
          <button
            key={tile.id}
            onClick={() => launch(tile)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px',
              padding: '18px 8px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, transform 0.12s, background 0.15s',
              textAlign: 'center',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{tile.emoji}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--text-dim)' }}>
              {tile.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
