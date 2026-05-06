import { useEffect, useRef, useState } from 'react';
import { Icon } from '../lib/icons';
import { getSettings } from '../lib/storage';

const LUMIN_SRC = 'https://a.luminsdk.com/sdk.js';

// Curated game catalog — surfaced via Lumin when the SDK loads.
// Each entry resolves to a Lumin slug; the SDK launches via `Lumin.play(slug)`.
const CATALOG = [
  { slug: 'slither',         title: 'Slither',           tag: 'arcade'   },
  { slug: 'agar',            title: 'Agar.io',           tag: 'arcade'   },
  { slug: '2048',            title: '2048',              tag: 'puzzle'   },
  { slug: 'chess',           title: 'Chess',             tag: 'classic'  },
  { slug: 'minesweeper',     title: 'Minesweeper',       tag: 'classic'  },
  { slug: 'pacman',          title: 'Pac-Man',           tag: 'arcade'   },
  { slug: 'tetris',          title: 'Tetris',            tag: 'puzzle'   },
  { slug: 'snake',           title: 'Snake',             tag: 'arcade'   },
  { slug: 'sudoku',          title: 'Sudoku',            tag: 'puzzle'   },
  { slug: 'solitaire',       title: 'Solitaire',         tag: 'classic'  },
  { slug: 'flappy',          title: 'Flappy',            tag: 'arcade'   },
  { slug: 'platformer',      title: 'Sky Runner',        tag: 'arcade'   },
];

function loadLumin() {
  return new Promise((resolve, reject) => {
    if (window.Lumin) return resolve(window.Lumin);
    const existing = document.querySelector('script[data-lumin]');
    if (existing) {
      existing.addEventListener('load',  () => resolve(window.Lumin));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = LUMIN_SRC;
    s.async = true;
    s.dataset.lumin = '1';
    s.onload  = () => resolve(window.Lumin);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function Games() {
  const settings = getSettings();
  const enabled = settings.proxyGames !== false && settings.proxyEnabled !== false;

  const [status, setStatus]   = useState(enabled ? 'init' : 'disabled');
  const [active, setActive]   = useState(null);
  const [error,  setError]    = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    loadLumin()
      .then((Lumin) => {
        if (cancelled || !Lumin) return;
        try {
          Lumin.init({
            headless: true,
            onReady: () => { if (!cancelled) setStatus('ready'); },
            onError: (err) => {
              if (cancelled) return;
              setError(err?.message || 'Engine error');
              setStatus('error');
            },
          });
        } catch (err) {
          setError(err?.message || 'Init failed');
          setStatus('error');
        }
      })
      .catch(() => { if (!cancelled) { setStatus('offline'); setError('SDK unavailable'); } });

    return () => { cancelled = true; };
  }, [enabled]);

  const launch = (game) => {
    setActive(game);
    if (window.Lumin?.play) {
      try { window.Lumin.play(game.slug, { mount: stageRef.current }); }
      catch (err) { setError(err?.message || 'Launch failed'); }
    }
  };

  const close = () => {
    setActive(null);
    if (window.Lumin?.stop) {
      try { window.Lumin.stop(); } catch {}
    }
  };

  if (!enabled) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '120px 20px 80px', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', color: 'var(--silver-2)', marginBottom: '14px' }}>
          <Icon name="gamepad" size={32} />
        </span>
        <h2 className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Games are disabled
        </h2>
        <p style={{ color: 'var(--text-mute)', fontSize: '13px' }}>
          Open Settings and enable <strong style={{ color: 'var(--text-dim)' }}>Activate Proxy Games</strong> to use this module.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '30px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
            Module · Lumin
          </p>
          <h1 className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '0.06em', fontWeight: 500, marginTop: '4px' }}>
            Games
          </h1>
        </div>
        <div className="glass" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: '999px',
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--text-dim)', letterSpacing: '0.1em',
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background:
              status === 'ready'    ? 'var(--silver)'    :
              status === 'error'    ? 'var(--text-mute)' :
              status === 'offline'  ? 'var(--text-mute)' : 'var(--silver-2)',
            boxShadow: status === 'ready' ? '0 0 8px var(--glow-strong)' : 'none',
            animation: status === 'init' ? 'spin 1.2s linear infinite' : 'none',
          }} />
          {status.toUpperCase()}
        </div>
      </header>

      {error && (
        <div className="glass" style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Game grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
        {CATALOG.map((g, i) => (
          <button
            key={g.slug}
            onClick={() => launch(g)}
            className="tile-btn glass anim-fade-up"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              gap: '12px', padding: '18px 16px',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              animationDelay: `${i * 36}ms`,
              minHeight: '140px',
            }}
          >
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '10px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--silver)',
            }}>
              <Icon name="gamepad" size={20} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                {g.title}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase', marginTop: '2px' }}>
                {g.tag}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lumin stage overlay */}
      {active && (
        <div
          className="anim-fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 4000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div className="glass-strong" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', borderBottom: '1px solid var(--border-2)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
              {active.title.toUpperCase()}
            </span>
            <button className="icon-btn" onClick={close} title="Close game">
              <Icon name="close" size={14} />
            </button>
          </div>
          <div ref={stageRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            {status !== 'ready' ? 'Engine not ready — please wait' : `Loading ${active.title}…`}
          </div>
        </div>
      )}
    </div>
  );
}
