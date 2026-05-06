import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getSession, clearSession } from '../lib/auth';
import { getTheme, setTheme } from '../lib/theme';
import { Icon } from '../lib/icons';
import QuickSwitch from './QuickSwitch';

export default function Navbar({ onSettingsOpen, onCommandPalette }) {
  const [session, setSession] = useState(() => getSession());
  const [theme, setThemeState] = useState(() => getTheme());
  const loc = useLocation();

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setThemeState(next);
  };

  const logout = () => { clearSession(); setSession(null); };

  const navLinks = [
    { to: '/',       label: 'Home',  match: '/' },
    { to: '/games',  label: 'Games', match: '/games' },
    { to: '/music',  label: 'Music', match: '/music' },
  ];

  return (
    <nav
      className="glass glass-bevel"
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 22px', height: '56px',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
      }}
    >
      {/* Left — wordmark only, no logo glyph */}
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center',
          padding: '6px 4px', borderRadius: '6px',
        }}
      >
        <span
          className="chrome-text"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '17px',
            fontWeight: 500,
            letterSpacing: '0.10em',
          }}
        >
          agentiz
        </span>
      </Link>

      {/* Center — page tabs (subtle, only show when not on /login) */}
      {loc.pathname !== '/login' && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map(l => {
            const active = loc.pathname === l.match;
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: active ? 'var(--text)' : 'var(--text-mute)',
                  background: active ? 'var(--surface-2)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-2)' : 'transparent'}`,
                  transition: 'color 0.15s, background 0.15s, border-color 0.15s',
                }}
                onMouseOver={e => { if (!active) e.currentTarget.style.color = 'var(--text-dim)'; }}
                onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--text-mute)'; }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="icon-btn"
          onClick={onCommandPalette}
          title="Command palette (Ctrl+K)"
          style={{ width: 'auto', padding: '0 10px', gap: '7px' }}
        >
          <Icon name="command" size={14} />
          <span className="kbd-chip">⌘K</span>
        </button>

        <QuickSwitch />

        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
        </button>

        <button className="icon-btn" onClick={onSettingsOpen} title="Settings">
          <Icon name="settings" size={16} />
        </button>

        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>
              @{session.user?.username}
            </span>
            <button className="icon-btn" onClick={logout} title="Log out" style={{ width: 'auto', padding: '0 10px', gap: '6px' }}>
              <Icon name="logout" size={14} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              marginLeft: '4px', padding: '8px 16px', borderRadius: '9px',
              border: '1px solid var(--border-3)',
              background: 'var(--text)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'opacity 0.12s, transform 0.12s',
            }}
            onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Icon name="login" size={14} /> Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
