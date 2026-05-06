// XOR codec — matches engine/core.config.js AppCodec.xor
export const encode = (str) =>
  encodeURIComponent([...str].map(c => String.fromCharCode(c.charCodeAt(0) ^ 2)).join(''));

export const decode = (str) =>
  [...decodeURIComponent(str)].map(c => String.fromCharCode(c.charCodeAt(0) ^ 2)).join('');

export function proxyUrl(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return `/s/${encode(u.href)}`;
  } catch {
    return null;
  }
}

export function searchUrl(query, engine = 'google') {
  const engines = {
    google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    bing:   `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    ddg:    `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
  };
  return proxyUrl(engines[engine] || engines.google);
}

export function isUrl(input) {
  try {
    const u = new URL(input.startsWith('http') ? input : `https://${input}`);
    return u.hostname.includes('.') && !input.includes(' ');
  } catch {
    return false;
  }
}
