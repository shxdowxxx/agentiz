import { useState } from 'react';
import { getSettings, saveSetting } from '../lib/storage';
import { getTheme, setTheme } from '../lib/theme';

export default function SettingsPanel({ open, onClose }) {
  const [settings, setSettings] = useState(() => getSettings());

  const update = (key, val) => {
    saveSetting(key, val);
    setSettings(s => ({ ...s, [key]: val }));
    if (key === 'theme') setTheme(val);
  };

  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '8px', display: 'block' };
  const rowStyle = { marginBottom: '24px' };
  const optBtnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '8px',
    border: `1px solid ${active ? 'var(--border-2)' : 'var(--border)'}`,
    background: active ? 'var(--surface-2)' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-dim)',
    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: active ? 500 : 400,
    cursor: 'pointer', transition: 'all 0.1s',
  });

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.3)' }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
        width: '320px',
        background: 'var(--bg)',
        borderLeft: '1px solid var(--border)',
        padding: '24px',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <span className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.08em' }}>
            Settings
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>✕</button>
        </div>

        {/* Theme */}
        <div style={rowStyle}>
          <span style={labelStyle}>Theme</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['light', 'dark'].map(t => (
              <button key={t} style={optBtnStyle(settings.theme === t)} onClick={() => update('theme', t)}>
                {t === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </div>

        {/* Search engine */}
        <div style={rowStyle}>
          <span style={labelStyle}>Search Engine</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ id: 'google', label: 'Google' }, { id: 'bing', label: 'Bing' }, { id: 'ddg', label: 'DuckDuckGo' }].map(e => (
              <button key={e.id} style={optBtnStyle(settings.searchEngine === e.id)} onClick={() => update('searchEngine', e.id)}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panic key */}
        <div style={rowStyle}>
          <span style={labelStyle}>Panic Key</span>
          <p style={{ fontSize: '12px', color: 'var(--text-mute)', marginBottom: '10px' }}>
            Press this key to instantly redirect to your safe destination.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {['Escape', 'F1', 'F2', 'F3'].map(k => (
              <button key={k} style={optBtnStyle(settings.panicKey === k)} onClick={() => update('panicKey', k)}>
                {k}
              </button>
            ))}
          </div>
          <input
            placeholder="Panic destination URL"
            value={settings.panicDest}
            onChange={e => update('panicDest', e.target.value)}
            style={{
              width: '100%', padding: '10px 12px',
              background: 'var(--surface)', border: '1px solid var(--border-2)',
              borderRadius: '8px', outline: 'none',
              color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: '13px',
            }}
          />
        </div>
      </div>
    </>
  );
}
