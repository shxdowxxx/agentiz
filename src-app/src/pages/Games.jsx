import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '../lib/icons';
import { getSettings } from '../lib/storage';

const LUMIN_SRC = 'https://cdn.jsdelivr.net/gh/luminsdk/script@latest/lumin.min.js';
const PAGE_SIZE = 88;

// ── Thumbnail component ────────────────────────────────────────────────────
function GameThumb({ game, lumin }) {
  const [src, setSrc] = useState(null);
  const dead = useRef(false);

  useEffect(() => {
    dead.current = false;
    if (!lumin || !game?.image_token) return;
    lumin.getImageUrl(game.image_token)
      .then((url) => { if (!dead.current) setSrc(url); })
      .catch(() => {});
    return () => { dead.current = true; };
  }, [lumin, game?.image_token]);

  return (
    <div style={{
      width: '100%', aspectRatio: '16/9',
      borderRadius: '8px 8px 0 0',
      overflow: 'hidden',
      background: 'var(--surface-2)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src ? (
        <img
          src={src}
          alt={game.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      ) : (
        <span style={{ color: 'var(--silver-3)', opacity: 0.5 }}>
          <Icon name="gamepad" size={22} />
        </span>
      )}
    </div>
  );
}

// ── Disabled state ─────────────────────────────────────────────────────────
function DisabledState() {
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

// ── Main page ──────────────────────────────────────────────────────────────
export default function Games() {
  const settings = getSettings();
  if (settings.proxyGames === false) return <DisabledState />;

  const lumRef   = useRef(null);
  const abortRef = useRef(false);

  const [sdkState, setSdkState]     = useState('loading'); // loading | ready | error
  const [sdkError, setSdkError]     = useState(null);

  const [games,      setGames]      = useState([]);
  const [fetching,   setFetching]   = useState(false);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query,      setQuery]      = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  const [activeGame, setActiveGame] = useState(null);  // { name, url }
  const [launching,  setLaunching]  = useState(null);  // game.id being resolved

  // Debounce search input 350ms — reset page on new query
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(query); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [query]);

  // Load Lumin SDK once
  useEffect(() => {
    abortRef.current = false;
    if (window.Lumin) { bootLumin(); return; }
    const el = document.createElement('script');
    el.src = LUMIN_SRC;
    el.onload  = bootLumin;
    el.onerror = () => { if (!abortRef.current) setSdkError('Could not load game engine.'); };
    document.head.appendChild(el);
    return () => { abortRef.current = true; };
  }, []);

  function bootLumin() {
    if (abortRef.current) return;
    try {
      const inst = new window.Lumin();
      lumRef.current = inst;
      inst.init({
        headless: true,
        onReady:  () => { if (!abortRef.current) setSdkState('ready'); },
        onError:  (e) => {
          if (!abortRef.current) {
            setSdkError(e?.message || 'Engine init failed');
            setSdkState('error');
          }
        },
      });
    } catch (e) {
      if (!abortRef.current) {
        setSdkError(e.message);
        setSdkState('error');
      }
    }
  }

  // Fetch games whenever SDK is ready, page, or debouncedQ changes
  useEffect(() => {
    if (sdkState !== 'ready' || !lumRef.current) return;
    let cancelled = false;
    setFetching(true);
    lumRef.current
      .getGames({ page, limit: PAGE_SIZE, q: debouncedQ || undefined })
      .then(({ games: list, pages }) => {
        if (cancelled) return;
        setGames(Array.isArray(list) ? list : []);
        setTotalPages(typeof pages === 'number' ? Math.max(1, pages) : 1);
      })
      .catch((e) => { if (!cancelled) setSdkError(e.message); })
      .finally(() => { if (!cancelled) setFetching(false); });
    return () => { cancelled = true; };
  }, [sdkState, page, debouncedQ]);

  // ESC closes game overlay
  useEffect(() => {
    if (!activeGame) return;
    const h = (e) => { if (e.key === 'Escape') closeGame(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [activeGame]);

  const launchGame = useCallback(async (game) => {
    if (launching || !lumRef.current) return;
    setLaunching(game.id);
    try {
      const res = await lumRef.current.getGameUrl(game.id);
      if (!res?.url) throw new Error('No URL returned');
      setActiveGame({ name: game.name, url: res.url });
    } catch {
      // Fallback: SDK-managed load
      try { await Promise.resolve(lumRef.current.loadGame(game.id)); } catch {}
    } finally {
      setLaunching(null);
    }
  }, [launching]);

  const closeGame = () => setActiveGame(null);

  // ── Loading state ──────────────────────────────────────────────────────
  if (sdkState === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <span style={{ color: 'var(--silver-2)' }}><Icon name="loader" size={28} /></span>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>
          Loading game engine…
        </p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (sdkState === 'error') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px', padding: '40px 20px' }}>
        <span style={{ color: 'var(--silver-2)' }}><Icon name="alert" size={28} /></span>
        <p className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.08em' }}>
          Game engine unavailable
        </p>
        <p style={{ color: 'var(--text-mute)', fontSize: '12px', maxWidth: '360px', textAlign: 'center' }}>
          {sdkError || 'The game catalog could not be loaded. Check your connection.'}
        </p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 20px 96px' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
            Module · Arcade
          </p>
          <h1 className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px,4vw,40px)', letterSpacing: '0.06em', fontWeight: 500, marginTop: '4px' }}>
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
          {fetching ? 'LOADING…' : `${games.length} TITLES`}
        </div>
      </header>

      {/* Search bar */}
      <div className="glass" style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px', borderRadius: '12px', marginBottom: '24px',
      }}>
        <span style={{ color: 'var(--silver-2)', display: 'inline-flex', flexShrink: 0 }}>
          <Icon name="search" size={15} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games…"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: '13.5px',
            padding: '6px 0',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', display: 'flex', padding: '4px' }}
          >
            <Icon name="close" size={13} />
          </button>
        )}
      </div>

      {/* Skeleton while first load */}
      {fetching && games.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '16/9', background: 'var(--surface-2)', width: '100%' }} />
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '12px', borderRadius: '4px', background: 'var(--surface-2)', width: '70%' }} />
                <div style={{ height: '9px', borderRadius: '4px', background: 'var(--surface-2)', width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Game grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {games.map((game, i) => (
              <button
                key={game.id}
                onClick={() => launchGame(game)}
                disabled={!!launching}
                className="tile-btn glass anim-fade-up"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  padding: 0, textAlign: 'left',
                  animationDelay: `${Math.min(i, 20) * 22}ms`,
                  position: 'relative',
                }}
              >
                <GameThumb game={game} lumin={lumRef.current} />
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
                    {game.name}
                  </div>
                  {game.category && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase', marginTop: '4px' }}>
                      {game.category}
                    </div>
                  )}
                </div>
                {launching === game.id && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                    <span style={{ color: '#fff' }}><Icon name="loader" size={20} /></span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {games.length === 0 && !fetching && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-mute)', fontSize: '13px' }}>
              {debouncedQ ? `No games match "${debouncedQ}".` : 'No games available.'}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="glass icon-btn"
                style={{ opacity: page <= 1 ? 0.35 : 1 }}
                title="Previous page"
              >
                <Icon name="arrow-left" size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em', minWidth: '80px', textAlign: 'center' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="glass icon-btn"
                style={{ opacity: page >= totalPages ? 0.35 : 1 }}
                title="Next page"
              >
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Full-screen game overlay */}
      {activeGame && (
        <div
          className="anim-fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 4000,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div className="glass-strong" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 18px', borderBottom: '1px solid var(--border-2)', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.12em' }}>
              {activeGame.name.toUpperCase()}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={activeGame.url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                style={{ width: 'auto', padding: '0 12px', gap: '6px', fontSize: '12px', textDecoration: 'none' }}
              >
                <Icon name="arrow-right" size={13} /> open
              </a>
              <button className="icon-btn" onClick={closeGame} title="Close (Esc)">
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
          <iframe
            src={activeGame.url}
            style={{ flex: 1, border: 'none', width: '100%', background: '#000' }}
            allow="autoplay; fullscreen; gamepad; pointer-lock"
            allowFullScreen
            title={activeGame.name}
          />
        </div>
      )}
    </div>
  );
}
