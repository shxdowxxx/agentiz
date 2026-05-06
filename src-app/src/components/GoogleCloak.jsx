import { useState } from 'react';
import { searchUrl } from '../lib/codec';

// Pixel-accurate Google homepage replica
export default function GoogleCloak({ visible, onHide }) {
  const [q, setQ] = useState('');

  const search = () => {
    if (!q.trim()) return;
    const dest = searchUrl(q.trim(), 'google');
    if (dest) window.location.href = dest;
  };

  const onKey = (e) => {
    if (e.key === 'Enter') search();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 8888,
        background: '#fff',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'arial, sans-serif',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '8px 20px', gap: '12px' }}>
        {['About','Store','Gmail','Images'].map(l => (
          <a key={l} href="#" onClick={e => e.preventDefault()} style={{ fontSize: '13px', color: '#202124', textDecoration: 'none' }}>{l}</a>
        ))}
        <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368"><path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
        </div>
        <button style={{ padding: '8px 22px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign in
        </button>
      </div>

      {/* Center content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-60px' }}>
        {/* Google logo */}
        <div style={{ fontSize: '92px', fontFamily: 'Product Sans, arial, sans-serif', fontWeight: 400, letterSpacing: '-2px', marginBottom: '32px', lineHeight: 1 }}>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#DB4437' }}>o</span>
          <span style={{ color: '#F4B400' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#0F9D58' }}>l</span>
          <span style={{ color: '#DB4437' }}>e</span>
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          width: '580px', maxWidth: '90vw',
          height: '46px',
          border: '1px solid #dfe1e5',
          borderRadius: '24px',
          padding: '0 16px',
          gap: '10px',
          boxShadow: '0 1px 6px rgba(32,33,36,.28)',
          marginBottom: '28px',
          background: '#fff',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: '16px',
              color: '#202124', background: 'transparent', fontFamily: 'inherit',
            }}
          />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#4285F4" style={{ cursor: 'pointer' }}>
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Google Search', "I'm Feeling Lucky"].map(label => (
            <button
              key={label}
              onClick={label === 'Google Search' ? search : undefined}
              style={{
                padding: '10px 20px', background: '#f8f9fa', border: '1px solid #f8f9fa',
                borderRadius: '4px', fontSize: '14px', color: '#3c4043',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#dadce0'; e.currentTarget.style.boxShadow = '0 1px 1px rgba(0,0,0,.1)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#f8f9fa'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Language line */}
        <div style={{ marginTop: '32px', fontSize: '13px', color: '#202124' }}>
          Google offered in:&nbsp;
          <a href="#" onClick={e => e.preventDefault()} style={{ color: '#1a0dab', textDecoration: 'none' }}>Español</a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#f2f2f2', borderTop: '1px solid #e4e4e4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Advertising','Business','How Search works'].map(l => (
              <a key={l} href="#" onClick={e => e.preventDefault()} style={{ fontSize: '13px', color: '#70757a', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy','Terms','Settings'].map(l => (
              <a key={l} href="#" onClick={e => e.preventDefault()} style={{ fontSize: '13px', color: '#70757a', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
