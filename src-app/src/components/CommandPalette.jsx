import { useState, useEffect, useRef } from 'react';
import { proxyUrl, searchUrl } from '../lib/codec';
import { clearHistory, saveSetting, getSettings } from '../lib/storage';
import { setTheme, getTheme } from '../lib/theme';

// onAction receives { type, payload } from parent
export default function CommandPalette({ open, onClose, onAction }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const COMMANDS = [
    { id: 'cloak-google',    icon: '🎭', label: 'Cloak as Google',          hint: 'Ctrl+A',  group: 'Cloak' },
    { id: 'cloak-classroom', icon: '🏫', label: 'Cloak as Classroom',        hint: '',        group: 'Cloak' },
    { id: 'cloak-canvas',    icon: '📊', label: 'Cloak as Canvas',           hint: '',        group: 'Cloak' },
    { id: 'cloak-clever',    icon: '🔑', label: 'Cloak as Clever',           hint: '',        group: 'Cloak' },
    { id: 'cloak-blank',     icon: '👻', label: 'Blank tab',                 hint: '',        group: 'Cloak' },
    { id: 'cloak-reset',     icon: '🏠', label: 'Reset to Agentiz',          hint: '',        group: 'Cloak' },
    { id: 'settings',        icon: '⚙️', label: 'Open Settings',             hint: '',        group: 'App'   },
    { id: 'toggle-theme',    icon: '🌙', label: 'Toggle Dark / Light mode',  hint: '',        group: 'App'   },
    { id: 'clear-history',   icon: '🗑️', label: 'Clear browsing history',    hint: '',        group: 'App'   },
    { id: 'panic',           icon: '🚨', label: 'Panic — go to safe site',   hint: 'Escape',  group: 'App'   },
    { id: 'go-classroom',    icon: '🎓', label: 'Open Google Classroom',      hint: '',        group: 'Sites' },
    { id: 'go-docs',         icon: '📄', label: 'Open Google Docs',           hint: '',        group: 'Sites' },
    { id: 'go-youtube',      icon: '▶️', label: 'Open YouTube',              hint: '',        group: 'Sites' },
    { id: 'go-wikipedia',    icon: '📖', label: 'Open Wikipedia',             hint: '',        group: 'Sites' },
    { id: 'go-reddit',       icon: '💬', label: 'Open Reddit',               hint: '',        group: 'Sites' },
    { id: 'go-chatgpt',      icon: '🤖', label: 'Open ChatGPT',              hint: '',        group: 'Sites' },
  ];

  const filtered = query.trim()
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const execute = (cmd) => {
    onClose();
    setQuery('');

    const SITE_URLS = {
      'go-classroom': 'https://classroom.google.com',
      'go-docs':      'https://docs.google.com',
      'go-youtube':   'https://youtube.com',
      'go-wikipedia': 'https://en.wikipedia.org',
      'go-reddit':    'https://reddit.com',
      'go-chatgpt':   'https://chat.openai.com',
    };

    if (SITE_URLS[cmd.id]) {
      const dest = proxyUrl(SITE_URLS[cmd.id]);
      if (dest) window.location.href = dest;
      return;
    }

    onAction?.({ type: cmd.id });
  };

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter')     { if (filtered[selected]) execute(filtered[selected]); }
    if (e.key === 'Escape')    { onClose(); }
  };

  if (!open) return null;

  let lastGroup = null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
      <div
        className="anim-scale-in"
        style={{
          position: 'fixed', top: '18vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 901, width: '560px', maxWidth: '94vw',
          background: 'var(--bg)', border: '1px solid var(--border-2)',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px var(--border)',
        }}
        onKeyDown={onKey}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: '12px', borderBottom: '1px solid var(--border)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-mute)" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: '15px',
            }}
          />
          <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', background: 'var(--surface-2)', padding: '3px 7px', borderRadius: '5px', border: '1px solid var(--border-2)' }}>
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-mute)', fontSize: '14px' }}>
              No commands found
            </div>
          ) : filtered.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            return (
              <div key={cmd.id}>
                {showGroup && (
                  <div style={{ padding: '10px 18px 4px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
                    {cmd.group}
                  </div>
                )}
                <button
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', padding: '10px 18px',
                    border: 'none', background: i === selected ? 'var(--surface)' : 'transparent',
                    color: 'var(--text)', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.08s',
                  }}
                >
                  <span style={{ fontSize: '17px', width: '24px', textAlign: 'center' }}>{cmd.icon}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '14px' }}>{cmd.label}</span>
                  {cmd.hint && (
                    <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border-2)', flexShrink: 0 }}>
                      {cmd.hint}
                    </kbd>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '8px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
          {[['↑↓', 'navigate'], ['↵', 'run'], ['ESC', 'close']].map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-mute)' }}>
              <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'var(--surface-2)', padding: '2px 5px', borderRadius: '3px', border: '1px solid var(--border-2)' }}>{k}</kbd>
              {v}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
