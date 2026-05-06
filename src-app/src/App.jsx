import { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { initTheme, getTheme, setTheme } from './lib/theme';
import { initProxy } from './lib/proxy';
import { getSettings, clearHistory, saveSetting } from './lib/storage';
import { proxyUrl } from './lib/codec';
import BootScreen from './components/BootScreen';
import Navbar from './components/Navbar';
import SettingsPanel from './components/SettingsPanel';
import GoogleCloak from './components/GoogleCloak';
import CommandPalette from './components/CommandPalette';
import ProxyFrame from './components/ProxyFrame';
import Home from './pages/Home';
import Login from './pages/Login';
import Games from './pages/Games';
import Music from './pages/Music';

const CLOAK_PRESETS = {
  default:   { title: 'Agentiz',         favicon: '/icon.png' },
  google:    { title: 'Google',           favicon: 'https://www.google.com/favicon.ico' },
  gclass:    { title: 'Classes',          favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
  canvas:    { title: 'Dashboard',        favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
  clever:    { title: 'Clever | Portal',  favicon: 'https://clever.com/favicon.ico' },
  blank:     { title: '​',               favicon: 'data:image/svg+xml,%3Csvg xmlns%3D"http%3A//www.w3.org/2000/svg"/%3E' },
};

function applyCloak(id) {
  const p = CLOAK_PRESETS[id] || CLOAK_PRESETS.default;
  document.title = p.title;
  const link = document.querySelector("link[rel~='icon']");
  if (link) link.href = p.favicon;
  localStorage.setItem('agentiz_theme', id);
  saveSetting('cloak', id);
}

initTheme();

export default function App() {
  const [booted, setBooted]             = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [googleCloak, setGoogleCloak]   = useState(false);
  const [cmdOpen, setCmdOpen]           = useState(false);
  const [frameUrl, setFrameUrl]         = useState(null);

  // Global proxy frame opener — any page can fire this event.
  useEffect(() => {
    const handler = (e) => { if (e.detail?.url) setFrameUrl(e.detail.url); };
    window.addEventListener('agentiz:open-frame', handler);
    return () => window.removeEventListener('agentiz:open-frame', handler);
  }, []);

  const openFrame = useCallback((dest) => {
    window.dispatchEvent(new CustomEvent('agentiz:open-frame', { detail: { url: dest } }));
  }, []);

  const handleAction = useCallback(({ type }) => {
    const SITES = {
      'go-classroom': 'https://classroom.google.com',
      'go-docs':      'https://docs.google.com',
      'go-youtube':   'https://youtube.com',
      'go-wikipedia': 'https://en.wikipedia.org',
      'go-reddit':    'https://reddit.com',
      'go-chatgpt':   'https://chat.openai.com',
    };
    if (SITES[type]) { openFrame(proxyUrl(SITES[type])); return; }

    switch (type) {
      case 'cloak-google':    setGoogleCloak(true);  applyCloak('google');  break;
      case 'cloak-classroom': applyCloak('gclass');  break;
      case 'cloak-canvas':    applyCloak('canvas');  break;
      case 'cloak-clever':    applyCloak('clever');  break;
      case 'cloak-blank':     applyCloak('blank');   break;
      case 'cloak-reset':     setGoogleCloak(false); applyCloak('default'); break;
      case 'settings':        setSettingsOpen(true); break;
      case 'toggle-theme': {
        const next = getTheme() === 'light' ? 'dark' : 'light';
        setTheme(next); saveSetting('theme', next);
        break;
      }
      case 'clear-history':   clearHistory(); break;
      case 'panic': {
        const { panicDest } = getSettings();
        if (panicDest) window.location.href = panicDest;
        break;
      }
      default: break;
    }
  }, [openFrame]);

  useEffect(() => {
    initProxy();

    const onKey = (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setGoogleCloak(prev => {
          const next = !prev;
          applyCloak(next ? 'google' : 'default');
          return next;
        });
        return;
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
        return;
      }
      if (!e.ctrlKey && !e.metaKey) {
        const { panicKey, panicDest } = getSettings();
        if (e.key === panicKey && panicDest && !cmdOpen && !settingsOpen) {
          e.preventDefault();
          window.location.href = panicDest;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdOpen, settingsOpen]);

  return (
    <HashRouter>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      <GoogleCloak visible={googleCloak} onHide={() => { setGoogleCloak(false); applyCloak('default'); }} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onAction={handleAction} />

      {/* Global proxy iframe overlay — visible from any route */}
      <ProxyFrame url={frameUrl} onClose={() => setFrameUrl(null)} />

      <div style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <Navbar
          onSettingsOpen={() => setSettingsOpen(true)}
          onCommandPalette={() => setCmdOpen(true)}
        />
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <Routes>
          <Route path="/"      element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/music" element={<Music />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
