const KEY = 'agentiz_ui_theme';

export function getTheme() {
  return localStorage.getItem(KEY) || 'light';
}

export function setTheme(mode) {
  localStorage.setItem(KEY, mode);
  applyTheme(mode);
}

export function applyTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function initTheme() {
  applyTheme(getTheme());
}
