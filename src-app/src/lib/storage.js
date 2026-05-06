// Abstraction over localStorage (guest) and Firestore (logged-in users).
// Firestore sync is wired once auth is set up — for now everything uses localStorage.

const KEYS = {
  bookmarks: 'ag_bookmarks',
  history:   'ag_history',
  settings:  'ag_settings',
};

const MAX_HISTORY = 50;

// ---- Bookmarks ----

export function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(KEYS.bookmarks) || '[]'); }
  catch { return []; }
}

export function addBookmark(item) {
  const list = getBookmarks().filter(b => b.url !== item.url);
  list.unshift({ url: item.url, title: item.title || item.url, addedAt: Date.now() });
  localStorage.setItem(KEYS.bookmarks, JSON.stringify(list));
}

export function removeBookmark(url) {
  const list = getBookmarks().filter(b => b.url !== url);
  localStorage.setItem(KEYS.bookmarks, JSON.stringify(list));
}

export function isBookmarked(url) {
  return getBookmarks().some(b => b.url === url);
}

// ---- History ----

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEYS.history) || '[]'); }
  catch { return []; }
}

export function pushHistory(item) {
  const list = getHistory().filter(h => h.url !== item.url);
  list.unshift({ url: item.url, title: item.title || item.url, visitedAt: Date.now() });
  localStorage.setItem(KEYS.history, JSON.stringify(list.slice(0, MAX_HISTORY)));
}

export function clearHistory() {
  localStorage.removeItem(KEYS.history);
}

// ---- Settings ----

const defaultSettings = {
  theme:         'dark',
  searchEngine:  'google',
  cloak:         'default',
  panicKey:      'Escape',
  panicDest:     'https://classroom.google.com',
  proxyEnabled:  true,
  proxyGames:    true,
  proxyMusic:    true,
};

export function getSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(KEYS.settings) || '{}') };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSetting(key, value) {
  const s = getSettings();
  s[key] = value;
  localStorage.setItem(KEYS.settings, JSON.stringify(s));
}
