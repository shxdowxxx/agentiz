import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { initTheme } from './lib/theme';
import { initProxy } from './lib/proxy';
import { getSettings } from './lib/storage';
import BootScreen from './components/BootScreen';
import Navbar from './components/Navbar';
import SettingsPanel from './components/SettingsPanel';
import Home from './pages/Home';
import Login from './pages/Login';

initTheme();

export default function App() {
  const [booted, setBooted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    initProxy();

    const onKey = (e) => {
      const { panicKey, panicDest } = getSettings();
      if (e.key === panicKey && panicDest) {
        e.preventDefault();
        window.location.href = panicDest;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <HashRouter>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <div style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        <Navbar onSettingsOpen={() => setSettingsOpen(true)} />
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
