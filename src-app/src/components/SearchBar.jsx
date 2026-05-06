import { useState, useRef } from 'react';
import { isUrl, proxyUrl, searchUrl } from '../lib/codec';
import { getSettings, pushHistory } from '../lib/storage';

const ENGINES = [
  { id: 'google', label: 'G', title: 'Google' },
  { id: 'bing',   label: 'B', title: 'Bing' },
  { id: 'ddg',    label: 'D', title: 'DuckDuckGo' },
];

export default function SearchBar({ onNavigate }) {
  const [input, setInput] = useState('');
  const [engine, setEngine] = useState(getSettings().searchEngine || 'google');
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

  const onKey = (e) => {
    if (e.key === 'Enter') go();
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border-2)',
          borderRadius: '12px',
          padding: '0 4px 0 16px',
          gap: '8px',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--text-mute)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-2)'}
      >
        {/* Engine selector */}
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
          {ENGINES.map(eng => (
            <button
              key={eng.id}
              title={eng.title}
              onClick={() => setEngine(eng.id)}
              style={{
                width: '26px', height: '26px',
                borderRadius: '6px',
                border: 'none',
                background: engine === eng.id ? 'var(--surface-2)' : 'transparent',
                color: engine === eng.id ? 'var(--text)' : 'var(--text-mute)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.12s, color 0.12s',
              }}
            >
              {eng.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-2)', flexShrink: 0 }} />

        {/* Input */}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search or enter a URL…"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            padding: '14px 0',
          }}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Go button */}
        {input.trim() && (
          <button
            onClick={go}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--text)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.12s',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Go
          </button>
        )}
      </div>
    </div>
  );
}
