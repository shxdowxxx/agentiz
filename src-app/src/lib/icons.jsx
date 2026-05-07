// Silver-toned, monochrome SVG icon set (lucide-style strokes).
// Uses currentColor so callers can tint via `color: var(--silver)` etc.
// All strokes are 1.6 for a thinner, more professional look.

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function Icon({ name, size = 18, stroke = 1.6, ...rest }) {
  const props = { ...base, width: size, height: size, strokeWidth: stroke, ...rest };
  switch (name) {
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'sun':
      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case 'moon':
      return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>;
    case 'settings':
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'command':
      return <svg {...props}><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>;
    case 'close':
      return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'arrow-right':
      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left':
      return <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'loader':
      return <svg {...props} style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>;
    case 'home':
      return <svg {...props}><path d="m3 12 9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></svg>;
    case 'globe':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'graduation':
      return <svg {...props}><path d="M22 10 12 4 2 10l10 6 10-6z"/><path d="M6 12v5a6 6 0 0 0 12 0v-5"/></svg>;
    case 'document':
      return <svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 13h6M9 17h6"/></svg>;
    case 'play':
      return <svg {...props}><path d="m7 4 13 8-13 8z"/></svg>;
    case 'book':
      return <svg {...props}><path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2zM4 19a2 2 0 0 1 2-2h13"/></svg>;
    case 'message':
      return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'sparkle':
      return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case 'clipboard':
      return <svg {...props}><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/></svg>;
    case 'gamepad':
      return <svg {...props}><path d="M6 11h4M8 9v4"/><circle cx="15" cy="11" r="0.6" fill="currentColor"/><circle cx="17.5" cy="13.5" r="0.6" fill="currentColor"/><path d="M3 17.5C3 12 5 9 8 9h8c3 0 5 3 5 8.5 0 1.4-.9 2.5-2 2.5-1 0-1.6-.6-2.3-1.5L15 17H9l-1.7 1.5C6.6 19.4 6 20 5 20c-1.1 0-2-1.1-2-2.5z"/></svg>;
    case 'music':
      return <svg {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case 'shield':
      return <svg {...props}><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/></svg>;
    case 'bookmark':
      return <svg {...props}><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
    case 'clock':
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'trash':
      return <svg {...props}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case 'alert':
      return <svg {...props}><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.7 3h16.96a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0z"/></svg>;
    case 'mask':
      return <svg {...props}><path d="M3 9c0-2 2-4 5-4 2 0 3 1 4 1s2-1 4-1c3 0 5 2 5 4v3a8 8 0 0 1-9 8 8 8 0 0 1-9-8z"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/></svg>;
    case 'school':
      return <svg {...props}><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9"/></svg>;
    case 'key':
      return <svg {...props}><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/></svg>;
    case 'ghost':
      return <svg {...props}><path d="M12 2a8 8 0 0 0-8 8v11l3-2 3 2 3-2 3 2 3-2 1 2V10a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="0.8" fill="currentColor"/><circle cx="15" cy="11" r="0.8" fill="currentColor"/></svg>;
    case 'check':
      return <svg {...props}><path d="m5 12 5 5L20 7"/></svg>;
    case 'plus':
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'logout':
      return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'login':
      return <svg {...props}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>;
    case 'menu-dots':
      return <svg {...props}><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></svg>;
    case 'switch':
      return <svg {...props}><path d="M4 8h12M14 6l2 2-2 2M20 16H8M10 14l-2 2 2 2"/></svg>;
    default:
      return null;
  }
}
