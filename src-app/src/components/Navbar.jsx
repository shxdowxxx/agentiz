import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession, clearSession } from '../lib/auth';
import { getTheme, setTheme } from '../lib/theme';
import QuickSwitch from './QuickSwitch';

export default function Navbar({ onSettingsOpen, onCommandPalette }) {
  const [session, setSession] = useState(() => getSession());
  const [theme, setThemeState] = useState(() => getTheme());

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setThemeState(next);
  };

  const logout = () => { clearSession(); setSession(null); };

  const iconBtn = {
    width: '36px', height: '36px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '9px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    cursor: 'pointer', fontSize: '15px',
    transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.12s',
  };

  const hoverIn  = e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.boxShadow = '0 0 10px var(--glow)'; e.currentTarget.style.transform = 'translateY(-1px)'; };
  const hoverOut = e => { e.currentTarget.style.borderColor = 'var(--border)';   e.currentTarget.style.boxShadow = 'none';                 e.currentTarget.style.transform = 'translateY(0)'; };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: '54px',
      background: 'rgba(var(--bg-raw, 255,255,255), 0.88)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(16px)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Mini icon */}
        <div style={{
          width: '26px', height: '26px', borderRadius: '7px',
          background: 'linear-gradient(135deg, var(--chrome-from), var(--chrome-mid))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', boxShadow: '0 0 10px var(--glow)',
        }}>
          ⚡
        </div>
        <span
          className="chrome-text"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', fontWeight: 500, letterSpacing: '0.06em' }}
        >
          agentiz
        </span>
      </Link>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Command palette button */}
        <button
          onClick={onCommandPalette}
          title="Command palette (Ctrl+K)"
          onMouseOver={hoverIn} onMouseOut={hoverOut}
          style={{ ...iconBtn, width: 'auto', padding: '0 10px', gap: '6px', fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-mute)', background: 'var(--surface-2)', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-2)' }}>⌘K</span>
        </button>

        <QuickSwitch />

        {/* Theme */}
        <button onClick={toggleTheme} onMouseOver={hoverIn} onMouseOut={hoverOut} style={iconBtn} title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Settings */}
        <button onClick={onSettingsOpen} onMouseOver={hoverIn} onMouseOut={hoverOut} style={iconBtn} title="Settings">
          ⚙️
        </button>

        {/* Auth */}
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)' }}>@{session.user?.username}</span>
            <button
              onClick={logout}
              onMouseOver={hoverIn} onMouseOut={hoverOut}
              style={{ ...iconBtn, width: 'auto', padding: '0 10px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}
            >
              Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              marginLeft: '4px', padding: '7px 14px', borderRadius: '9px',
              border: '1px solid var(--border-2)',
              background: 'var(--text)', color: 'var(--bg)',
              fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              transition: 'opacity 0.12s, box-shadow 0.15s',
              boxShadow: '0 0 12px var(--glow)',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
