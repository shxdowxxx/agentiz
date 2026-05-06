import { useState } from 'react';
import { getSettings, saveSetting } from '../lib/storage';

const PRESETS = [
  { id: 'default', label: 'Agentiz',         title: 'Agentiz',         favicon: '/icon.png' },
  { id: 'google',  label: 'Google',           title: 'Google',          favicon: 'https://www.google.com/favicon.ico' },
  { id: 'gclass',  label: 'Google Classroom', title: 'Classes',         favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
  { id: 'canvas',  label: 'Canvas',           title: 'Dashboard',       favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
  { id: 'clever',  label: 'Clever',           title: 'Clever | Portal', favicon: 'https://clever.com/favicon.ico' },
  { id: 'blank',   label: 'Blank tab',        title: '​',          favicon: 'data:image/svg+xml,%3Csvg xmlns%3D"http%3A//www.w3.org/2000/svg"/%3E' },
];

function applyPreset(preset) {
  document.title = preset.title;
  const link = document.querySelector("link[rel~='icon']");
  if (link) link.href = preset.favicon;
  localStorage.setItem('agentiz_theme', preset.id);
}

export default function QuickSwitch() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(getSettings().cloak || 'default');

  const select = (preset) => {
    applyPreset(preset);
    setActive(preset.id);
    saveSetting('cloak', preset.id);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Quick Switch tab appearance"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-2)',
          background: 'var(--surface)',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.12s',
        }}
      >
        <span>⚡</span>
        <span>Switch</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 50,
              background: 'var(--surface)',
              border: '1px solid var(--border-2)',
              borderRadius: '10px',
              padding: '4px',
              minWidth: '200px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => select(p)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '9px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: active === p.id ? 'var(--surface-2)' : 'transparent',
                  color: active === p.id ? 'var(--text)' : 'var(--text-dim)',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseOver={e => { if (active !== p.id) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseOut={e => { if (active !== p.id) e.currentTarget.style.background = 'transparent'; }}
              >
                {p.label}
                {active === p.id && <span style={{ fontSize: '10px', color: 'var(--text-mute)' }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
