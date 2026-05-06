import { useState, useRef } from 'react';
import { isUrl, proxyUrl, searchUrl } from '../lib/codec';
import { getSettings, pushHistory } from '../lib/storage';

const ENGINES = [
  { id: 'google', label: 'G', title: 'Google',     color: '#4285F4' },
  { id: 'bing',   label: 'B', title: 'Bing',       color: '#008272' },
  { id: 'ddg',    label: 'D', title: 'DuckDuckGo', color: '#DE5833' },
];

export default function SearchBar({ onNavigate }) {
  const [input, setInput] = useState('');
  const [engine, setEngine] = useState(getSettings().searchEngine || 'google');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const go = () => {
    const val = input.trim();
    if (!val) return;
    const dest = isUrl(val) ? proxyUrl(val) : searchUrl(val, engine);
    if (!dest) return;
    pushHistory({ url: val, title: val });
    onNavigate?.(dest);
    window.location.href = dest;
  };

  const activeEngine = ENGINES.find(e => e.id === engine);

  return (
    <div
      className="anim-fade-up"
      style={{ width: '100%', maxWidth: '640px', margin: '0 auto', animationDelay: '180ms' }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border-2)',
          borderRadius: '14px',
          padding: '0 6px 0 8px',
          gap: '6px',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          boxShadow: focused
            ? '0 0 0 2px var(--glow-strong), 0 4px 20px var(--glow)'
            : '0 2px 8px rgba(0,0,0,0.04)',
          borderColor: focused ? 'transparent' : 'var(--border-2)',
        }}
      >
        {/* Engine pills */}
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0, padding: '6px 4px' }}>
          {ENGINES.map(eng => (
            <button
              key={eng.id}
              title={eng.title}
              onClick={() => setEngine(eng.id)}
              style={{
                width: '28px', height: '28px',
                borderRadius: '8px', border: 'none',
                background: engine === eng.id ? eng.color + '22' : 'transparent',
                color: engine === eng.id ? eng.color : 'var(--text-mute)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {eng.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '22px', background: 'var(--border-2)', flexShrink: 0 }} />

        {/* Search icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={focused ? activeEngine?.color : 'var(--text-mute)'} strokeWidth="2.2" style={{ flexShrink: 0, transition: 'stroke 0.2s', marginLeft: '6px' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search or paste a URL…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)', fontSize: '15px',
            padding: '15px 4px',
          }}
          autoComplete="off" spellCheck={false}
        />

        {/* Go button */}
        {input.trim() && (
          <button
            onClick={go}
            style={{
              flexShrink: 0, padding: '9px 18px',
              borderRadius: '9px', border: 'none',
              background: activeEngine?.color || 'var(--text)',
              color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.12s, transform 0.12s',
              boxShadow: `0 2px 8px ${activeEngine?.color}44`,
            }}
            onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Go →
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      <div style={{ textAlign: 'center', marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        {[['Ctrl+K', 'Commands'], ['Ctrl+A', 'Google cloak'], ['Esc', 'Panic']].map(([k, v]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-mute)' }}>
            <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-2)' }}>{k}</kbd>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
