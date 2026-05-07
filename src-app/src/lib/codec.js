// Ultraviolet xor codec — must EXACTLY match `Ultraviolet.codec.xor`
// in engine/core.bundle.js, otherwise the SW decodes the proxied URL
// to garbage and the iframe stays blank.
//
// Reference (UV source src/rewrite/codec.ts):
//   xor.encode XORs ONLY odd-indexed characters with 2, then encodeURIComponent.
//   xor.decode does the inverse and preserves the query string verbatim.

export function encode(str) {
  if (!str) return str;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += i % 2 ? String.fromCharCode(str.charCodeAt(i) ^ 2) : str.charAt(i);
  }
  return encodeURIComponent(result);
}

export function decode(str) {
  if (!str) return str;
  const [first, ...search] = str.split('?');
  const input = decodeURIComponent(first);
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += i % 2 ? String.fromCharCode(input.charCodeAt(i) ^ 2) : input.charAt(i);
  }
  return result + (search.length ? '?' + search.join('?') : '');
}

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
