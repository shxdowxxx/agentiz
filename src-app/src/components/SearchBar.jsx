import { useState, useRef } from 'react';
import { isUrl, proxyUrl, searchUrl } from '../lib/codec';
import { getSettings, pushHistory, saveSetting } from '../lib/storage';
import { Icon } from '../lib/icons';

const ENGINES = [
  { id: 'google', label: 'Google'     },
  { id: 'bing',   label: 'Bing'       },
  { id: 'ddg',    label: 'DuckDuckGo' },
];

const RAW_ENGINES = {
  google: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  bing:   (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
  ddg:    (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
};

export default function SearchBar({ onNavigate, proxyReady = true, forceDirectFallback = false }) {
  const [input, setInput] = useState('');
  const [engine, setEngine] = useState(getSettings().searchEngine || 'google');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const updateEngine = (id) => { setEngine(id); saveSetting('searchEngine', id); };

  const go = () => {
    const val = input.trim();
    if (!val) return;

    // Direct-mode fallback: if the proxy is unavailable, open the raw URL
    // in a new tab. This keeps the app useful even when SW is blocked.
    if (forceDirectFallback || !proxyReady) {
      if (!forceDirectFallback) return;
      const direct = isUrl(val)
        ? (val.startsWith('http') ? val : `https://${val}`)
        : RAW_ENGINES[engine](val);
      pushHistory({ url: val, title: val });
      window.open(direct, '_blank', 'noopener,noreferrer');
      setInput('');
      return;
    }

    const dest = isUrl(val) ? proxyUrl(val) : searchUrl(val, engine);
    if (!dest) return;
    pushHistory({ url: val, title: val });
    onNavigate?.(dest);
  };

  const canGo = forceDirectFallback ? !!input.trim() : (proxyReady && !!input.trim());

  return (
    <div className="anim-fade-up" style={{ width: '100%', maxWidth: '660px', margin: '0 auto', animationDelay: '180ms' }}>
      <div
        className="glass glass-bevel"
        style={{
          display: 'flex', alignItems: 'center',
          borderRadius: '14px',
          padding: '0 6px 0 16px',
          gap: '10px',
          transition: 'box-shadow 0.25s, border-color 0.25s',
          borderColor: focused ? 'var(--border-3)' : 'var(--border)',
          boxShadow: focused ? '0 0 0 4px var(--glow-strong), var(--shadow-1)' : 'var(--shadow-1)',
        }}
      >
        {/* Search icon */}
        <span style={{ display: 'inline-flex', color: focused ? 'var(--text)' : 'var(--silver-2)', transition: 'color 0.2s' }}>
          <Icon name="search" size={16} />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search the web or paste a URL…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)', fontSize: '15px',
            padding: '16px 0',
          }}
          autoComplete="off" spellCheck={false}
        />

        {/* Engine selector — monochrome dropdown */}
        <select
          value={engine}
          onChange={e => updateEngine(e.target.value)}
          style={{
            appearance: 'none', WebkitAppearance: 'none',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-2)',
            borderRadius: '7px',
            padding: '6px 10px',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {ENGINES.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
        </select>

        {/* Go button — monochrome. In direct-fallback mode, label changes. */}
        {!proxyReady && !forceDirectFallback ? (
          <div style={{ flexShrink: 0, padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', letterSpacing: '0.06em' }}>
            loading…
          </div>
        ) : canGo ? (
          <button
            onClick={go}
            title={forceDirectFallback ? 'Opens in a new tab (proxy unavailable)' : 'Open in proxy'}
            style={{
              flexShrink: 0, padding: '9px 16px',
              borderRadius: '9px',
              border: '1px solid var(--border-3)',
              background: 'var(--text)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'opacity 0.12s, transform 0.12s',
            }}
            onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {forceDirectFallback ? 'Open' : 'Go'} <Icon name="arrow-right" size={12} stroke={2} />
          </button>
        ) : null}
      </div>

      {/* Keyboard hints */}
      <div style={{ textAlign: 'center', marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
        {[['Ctrl+K','Commands'], ['Ctrl+A','Cloak'], ['Esc','Panic']].map(([k, v]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-mute)' }}>
            <span className="kbd-chip">{k}</span> {v}
          </span>
        ))}
      </div>
    </div>
  );
}
