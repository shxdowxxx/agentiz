// XOR codec — must exactly match Ultraviolet.codec.xor in engine/core.bundle.js
const xorChar = (c) => String.fromCharCode(c.charCodeAt(0) ^ 2);

export const encode = (str) =>
  encodeURIComponent(str.split('').map(xorChar).join(''));

export const decode = (str) => {
  const [input, ...search] = str.split('?');
  return (
    decodeURIComponent(input).split('').map(xorChar).join('') +
    (search.length ? '?' + search.join('?') : '')
  );
};

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
