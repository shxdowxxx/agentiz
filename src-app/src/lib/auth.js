const SENTRY = 'https://sentry-production-60e4.up.railway.app';
const TOKEN_KEY = 'ag_auth_token';
const USER_KEY  = 'ag_auth_user';

export function getSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user  = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return token && user ? { token, user } : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Step 1: ask Sentry to DM the user a code via Discord
export async function requestCode(username) {
  const res = await fetch(`${SENTRY}/api/auth/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Could not send code. Check your username.');
  }
  return res.json(); // { ok: true, expires: timestamp }
}

// Step 2: verify the code entered by the user
export async function verifyCode(username, code) {
  const res = await fetch(`${SENTRY}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Invalid or expired code.');
  }
  const data = await res.json(); // { ok: true, token, user: { id, username, avatar } }
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}
