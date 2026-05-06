import { useState } from 'react';
import { getSettings, saveSetting } from '../lib/storage';
import { setTheme } from '../lib/theme';
import { Icon } from '../lib/icons';

export default function SettingsPanel({ open, onClose }) {
  const [settings, setSettings] = useState(() => getSettings());

  const update = (key, val) => {
    saveSetting(key, val);
    setSettings(s => ({ ...s, [key]: val }));
    if (key === 'theme') setTheme(val);
  };

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-mute)',
    marginBottom: '10px',
    display: 'block',
  };

  const sectionStyle = { marginBottom: '28px' };

  const optBtn = (active) => ({
    padding: '8px 14px',
    borderRadius: '8px',
    border: `1px solid ${active ? 'var(--border-3)' : 'var(--border)'}`,
    background: active ? 'var(--surface-2)' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text-dim)',
    fontFamily: 'var(--font-sans)',
    fontSize: '12.5px',
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
  });

  const ToggleRow = ({ k, title, desc }) => (
    <label
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: '10px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', fontWeight: 500, color: 'var(--text)' }}>{title}</div>
        {desc && <div style={{ fontSize: '11.5px', color: 'var(--text-mute)', marginTop: '2px' }}>{desc}</div>}
      </div>
      <input
        type="checkbox"
        className="toggle"
        checked={!!settings[k]}
        onChange={e => update(k, e.target.checked)}
      />
    </label>
  );

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="anim-fade-in"
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
        />
      )}
      <div
        className="glass-strong"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
          width: '360px', maxWidth: '92vw',
          borderLeft: '1px solid var(--border-2)',
          padding: '24px',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
          boxShadow: open ? 'var(--shadow-2)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <span className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 500, letterSpacing: '0.10em' }}>
            Settings
          </span>
          <button onClick={onClose} className="icon-btn" style={{ width: '30px', height: '30px' }}>
            <Icon name="close" size={14} />
          </button>
        </div>

        {/* Theme */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Theme</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={optBtn(settings.theme === 'light')} onClick={() => update('theme', 'light')}>
              <Icon name="sun" size={13} /> Light
            </button>
            <button style={optBtn(settings.theme === 'dark')} onClick={() => update('theme', 'dark')}>
              <Icon name="moon" size={13} /> Dark
            </button>
          </div>
        </div>

        {/* Modules — proxy / games / music */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Modules</span>
          <ToggleRow k="proxyEnabled" title="Activate Proxy"        desc="Route browsing requests through the secure proxy." />
          <ToggleRow k="proxyGames"   title="Activate Proxy Games"  desc="Show the Games tab — sandboxed via Lumin SDK." />
          <ToggleRow k="proxyMusic"   title="Activate Proxy Music"  desc="Show the Music tab for streaming through proxy." />
        </div>

        {/* Search engine */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Search Engine</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[{ id: 'google', label: 'Google' }, { id: 'bing', label: 'Bing' }, { id: 'ddg', label: 'DuckDuckGo' }].map(e => (
              <button key={e.id} style={optBtn(settings.searchEngine === e.id)} onClick={() => update('searchEngine', e.id)}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panic key */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Panic Key</span>
          <p style={{ fontSize: '11.5px', color: 'var(--text-mute)', marginBottom: '10px', lineHeight: 1.5 }}>
            Press this key to instantly redirect to your safe destination.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {['Escape', 'F1', 'F2', 'F3'].map(k => (
              <button key={k} style={optBtn(settings.panicKey === k)} onClick={() => update('panicKey', k)}>
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
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              borderRadius: '9px', outline: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans)', fontSize: '12.5px',
            }}
          />
        </div>

        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '10.5px', color: 'var(--text-mute)', textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          agentiz · monochrome edition
        </div>
      </div>
    </>
  );
}
