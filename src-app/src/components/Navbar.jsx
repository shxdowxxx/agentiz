import { useState } from 'react';
import { HashRouter as _, Link, useLocation } from 'react-router-dom';
import { getSession, clearSession } from '../lib/auth';
import { getTheme, setTheme } from '../lib/theme';
import QuickSwitch from './QuickSwitch';

export default function Navbar({ onSettingsOpen }) {
  const [session, setSession] = useState(() => getSession());
  const [theme, setThemeState] = useState(() => getTheme());

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setThemeState(next);
  };

  const logout = () => { clearSession(); setSession(null); };

  const btnBase = {
    padding: '7px 12px', borderRadius: '8px',
    border: '1px solid var(--border-2)',
    background: 'var(--surface)',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
    cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px',
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: '54px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 500, letterSpacing: '0.08em' }}>
          agentiz
        </span>
      </Link>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <QuickSwitch />

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{ ...btnBase, padding: '7px 10px' }} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Settings */}
        <button onClick={onSettingsOpen} style={{ ...btnBase, padding: '7px 10px' }} title="Settings">
          ⚙️
        </button>

        {/* Auth */}
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-dim)' }}>
              @{session.user?.username}
            </span>
            <button onClick={logout} style={btnBase}>Sign out</button>
          </div>
        ) : (
          <Link to="/login" style={{ ...btnBase, border: '1px solid var(--text)', color: 'var(--text)', background: 'transparent' }}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
