import { useEffect, useState } from 'react';

export default function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [fading, setFading] = useState(false);

  const phases = [
    'Initializing workspace…',
    'Loading proxy engine…',
    'Registering service workers…',
    'Ready.',
  ];

  useEffect(() => {
    const steps = [
      { p: 30, delay: 200 },
      { p: 60, delay: 500 },
      { p: 85, delay: 900 },
      { p: 100, delay: 1300 },
    ];

    let i = 0;
    const run = () => {
      if (i >= steps.length) return;
      const { p, delay } = steps[i++];
      setTimeout(() => {
        setProgress(p);
        setPhase(Math.min(i, phases.length - 1));
        run();
      }, delay);
    };

    run();

    const fadeTimer = setTimeout(() => setFading(true), 1700);
    const doneTimer = setTimeout(() => onDone?.(), 2100);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '28px',
        transition: 'opacity 0.4s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Wordmark */}
      <div style={{ textAlign: 'center' }}>
        <div
          className="chrome-text"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 500, letterSpacing: '0.1em' }}
        >
          agentiz
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-mute)', marginTop: '6px', textTransform: 'uppercase' }}>
          student workspace
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '200px', height: '2px', background: 'var(--border-2)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--chrome-mid), var(--chrome-from))',
            borderRadius: '2px',
            width: `${progress}%`,
            transition: 'width 0.35s ease',
          }}
        />
      </div>

      {/* Phase label */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-mute)', letterSpacing: '0.06em' }}>
        {phases[phase]}
      </div>
    </div>
  );
}
