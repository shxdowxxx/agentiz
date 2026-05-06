import { useState, useEffect, useRef } from 'react';
import { proxyUrl } from '../lib/codec';
import { Icon } from '../lib/icons';

const COMMANDS = [
  { id: 'cloak-google',    icon: 'mask',       label: 'Cloak as Google',          hint: 'Ctrl+A',  group: 'Cloak' },
  { id: 'cloak-classroom', icon: 'school',     label: 'Cloak as Classroom',        hint: '',        group: 'Cloak' },
  { id: 'cloak-canvas',    icon: 'clipboard',  label: 'Cloak as Canvas',           hint: '',        group: 'Cloak' },
  { id: 'cloak-clever',    icon: 'key',        label: 'Cloak as Clever',           hint: '',        group: 'Cloak' },
  { id: 'cloak-blank',     icon: 'ghost',      label: 'Blank tab',                 hint: '',        group: 'Cloak' },
  { id: 'cloak-reset',     icon: 'home',       label: 'Reset to Agentiz',          hint: '',        group: 'Cloak' },
  { id: 'settings',        icon: 'settings',   label: 'Open Settings',             hint: '',        group: 'App'   },
  { id: 'toggle-theme',    icon: 'moon',       label: 'Toggle Dark / Light mode',  hint: '',        group: 'App'   },
  { id: 'clear-history',   icon: 'trash',      label: 'Clear browsing history',    hint: '',        group: 'App'   },
  { id: 'panic',           icon: 'alert',      label: 'Panic — go to safe site',   hint: 'Escape',  group: 'App'   },
  { id: 'go-classroom',    icon: 'graduation', label: 'Open Google Classroom',     hint: '',        group: 'Sites' },
  { id: 'go-docs',         icon: 'document',   label: 'Open Google Docs',          hint: '',        group: 'Sites' },
  { id: 'go-youtube',      icon: 'play',       label: 'Open YouTube',              hint: '',        group: 'Sites' },
  { id: 'go-wikipedia',    icon: 'book',       label: 'Open Wikipedia',            hint: '',        group: 'Sites' },
  { id: 'go-reddit',       icon: 'message',    label: 'Open Reddit',               hint: '',        group: 'Sites' },
  { id: 'go-chatgpt',      icon: 'sparkle',    label: 'Open ChatGPT',              hint: '',        group: 'Sites' },
];

const SITE_URLS = {
  'go-classroom': 'https://classroom.google.com',
  'go-docs':      'https://docs.google.com',
  'go-youtube':   'https://youtube.com',
  'go-wikipedia': 'https://en.wikipedia.org',
  'go-reddit':    'https://reddit.com',
  'go-chatgpt':   'https://chat.openai.com',
};

export default function CommandPalette({ open, onClose, onAction }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const execute = (cmd) => {
    onClose();
    setQuery('');

    if (SITE_URLS[cmd.id]) {
      const dest = proxyUrl(SITE_URLS[cmd.id]);
      // Bubble up so the iframe handles it (avoids top-level navigation off S3)
      if (dest) window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));
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
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} />
      <div
        className="glass-strong glass-bevel anim-scale-in"
        style={{
          position: 'fixed', top: '16vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 901, width: '580px', maxWidth: '94vw',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: 'var(--shadow-2)',
        }}
        onKeyDown={onKey}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: '12px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--silver-2)' }}><Icon name="search" size={16} /></span>
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
          <span className="kbd-chip">ESC</span>
        </div>

        {/* Command list */}
        <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-mute)', fontSize: '13px' }}>
              No commands found
            </div>
          ) : filtered.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            const active = i === selected;
            return (
              <div key={cmd.id}>
                {showGroup && (
                  <div style={{ padding: '12px 18px 4px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
                    {cmd.group}
                  </div>
                )}
                <button
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', padding: '11px 18px',
                    background: active ? 'var(--surface-2)' : 'transparent',
                    color: active ? 'var(--text)' : 'var(--text-dim)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.08s, color 0.08s',
                    borderLeft: `2px solid ${active ? 'var(--silver)' : 'transparent'}`,
                  }}
                >
                  <span style={{ width: '20px', display: 'inline-flex', justifyContent: 'center', color: 'var(--silver-2)' }}>
                    <Icon name={cmd.icon} size={15} />
                  </span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: '14px' }}>{cmd.label}</span>
                  {cmd.hint && <span className="kbd-chip">{cmd.hint}</span>}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
          {[['↑↓', 'navigate'], ['↵', 'run'], ['ESC', 'close']].map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-mute)' }}>
              <span className="kbd-chip">{k}</span> {v}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
