import { useState } from 'react';
import { getSettings, saveSetting } from '../lib/storage';
import { Icon } from '../lib/icons';

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
        title="Switch tab appearance"
        className="icon-btn"
        style={{ width: 'auto', padding: '0 12px', gap: '7px', fontSize: '12.5px', fontWeight: 500, color: 'var(--text-dim)' }}
      >
        <Icon name="switch" size={14} />
        <span>Cloak</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            className="glass-strong glass-bevel anim-scale-in"
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 50,
              borderRadius: '12px',
              padding: '6px',
              minWidth: '220px',
              boxShadow: 'var(--shadow-2)',
            }}
          >
            {PRESETS.map(p => {
              const isActive = active === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => select(p)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '9px 12px',
                    borderRadius: '8px',
                    background: isActive ? 'var(--surface-2)' : 'transparent',
                    color: isActive ? 'var(--text)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface)'; }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {p.label}
                  {isActive && <Icon name="check" size={13} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
