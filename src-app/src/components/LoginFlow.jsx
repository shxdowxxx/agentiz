import { useState } from 'react';
import { requestCode, verifyCode } from '../lib/auth';

export default function LoginFlow({ onSuccess }) {
  const [step, setStep] = useState('username'); // username | waiting | code | error
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expires, setExpires] = useState(null);

  const sendCode = async () => {
    const u = username.trim().replace(/^@/, '');
    if (!u) return;
    setLoading(true); setError('');
    try {
      const res = await requestCode(u);
      setExpires(res.expires);
      setStep('waiting');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    const c = code.trim();
    if (!c) return;
    setLoading(true); setError('');
    try {
      const user = await verifyCode(username.trim().replace(/^@/, ''), c);
      onSuccess?.(user);
    } catch (e) {
      setError(e.message);
      setStep('code');
    } finally {
      setLoading(false);
    }
  };

  const boxStyle = {
    background: 'var(--surface)', border: '1px solid var(--border-2)',
    borderRadius: '14px', padding: '40px 36px',
    maxWidth: '400px', width: '100%', textAlign: 'center',
  };

  const inputStyle = {
    width: '100%', padding: '13px 14px',
    background: 'var(--bg)', border: '1px solid var(--border-2)',
    borderRadius: '9px', outline: 'none',
    color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: '14px',
    marginBottom: '12px',
  };

  const btnStyle = {
    width: '100%', padding: '13px',
    background: 'var(--text)', color: 'var(--bg)',
    border: 'none', borderRadius: '9px',
    fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer', transition: 'opacity 0.12s',
    opacity: loading ? 0.6 : 1,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 16px' }}>
      <div style={boxStyle}>
        {/* Wordmark */}
        <div className="chrome-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 500, letterSpacing: '0.1em', marginBottom: '8px' }}>
          agentiz
        </div>

        {step === 'username' && (
          <>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '28px', lineHeight: 1.5 }}>
              Enter your Discord username to sign in.
            </p>
            <input
              style={inputStyle}
              placeholder="your_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendCode()}
              autoComplete="off"
              spellCheck={false}
            />
            {error && <p style={{ color: '#f66', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
            <button style={btnStyle} onClick={sendCode} disabled={loading}>
              {loading ? 'Sending…' : 'Continue →'}
            </button>
          </>
        )}

        {step === 'waiting' && (
          <>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: '16px 0 8px', lineHeight: 1.6 }}>
              Check your Discord server. A message was posted — click <strong style={{ color: 'var(--text)' }}>Show Code</strong> to get your sign-in code.
            </p>
            <p style={{ color: 'var(--text-mute)', fontSize: '12px', marginBottom: '28px' }}>
              Code expires in 5 minutes. Only you can reveal it.
            </p>
            <button style={{ ...btnStyle, background: 'var(--surface-2)', color: 'var(--text)' }} onClick={() => setStep('code')}>
              I have my code →
            </button>
          </>
        )}

        {step === 'code' && (
          <>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '28px' }}>
              Enter the 6-digit code from Discord.
            </p>
            <input
              style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: '22px', textAlign: 'center', letterSpacing: '0.2em' }}
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && submitCode()}
              autoComplete="one-time-code"
            />
            {error && <p style={{ color: '#f66', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
            <button style={btnStyle} onClick={submitCode} disabled={loading}>
              {loading ? 'Verifying…' : 'Sign in →'}
            </button>
            <button
              onClick={() => setStep('waiting')}
              style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '12px', cursor: 'pointer', marginTop: '12px' }}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
