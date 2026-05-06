import { useEffect, useState } from 'react';
import { Icon } from '../lib/icons';
import { getSettings } from '../lib/storage';
import { proxyUrl } from '../lib/codec';

const STATIONS = [
  { id: 'soundcloud',  title: 'SoundCloud',   url: 'https://soundcloud.com/discover',         desc: 'Indie streams, full catalog' },
  { id: 'youtube',     title: 'YouTube Music', url: 'https://music.youtube.com',              desc: 'Albums and curated radio' },
  { id: 'bandcamp',    title: 'Bandcamp',     url: 'https://bandcamp.com/discover',            desc: 'Direct-from-artist releases' },
  { id: 'mixcloud',    title: 'Mixcloud',     url: 'https://www.mixcloud.com/discover/',       desc: 'Long-form DJ mixes' },
  { id: 'lofi',        title: 'lofi.cafe',    url: 'https://lofi.cafe',                        desc: 'Ambient lofi station' },
  { id: 'radio',       title: 'Radio Garden', url: 'https://radio.garden',                     desc: 'Live radio worldwide' },
];

export default function Music() {
  const enabled = (() => {
    const s = getSettings();
    return s.proxyMusic !== false && s.proxyEnabled !== false;
  })();

  const [proxyReady, setProxyReady] = useState(true);

  // Open inside iframe via the global event used by Home / CommandPalette.
  const launch = (station) => {
    const dest = proxyUrl(station.url);
    if (!dest) return;
    window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));
  };

  if (!enabled) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 20px 80px', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', color: 'var(--silver-2)', marginBottom: '14px' }}>
          <Icon name="music" size={32} />
        </span>
        <h2 className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Music is disabled
        </h2>
        <p style={{ color: 'var(--text-mute)', fontSize: '13px' }}>
          Open Settings and enable <strong style={{ color: 'var(--text-dim)' }}>Activate Proxy Music</strong> to use this module.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <header style={{ marginBottom: '30px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
          Module · Audio
        </p>
        <h1 className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '0.06em', fontWeight: 500, marginTop: '4px' }}>
          Music
        </h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => launch(s)}
            className="tile-btn glass anim-fade-up"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              gap: '14px', padding: '20px',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              animationDelay: `${i * 40}ms`,
              minHeight: '150px',
            }}
          >
            <div style={{
              width: '42px', height: '42px',
              borderRadius: '11px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--silver)',
            }}>
              <Icon name="music" size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14.5px', fontWeight: 600, color: 'var(--text)' }}>
                {s.title}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-mute)', marginTop: '4px' }}>
                {s.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
