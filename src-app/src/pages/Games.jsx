import { useState, useMemo } from 'react';
import { Icon } from '../lib/icons';
import { getSettings } from '../lib/storage';
import { proxyUrl } from '../lib/codec';
import { isProxyReady } from '../lib/proxy';

// Curated browser-game catalog. Each entry has a direct URL (used as
// the iframe source when the site allows embedding) and a `proxy: true`
// flag for sites that block X-Frame-Options — those go through the
// proxy iframe overlay if the proxy is up, otherwise open in a new tab.
//
// All entries are real, free, no-install web games.
const GAMES = [
  // === arcade / .io ===
  { id: 'slither',     title: 'Slither.io',      url: 'https://slither.io',                            tag: 'arcade',   proxy: true  },
  { id: 'agar',        title: 'Agar.io',         url: 'https://agar.io',                               tag: 'arcade',   proxy: true  },
  { id: 'krunker',     title: 'Krunker.io',      url: 'https://krunker.io',                            tag: 'shooter',  proxy: true  },
  { id: 'shellshock',  title: 'Shell Shockers',  url: 'https://shellshock.io',                         tag: 'shooter',  proxy: true  },
  { id: 'diepio',      title: 'Diep.io',         url: 'https://diep.io',                               tag: 'arcade',   proxy: true  },
  { id: 'paperio',     title: 'Paper.io 2',      url: 'https://paper-io.com',                          tag: 'arcade',   proxy: true  },
  { id: 'wormate',     title: 'Wormate.io',      url: 'https://wormate.io',                            tag: 'arcade',   proxy: true  },
  { id: 'surviv',      title: 'Surviv.io',       url: 'https://surviv.io',                             tag: 'shooter',  proxy: true  },

  // === puzzle ===
  { id: '2048',        title: '2048',            url: 'https://play2048.co',                           tag: 'puzzle',   proxy: false },
  { id: 'tetris',      title: 'Tetris',          url: 'https://tetris.com/play-tetris',                tag: 'puzzle',   proxy: true  },
  { id: 'sudoku',      title: 'Sudoku',          url: 'https://sudoku.com',                            tag: 'puzzle',   proxy: true  },
  { id: 'minesweeper', title: 'Minesweeper',     url: 'https://minesweeper.online',                    tag: 'puzzle',   proxy: true  },
  { id: 'lightsout',   title: 'Lights Out',      url: 'https://www.logicgamesonline.com/lightsout/',   tag: 'puzzle',   proxy: false },
  { id: 'bloxorz',     title: 'Bloxorz',         url: 'https://www.coolmathgames.com/0-bloxorz',       tag: 'puzzle',   proxy: true  },
  { id: 'unblock',     title: 'Unblock Me',      url: 'https://www.mathsisfun.com/games/unblock.html', tag: 'puzzle',   proxy: false },
  { id: 'hextris',     title: 'Hextris',         url: 'https://hextris.io',                            tag: 'puzzle',   proxy: false },

  // === classic / strategy ===
  { id: 'chess',       title: 'Chess',           url: 'https://www.chess.com/play/computer',           tag: 'classic',  proxy: true  },
  { id: 'lichess',     title: 'Lichess',         url: 'https://lichess.org',                           tag: 'classic',  proxy: true  },
  { id: 'checkers',    title: 'Checkers',        url: 'https://www.247checkers.com',                   tag: 'classic',  proxy: true  },
  { id: 'go',          title: 'Go (online-go)',  url: 'https://online-go.com',                         tag: 'classic',  proxy: true  },
  { id: 'solitaire',   title: 'Solitaire',       url: 'https://www.solitr.com',                        tag: 'classic',  proxy: true  },
  { id: 'mahjong',     title: 'Mahjong',         url: 'https://www.mahjongtitan.com',                  tag: 'classic',  proxy: true  },

  // === retro / nostalgic ===
  { id: 'pacman',      title: 'Pac-Man',         url: 'https://www.google.com/logos/2010/pacman10-i.html', tag: 'retro', proxy: true  },
  { id: 'snake',       title: 'Snake',           url: 'https://www.google.com/fbx?fbx=snake_arcade',   tag: 'retro',    proxy: true  },
  { id: 'pong',        title: 'Pong',            url: 'https://playpong.io',                           tag: 'retro',    proxy: false },
  { id: 'asteroids',   title: 'Asteroids',       url: 'https://freeasteroids.org',                     tag: 'retro',    proxy: false },
  { id: 'spaceinv',    title: 'Space Invaders',  url: 'https://playspaceinvaders.com',                 tag: 'retro',    proxy: false },
  { id: 'breakout',    title: 'Breakout',        url: 'https://breakout-game.io',                      tag: 'retro',    proxy: false },

  // === platformer / runner ===
  { id: 'flappy',      title: 'Flappy Bird',     url: 'https://flappybird.io',                         tag: 'arcade',   proxy: false },
  { id: 'dino',        title: 'T-Rex Runner',    url: 'https://chromedino.com',                        tag: 'arcade',   proxy: false },
  { id: 'jumpman',     title: 'Vex',             url: 'https://www.coolmathgames.com/0-vex-7',         tag: 'platform', proxy: true  },
  { id: 'fireboy',     title: 'Fireboy & Watergirl', url: 'https://www.coolmathgames.com/0-fireboy-watergirl-forest-temple', tag: 'platform', proxy: true },

  // === word / typing ===
  { id: 'wordle',      title: 'Wordle',          url: 'https://wordlegame.org',                        tag: 'word',     proxy: false },
  { id: 'typeracer',   title: 'TypeRacer',       url: 'https://play.typeracer.com',                    tag: 'typing',   proxy: true  },
  { id: 'monkeytype',  title: 'Monkeytype',      url: 'https://monkeytype.com',                        tag: 'typing',   proxy: false },
  { id: 'crossword',   title: 'Crossword',       url: 'https://www.boatloadpuzzles.com/playcrossword', tag: 'word',     proxy: true  },

  // === simulation / sandbox ===
  { id: 'powder',      title: 'Powder Game',     url: 'https://dan-ball.jp/en/javagame/dust2/',        tag: 'sandbox',  proxy: true  },
  { id: 'sandtetris',  title: 'Sandtrix',        url: 'https://sandtrix.fly.dev',                      tag: 'sandbox',  proxy: false },
  { id: 'lifegame',    title: 'Game of Life',    url: 'https://playgameoflife.com',                    tag: 'sandbox',  proxy: false },

  // === multiplayer / fun ===
  { id: 'skribbl',     title: 'Skribbl.io',      url: 'https://skribbl.io',                            tag: 'multi',    proxy: true  },
  { id: 'gartic',      title: 'Gartic Phone',    url: 'https://garticphone.com',                       tag: 'multi',    proxy: true  },
  { id: 'kahoot',      title: 'Kahoot',          url: 'https://kahoot.it',                             tag: 'multi',    proxy: true  },
];

const TAGS = ['all', 'arcade', 'puzzle', 'classic', 'retro', 'platform', 'shooter', 'word', 'typing', 'sandbox', 'multi'];

export default function Games() {
  const settings = getSettings();
  const enabled  = settings.proxyGames !== false;
  const proxyOk  = isProxyReady() && settings.proxyEnabled !== false;

  const [filter, setFilter]   = useState('all');
  const [query,  setQuery]    = useState('');
  const [active, setActive]   = useState(null);

  const visible = useMemo(() => GAMES.filter(g =>
    (filter === 'all' || g.tag === filter) &&
    (!query || g.title.toLowerCase().includes(query.toLowerCase()))
  ), [filter, query]);

  const launch = (game) => {
    // Direct-embed games (proxy:false) are loaded inline in our overlay.
    // Sites that block embedding (proxy:true) need the proxy iframe, OR
    // open in a new tab if proxy is unavailable.
    if (!game.proxy) {
      setActive({ ...game, embedUrl: game.url });
      return;
    }
    if (proxyOk) {
      const dest = proxyUrl(game.url);
      if (dest) {
        window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));
        return;
      }
    }
    // Fallback — new tab.
    window.open(game.url, '_blank', 'noopener,noreferrer');
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
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 20px 80px' }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
            Module · Arcade
          </p>
          <h1 className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '0.06em', fontWeight: 500, marginTop: '4px' }}>
            Games
          </h1>
        </div>
        <div className="glass" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '7px 14px', borderRadius: '999px',
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--text-dim)', letterSpacing: '0.1em',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--silver)', boxShadow: '0 0 6px var(--glow-strong)' }} />
          {visible.length} TITLES
        </div>
      </header>

      {/* Filter row */}
      <div className="glass" style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px', borderRadius: '12px', marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: 'var(--silver-2)', display: 'inline-flex', flexShrink: 0 }}>
          <Icon name="search" size={15} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games…"
          style={{
            flex: 1, minWidth: '180px',
            border: 'none', outline: 'none', background: 'transparent',
            color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: '13.5px',
            padding: '6px 0',
          }}
        />
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {TAGS.map(t => {
            const active = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '6px 11px',
                  borderRadius: '7px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: `1px solid ${active ? 'var(--border-3)' : 'var(--border)'}`,
                  background: active ? 'var(--surface-2)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-mute)',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {visible.map((g, i) => (
          <button
            key={g.id}
            onClick={() => launch(g)}
            className="tile-btn glass anim-fade-up"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              gap: '12px', padding: '18px 16px',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              animationDelay: `${Math.min(i, 14) * 26}ms`,
              minHeight: '142px',
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase', marginTop: '3px' }}>
                {g.tag}{g.proxy ? ' · proxy' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-mute)', fontSize: '13px' }}>
          No games match.
        </div>
      )}

      {/* In-place game player overlay (for embed-friendly games) */}
      {active && (
        <div
          className="anim-fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 4000,
            background: 'rgba(0,0,0,0.86)', backdropFilter: 'blur(8px)',
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                style={{ width: 'auto', padding: '0 12px', gap: '6px', fontSize: '12px', textDecoration: 'none' }}
                title="Open in new tab"
              >
                <Icon name="arrow-right" size={13} /> open
              </a>
              <button className="icon-btn" onClick={() => setActive(null)} title="Close">
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
          <iframe
            src={active.embedUrl}
            style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            title={active.title}
          />
        </div>
      )}
    </div>
  );
}
