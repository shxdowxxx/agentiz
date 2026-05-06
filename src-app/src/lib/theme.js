const KEY = 'agentiz_ui_theme';

export function getTheme() {
  return localStorage.getItem(KEY) || 'dark';
}

export function setTheme(mode) {
  localStorage.setItem(KEY, mode);
  applyTheme(mode);
}

export function applyTheme(mode) {
  const html = document.documentElement;
  if (mode === 'dark') html.classList.add('dark');
  else                 html.classList.remove('dark');

  // Sync meta theme-color so the tab/toolbar matches.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'dark' ? '#0b0b0d' : '#f6f6f7');
}

export function initTheme() {
  applyTheme(getTheme());
}
