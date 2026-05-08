(function () {
  'use strict';

  // ── HTML escape ────────────────────────────────────────────
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── SVG icon system ────────────────────────────────────────
  function mksvg(size, stroke, inner) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }
  const I = {
    logo:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 3v18"/><path d="M4 7.5l16 9"/><path d="M20 7.5l-16 9"/>'),
    home:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-9z"/>'),
    globe:   (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>'),
    spark:   (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="M5.6 5.6l4.2 4.2"/><path d="M14.2 14.2l4.2 4.2"/><path d="M18.4 5.6l-4.2 4.2"/><path d="M9.8 14.2l-4.2 4.2"/>'),
    cube:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l9 5v8l-9 5-9-5V8l9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v10"/>'),
    cog:     (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9z"/>'),
    search:  (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>'),
    chev:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M9 6l6 6-6 6"/>'),
    chevDown:(sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M6 9l6 6 6-6"/>'),
    arrow:   (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>'),
    plus:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 5v14"/><path d="M5 12h14"/>'),
    hist:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/>'),
    shield:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/>'),
    bolt:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>'),
    more:    (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>'),
    check:   (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M5 12l5 5L20 7"/>'),
    x:       (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
    eye:     (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    lock:    (sz=18, sw=1.6) => mksvg(sz,sw,'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    mask:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3c-4 0-9 2-9 7 0 4 3 8 9 8s9-4 9-8c0-5-5-7-9-7z"/><path d="M9 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" fill="currentColor" stroke="none"/><path d="M19 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" fill="currentColor" stroke="none"/>'),
    upload:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 17V5"/><path d="M6 11l6-6 6 6"/><path d="M3 21h18"/>'),
    filter:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>'),
    play:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M7 5v14l12-7L7 5z"/>'),
    download:(sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 5v12"/><path d="M6 13l6 6 6-6"/><path d="M3 21h18"/>'),
  };

  // ── Navigation ─────────────────────────────────────────────
  const NAV = [
    { id:'home',     label:'Home',     icon:'home' },
    { id:'proxy',    label:'Proxy',    icon:'globe' },
    { id:'games',    label:'Games',    icon:'cube' },
    { id:'ai',       label:'Ageniuz',  icon:'spark' },
    { id:'log',      label:'Activity', icon:'hist' },
    { id:'settings', label:'Settings', icon:'cog' },
  ];

  // ── Tab cloak presets ──────────────────────────────────────
  const CLOAK_PRESETS = [
    { id:'gdocs',     label:'Google Docs',      title:'Document1 - Google Docs',  favicon:'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' },
    { id:'khan',      label:'Khan Academy',     title:'Math | Khan Academy',       favicon:'https://cdn.kastatic.org/images/favicon.ico' },
    { id:'classroom', label:'Google Classroom', title:'Stream - Google Classroom', favicon:'https://ssl.gstatic.com/classroom/favicon.png' },
    { id:'schoology', label:'Schoology',        title:'Course Materials',          favicon:'https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico' },
  ];

  // ── Suggested AI prompts (proxy/games relevant) ────────────
  const SUGGESTED_PROMPTS = [
    'What\'s the fastest proxy for school WiFi?',
    'Find me a fun 2-player game I can play right now',
    'How does Ultraviolet proxy work?',
    'What games are trending this week?',
  ];

  // ── Firebase config ────────────────────────────────────────
  const FB_CONFIG = {
    apiKey: 'AIzaSyAqPYNbiv0AA6_9FzRDtDRuTOe07_tYDZc',
    authDomain: 'agentiz-b18ad.firebaseapp.com',
    projectId: 'agentiz-b18ad',
    storageBucket: 'agentiz-b18ad.firebasestorage.app',
    messagingSenderId: '295610165150',
    appId: '1:295610165150:web:71986c4653b49ebbb6988f',
    measurementId: 'G-5290NYRV9B',
  };

  // ── Bare / Railway server ──────────────────────────────────
  const BARE_URL = 'wss://balanced-amazement-production-c715.up.railway.app/';

  // ── State ──────────────────────────────────────────────────
  const S = {
    rail: 'home',
    // Appearance
    appearance: 'dark',
    // Cloak
    cloakOpen: false,
    cloakActive: null,
    // Activity log (starts empty — real events only)
    log: [],
    logFilter: 'All',
    logQuery: '',
    // AI chat
    aiMsgs: [{ from:'ai', text:"Hey — I'm Ageniuz, your proxy and games assistant. Ask me anything, or pick a prompt below." }],
    aiDraft: '',
    aiThinking: false,
    // Settings
    proxyGames: false,
    autoclose: 30,
    stealth: true,
    cloakPreset: 'gdocs',
    decoyTitle: '',
    // Auth
    authUser: null,
    authLoading: true,
    authModal: false,
    authTab: 'signin',
    authEmail: '',
    authPassword: '',
    authErr: '',
    // Proxy browser (inline view)
    proxyReady: false,
    proxyUrl: '',
    proxyInputUrl: '',
    proxyHistory: [],
    proxyHistIdx: -1,
    proxyStatus: 'idle',
    proxyStatusText: 'Enter a URL to browse',
    proxyFrameLoaded: false,
    // Lumin games
    luminInst: null,
    luminGames: [],
    luminThumb: {},
    luminLoaded: false,
    luminLoading: false,
    luminPage: 1,
    luminPages: 1,
    luminQuery: '',
    luminSearch: '',
    // Misc
    modal: null,
    _toastTimer: null,
    _countAnim: null,
  };

  // ── Log event system ───────────────────────────────────────
  function logEvent(kind, lvl, text) {
    const t = new Date().toLocaleTimeString('en-US', { hour12: false });
    S.log.unshift({ t, kind, lvl, text });
    // Cap log at 200 entries
    if (S.log.length > 200) S.log.length = 200;
    // If log view is open, refresh it
    if (S.rail === 'log') renderLogStream();
  }

  function renderLogStream() {
    const stream = document.querySelector('.log-stream');
    if (!stream) return;
    const kindMap = { Sessions:'proxy', Games:'game', Auth:'auth', System:'system' };
    const visible = S.log.filter(e => {
      if (S.logFilter !== 'All' && e.kind !== kindMap[S.logFilter]) return false;
      if (S.logQuery.trim() && !`${e.kind} ${e.text}`.toLowerCase().includes(S.logQuery.toLowerCase())) return false;
      return true;
    });
    if (visible.length === 0) {
      stream.innerHTML = `<div class="log-empty">
        <div class="log-empty-icon">${I.hist(32, 1.2)}</div>
        <div>No activity yet</div>
        <div style="font-size:12px;color:var(--text-3);margin-top:4px">Events appear here as you use the proxy and games</div>
      </div>`;
    } else {
      stream.innerHTML = visible.map(e => `
        <div class="log-entry lvl-${esc(e.lvl)}">
          <div class="log-time">${esc(e.t)}</div>
          <div class="log-kind">${esc(e.kind)}</div>
          <div class="log-actor"></div>
          <div class="log-text">${esc(e.text)}</div>
          <button class="log-more">${I.more(14)}</button>
        </div>`).join('');
    }
  }

  // ── Theme ──────────────────────────────────────────────────
  function isDark() {
    if (S.appearance === 'dark') return true;
    if (S.appearance === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme() {
    document.body.classList.toggle('light', !isDark());
  }

  // ── Tab cloak ──────────────────────────────────────────────
  function applyCloak(preset) {
    document.title = preset.title;
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = preset.favicon;
    S.cloakActive = preset;
    S.cloakOpen = false;
    renderCloakBtn();
    showToast('Tab disguised as ' + preset.label);
  }
  function clearCloak() {
    document.title = 'Agentiz';
    const link = document.querySelector("link[rel='icon']");
    if (link) link.href = '/favicon.ico';
    S.cloakActive = null;
    S.cloakOpen = false;
    renderCloakBtn();
    showToast('Cloak removed');
  }
  function renderCloakBtn() {
    const wrap = document.querySelector('.cloak-wrap');
    if (!wrap) return;
    const cloaked = !!S.cloakActive;
    wrap.innerHTML = `
      <button class="cloak-btn ${cloaked ? 'cloaked' : ''}" data-action="cloak-toggle">
        ${I.mask(14)} ${cloaked ? esc(S.cloakActive.label) : 'Disguise'}
      </button>
      <div class="cloak-dropdown ${S.cloakOpen ? 'open' : ''}">
        <div class="cloak-dropdown-head">Tab disguise</div>
        ${CLOAK_PRESETS.map(p => `
          <button class="cloak-option ${S.cloakActive && S.cloakActive.id === p.id ? 'active' : ''}"
            data-action="cloak-apply" data-id="${p.id}">
            ${esc(p.label)}
          </button>`).join('')}
        ${cloaked ? `<button class="cloak-clear" data-action="cloak-clear">Remove disguise</button>` : ''}
      </div>`;
  }

  // ── Firebase ───────────────────────────────────────────────
  function initFirebase() {
    if (!window.firebase) return;
    firebase.initializeApp(FB_CONFIG);

    firebase.auth().onAuthStateChanged(user => {
      S.authUser = user;
      S.authLoading = false;
      if (user) {
        firebase.firestore().collection('users').doc(user.uid).set({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }).catch(() => {});
        loadUserSettings(user.uid);
        logEvent('auth', 'ok', 'Signed in as ' + (user.email || user.displayName || 'user'));
      }
      render();
      renderSidebar();
    });
  }

  function loadUserSettings(uid) {
    firebase.firestore().collection('users').doc(uid).get().then(doc => {
      if (!doc.exists) return;
      const cfg = doc.data().settings || {};
      if (cfg.appearance) { S.appearance = cfg.appearance; applyTheme(); }
      if (cfg.proxyGames !== undefined) S.proxyGames = cfg.proxyGames;
      if (cfg.stealth !== undefined)    S.stealth = cfg.stealth;
      if (cfg.autoclose)                S.autoclose = cfg.autoclose;
      renderSidebar();
    }).catch(() => {});
  }

  function saveUserSettings() {
    if (!S.authUser || !window.firebase) return;
    firebase.firestore().collection('users').doc(S.authUser.uid).set({
      settings: {
        appearance: S.appearance,
        proxyGames: S.proxyGames,
        stealth: S.stealth,
        autoclose: S.autoclose,
      }
    }, { merge: true }).catch(() => {});
  }

  function authWithGoogle() {
    if (!window.firebase) return;
    S.authErr = '';
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(() => { S.authModal = false; render(); })
      .catch(e => { S.authErr = e.message; renderAuthModal(); });
  }

  function authWithEmail(isSignUp) {
    if (!window.firebase) return;
    S.authErr = '';
    const email = S.authEmail.trim();
    const pass  = S.authPassword;
    if (!email || !pass) { S.authErr = 'Email and password are required.'; renderAuthModal(); return; }
    const fn = isSignUp
      ? firebase.auth().createUserWithEmailAndPassword(email, pass)
      : firebase.auth().signInWithEmailAndPassword(email, pass);
    fn.then(() => { S.authModal = false; S.authEmail = ''; S.authPassword = ''; render(); })
      .catch(e => { S.authErr = e.message; renderAuthModal(); });
  }

  function authSignOut() {
    if (!window.firebase) return;
    firebase.auth().signOut().then(() => {
      S.authUser = null;
      render();
      renderSidebar();
    });
  }

  // ── Lumin games ────────────────────────────────────────────
  async function initLumin() {
    if (!window.Lumin) return;
    try {
      S.luminInst = new Lumin();
      await new Promise((resolve, reject) => {
        S.luminInst.init({
          headless: true,
          onReady: resolve,
          onError: reject,
        });
      });
      await loadLuminGames(1, '');
    } catch (e) {
      console.warn('[Agentiz] Lumin init failed:', e);
    }
  }

  async function loadLuminGames(page, q) {
    if (!S.luminInst) return;
    S.luminLoading = true;
    if (S.rail === 'home' || S.rail === 'games') render();
    try {
      const { games, pages } = await S.luminInst.getGames({ page, limit: 80, q: q || '' });
      S.luminGames = games || [];
      S.luminPages = pages || 1;
      S.luminPage = page;
      S.luminQuery = q || '';
      S.luminLoaded = true;
      // Load first batch of thumbnails in the background
      loadLuminThumbs(S.luminGames.slice(0, 24));
    } catch (e) {
      console.warn('[Agentiz] Lumin getGames failed:', e);
    } finally {
      S.luminLoading = false;
      if (S.rail === 'home' || S.rail === 'games') render();
    }
  }

  async function loadLuminThumbs(games) {
    if (!S.luminInst) return;
    await Promise.allSettled(games.map(async g => {
      if (S.luminThumb[g.id]) return;
      try {
        S.luminThumb[g.id] = await S.luminInst.getImageUrl(g.image_token);
      } catch (_) {}
    }));
    if (S.rail === 'home' || S.rail === 'games') render();
  }

  async function launchGame(id, name) {
    if (!S.luminInst) { showToast('Game engine not ready'); return; }
    try {
      showToast('Loading ' + (name || 'game') + '…');
      const { url } = await S.luminInst.getGameUrl(id);
      logEvent('game', 'ok', 'Launched ' + (name || id));
      openProxyFrame(url, { direct: !S.proxyGames });
    } catch (e) {
      showToast('Could not load game');
    }
  }

  // ── Proxy engine ───────────────────────────────────────────
  async function initProxy() {
    if (!('serviceWorker' in navigator)) {
      S.proxyStatusText = 'Service workers not supported';
      logEvent('system', 'warn', 'Proxy unavailable — service workers not supported');
      return;
    }
    try {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      const { BareMuxConnection } = await import(
        'https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@2.1.9/dist/index.mjs'
      );
      const conn = new BareMuxConnection(
        'https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@2.1.9/dist/worker.js'
      );
      await conn.setTransport(
        'https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport@3.0.1/dist/index.mjs',
        [BARE_URL]
      );

      S.proxyReady = true;
      S.proxyStatusText = 'Proxy ready — enter a URL above';
      logEvent('system', 'ok', 'Proxy engine ready (Ultraviolet v3)');
      // If proxy view is open, update status bar
      if (S.rail === 'proxy') updateProxyStatusBar('idle', S.proxyStatusText);
    } catch (e) {
      console.warn('[Agentiz] Proxy init failed:', e.message);
      S.proxyStatusText = 'Proxy unavailable — games still load directly';
      logEvent('system', 'warn', 'Proxy unavailable — games still load directly');
    }
  }

  function proxyEncode(rawUrl) {
    if (!window.__uv$config) return rawUrl;
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }
    return window.__uv$config.prefix + window.__uv$config.encodeUrl(rawUrl);
  }

  function normalizeUrl(rawUrl) {
    if (!rawUrl) return '';
    rawUrl = rawUrl.trim();
    if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }
    return rawUrl;
  }

  // Navigate the inline proxy iframe (proxy view)
  function openProxyFrame(rawUrl, opts = {}) {
    rawUrl = normalizeUrl(rawUrl);
    if (!rawUrl) return;

    S.proxyHistory = S.proxyHistory.slice(0, S.proxyHistIdx + 1);
    S.proxyHistory.push(rawUrl);
    S.proxyHistIdx = S.proxyHistory.length - 1;
    S.proxyUrl = rawUrl;
    S.proxyInputUrl = rawUrl;
    S.proxyStatus = 'loading';
    S.proxyStatusText = 'Connecting…';

    // Switch to proxy view if not already there
    if (S.rail !== 'proxy') {
      S.rail = 'proxy';
      render();
      setTimeout(() => navigateProxyIframe(rawUrl, opts), 80);
    } else {
      navigateProxyIframe(rawUrl, opts);
      updateProxyChrome();
    }
  }

  function navigateProxyIframe(rawUrl, opts = {}) {
    const iframe = document.getElementById('proxy-iframe');
    if (!iframe) return;
    const direct = opts.direct || !S.proxyReady;
    iframe.src = direct ? rawUrl : proxyEncode(rawUrl);
    S.proxyStatus = 'loading';
    S.proxyStatusText = direct ? 'Loading directly…' : 'Routing through Ultraviolet…';
    updateProxyStatusBar('loading', S.proxyStatusText);
  }

  function proxyGo(rawUrl) {
    rawUrl = normalizeUrl(rawUrl);
    if (!rawUrl) return;
    logEvent('proxy', 'ok', 'Opened proxy for ' + rawUrl);
    openProxyFrame(rawUrl);
  }

  function proxyBack() {
    if (S.proxyHistIdx > 0) {
      S.proxyHistIdx--;
      S.proxyUrl = S.proxyHistory[S.proxyHistIdx];
      S.proxyInputUrl = S.proxyUrl;
      navigateProxyIframe(S.proxyUrl);
      updateProxyChrome();
    }
  }

  function proxyForward() {
    if (S.proxyHistIdx < S.proxyHistory.length - 1) {
      S.proxyHistIdx++;
      S.proxyUrl = S.proxyHistory[S.proxyHistIdx];
      S.proxyInputUrl = S.proxyUrl;
      navigateProxyIframe(S.proxyUrl);
      updateProxyChrome();
    }
  }

  function updateProxyChrome() {
    const urlInput = document.getElementById('proxy-url-input');
    if (urlInput) urlInput.value = S.proxyUrl;
    const backBtn = document.getElementById('proxy-back');
    const fwdBtn  = document.getElementById('proxy-forward');
    if (backBtn) backBtn.disabled = S.proxyHistIdx <= 0;
    if (fwdBtn)  fwdBtn.disabled  = S.proxyHistIdx >= S.proxyHistory.length - 1;
  }

  function updateProxyStatusBar(status, text) {
    S.proxyStatus = status;
    S.proxyStatusText = text;
    const dot  = document.querySelector('.proxy-status-dot');
    const span = document.querySelector('.proxy-status-text');
    if (dot) { dot.className = 'proxy-status-dot ' + (status === 'ok' ? 'ok' : status === 'loading' ? 'loading' : status === 'err' ? 'err' : ''); }
    if (span) span.textContent = text;
  }

  // ── Toast ──────────────────────────────────────────────────
  function showToast(msg) {
    clearTimeout(S._toastTimer);
    let el = document.getElementById('toast-el');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-el';
      document.body.appendChild(el);
    }
    el.className = 'toast';
    el.innerHTML = I.check(14) + ' ' + esc(msg);
    S._toastTimer = setTimeout(() => el.remove(), 2400);
  }

  // ── Modal ──────────────────────────────────────────────────
  function openModal(title, body, action, onConfirm) {
    S.modal = { title, body, action, onConfirm };
    renderModal();
  }
  function closeModal() {
    S.modal = null;
    const el = document.getElementById('modal-el');
    if (el) el.remove();
  }
  function renderModal() {
    let el = document.getElementById('modal-el');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-el';
      document.body.appendChild(el);
    }
    if (!S.modal) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div class="modal-backdrop" data-action="modal-close">
        <div class="modal" onclick="event.stopPropagation()">
          <h2>${esc(S.modal.title)}</h2>
          <p>${esc(S.modal.body)}</p>
          <div class="modal-actions">
            <button class="btn" data-action="modal-close">Cancel</button>
            <button class="btn btn-primary" data-action="modal-confirm">
              ${esc(S.modal.action)}
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── Rail ───────────────────────────────────────────────────
  function renderRail() {
    const rail = document.getElementById('rail');
    if (!rail) return;
    rail.innerHTML = `
      <div class="rail-logo">${I.logo(22, 1.4)}</div>
      <div class="rail-divider"></div>
      ${NAV.map(n => `
        <button class="rail-btn ${S.rail === n.id ? 'active' : ''}" data-action="rail" data-val="${n.id}" title="${esc(n.label)}" aria-label="${esc(n.label)}">
          ${I[n.icon](18)}
        </button>`).join('')}
      <div class="rail-spacer"></div>`;
  }

  // ── Sidebar ────────────────────────────────────────────────
  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const recentHistory = S.log.slice(0, 5).map(e => `
      <div class="history-item">
        <span class="h-label">${esc(e.text)}</span>
        <span class="h-time">${esc(e.t)}</span>
      </div>`).join('') || `<div class="history-item" style="color:var(--text-3);font-size:12px;padding:8px 9px">No activity yet</div>`;

    const userBlock = S.authUser
      ? `<div class="sidebar-user">
          ${S.authUser.photoURL
            ? `<img class="sidebar-avatar" src="${esc(S.authUser.photoURL)}" referrerpolicy="no-referrer" alt="">`
            : `<div class="sidebar-avatar">${esc((S.authUser.displayName || S.authUser.email || '?')[0].toUpperCase())}</div>`}
          <div class="sidebar-user-meta">
            <div class="sidebar-user-name">${esc(S.authUser.displayName || 'Operator')}</div>
            <div class="sidebar-user-email">${esc(S.authUser.email || '')}</div>
          </div>
          <button class="sidebar-signout" data-action="auth-signout" title="Sign out">${I.x(14)}</button>
        </div>`
      : `<button class="sidebar-signin-btn" data-action="auth-open">
          ${I.lock(14)} Sign in to sync settings
        </button>`;

    sidebar.innerHTML = `
      <div class="sidebar-top">
        ${userBlock}
        <div class="sidebar-search">
          ${I.search(13)}
          <input id="sidebar-search" placeholder="Search…" autocomplete="off">
        </div>
      </div>
      <div class="sidebar-body">
        <div class="sidebar-section-label">Navigate</div>
        <nav>
          ${NAV.map(n => `
            <div class="nav-item ${S.rail === n.id ? 'active' : ''}" data-action="rail" data-val="${n.id}">
              <span class="nav-ico">${I[n.icon](16)}</span>
              <span class="nav-label">${esc(n.label)}</span>
            </div>`).join('')}
        </nav>
        <div class="sidebar-section-label" style="margin-top:4px">Recent Activity</div>
        <div class="sidebar-history">${recentHistory}</div>
      </div>`;
  }

  // ── View: Home ─────────────────────────────────────────────
  function viewHome() {
    // Build quick-play strip (8 games)
    let stripHtml = '';
    if (S.luminLoading && !S.luminLoaded) {
      stripHtml = Array(8).fill(0).map(() => `
        <div class="game-card loading">
          <div class="game-card-thumb"></div>
          <div class="game-card-body">
            <div class="game-card-name"> </div>
            <div class="game-card-meta"> </div>
          </div>
        </div>`).join('');
    } else if (S.luminLoaded && S.luminGames.length) {
      stripHtml = S.luminGames.slice(0, 8).map(g => {
        const thumb = S.luminThumb[g.id];
        return `<button class="game-card" data-action="play-lumin" data-id="${esc(g.id)}" data-name="${esc(g.name)}">
          <div class="game-card-thumb${thumb ? ' has-img' : ''}" ${thumb ? `style="background-image:url('${thumb}')"` : ''}>
            ${thumb ? '' : `<span class="game-glyph">&#9638;</span>`}
          </div>
          <div class="game-card-body">
            <div class="game-card-name">${esc(g.name)}</div>
            <div class="game-card-meta">${esc(g.category || 'game')}</div>
          </div>
        </button>`;
      }).join('');
    } else {
      stripHtml = `<div style="color:var(--text-3);font-size:13px;padding:20px 0;grid-column:1/-1">Loading games…</div>`;
    }

    const signinPrompt = !S.authUser && !S.authLoading ? `
      <div class="home-signin-prompt">
        <span style="color:var(--text-3);display:flex;flex-shrink:0">${I.lock(18)}</span>
        <div class="home-signin-prompt-text">
          <strong>Sign in</strong> to sync your settings and activity across devices
        </div>
        <button class="btn btn-primary" data-action="auth-open">Sign in</button>
      </div>` : '';

    return `<main class="main">
      <div class="topbar">
        <span class="topbar-title">Agentiz</span>
        <div class="cloak-wrap"></div>
      </div>
      <div class="page-body home-body">

        <!-- Proxy bar -->
        <div class="proxy-bar-wrap">
          <div class="proxy-bar-label">Proxy</div>
          <div class="proxy-bar">
            <span class="proxy-bar-lock">${I.lock(15, 1.4)}</span>
            <input id="home-proxy-input" type="url" placeholder="Enter a URL to browse anonymously…" autocomplete="off" spellcheck="false">
            <button class="proxy-bar-go" data-action="home-proxy-go">Go</button>
          </div>
          <div class="proxy-bar-sub">Routed through Ultraviolet · anonymous</div>
        </div>

        <!-- Quick play -->
        <div>
          <div class="home-section-h">
            <div class="home-section-title">Quick Play${S.luminLoading ? '<span style="font-size:11px;font-weight:400;color:var(--text-3);margin-left:8px">Loading…</span>' : ''}</div>
            <button class="home-section-action" data-action="rail" data-val="games">
              See all ${I.arrow(12)}
            </button>
          </div>
          <div class="quick-strip">${stripHtml}</div>
        </div>

        ${signinPrompt}

      </div>
    </main>`;
  }

  // ── View: Proxy ────────────────────────────────────────────
  function viewProxy() {
    const canBack    = S.proxyHistIdx > 0;
    const canForward = S.proxyHistIdx < S.proxyHistory.length - 1;
    const dotCls     = S.proxyStatus === 'ok' ? 'ok' : S.proxyStatus === 'loading' ? 'loading' : S.proxyStatus === 'err' ? 'err' : '';

    return `<main class="main proxy-view-body">
      <div class="proxy-chrome">
        <button id="proxy-back" class="proxy-nav-btn" ${canBack ? '' : 'disabled'} data-action="proxy-back" title="Back">
          ${I.chev(16, 2)}
        </button>
        <button id="proxy-forward" class="proxy-nav-btn" ${canForward ? '' : 'disabled'} data-action="proxy-forward" title="Forward" style="transform:scaleX(-1)">
          ${I.chev(16, 2)}
        </button>
        <button class="proxy-nav-btn" data-action="proxy-refresh" title="Refresh">
          ${I.hist(16)}
        </button>
        <div class="proxy-urlbar">
          <span class="proxy-urlbar-lock">${I.lock(13, 1.4)}</span>
          <input id="proxy-url-input" value="${esc(S.proxyUrl)}" placeholder="Enter a URL or search…" spellcheck="false" autocomplete="off">
          <button class="proxy-urlbar-go" data-action="proxy-go">Go</button>
        </div>
        <div class="cloak-wrap" style="flex-shrink:0"></div>
      </div>

      <div class="proxy-frame-wrap">
        ${S.proxyUrl
          ? `<iframe id="proxy-iframe" referrerpolicy="no-referrer" allow="autoplay; fullscreen; gamepad; pointer-lock; clipboard-read; clipboard-write" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-scripts allow-same-origin allow-downloads"></iframe>`
          : `<div class="proxy-empty">
              <div class="proxy-empty-icon">${I.globe(40, 1.2)}</div>
              <div class="proxy-empty-h">Enter a URL to browse</div>
              <div class="proxy-empty-sub">${esc(S.proxyStatusText)}</div>
            </div>`}
      </div>

      <div class="proxy-status-bar">
        <span class="proxy-status-dot ${dotCls}"></span>
        <span class="proxy-status-text">${esc(S.proxyStatusText)}</span>
        ${S.proxyReady ? `<span style="margin-left:auto;opacity:0.5">Ultraviolet v3 · Railway</span>` : ''}
      </div>
    </main>`;
  }

  // ── View: Games ─────────────────────────────────────────────
  function viewGames() {
    let gridHtml = '';
    if (S.luminLoading && !S.luminLoaded) {
      gridHtml = Array(20).fill(0).map(() => `
        <div class="game-grid-card" style="pointer-events:none">
          <div class="game-grid-thumb" style="animation:shimmer 1.4s infinite;background:var(--bg-3)"></div>
          <div class="game-grid-info">
            <div class="game-grid-name" style="height:13px;background:var(--bg-3);animation:shimmer 1.4s infinite;border-radius:4px;width:70%"></div>
            <div class="game-grid-cat" style="height:10px;background:var(--bg-3);animation:shimmer 1.4s infinite;border-radius:4px;width:45%;margin-top:6px"></div>
          </div>
        </div>`).join('');
    } else if (S.luminLoaded && S.luminGames.length) {
      gridHtml = S.luminGames.map(g => {
        const thumb = S.luminThumb[g.id];
        return `<button class="game-grid-card" data-action="play-lumin" data-id="${esc(g.id)}" data-name="${esc(g.name)}">
          <div class="game-grid-thumb${thumb ? ' has-img' : ''}" ${thumb ? `style="background-image:url('${thumb}')"` : ''}>
            ${thumb ? '' : `<span class="game-glyph">&#9638;</span>`}
          </div>
          <div class="game-grid-info">
            <div class="game-grid-name">${esc(g.name)}</div>
            <div class="game-grid-cat">${esc(g.category || 'game')}</div>
          </div>
        </button>`;
      }).join('');
    } else {
      gridHtml = `<div style="grid-column:1/-1;color:var(--text-3);text-align:center;padding:40px">No games found</div>`;
    }

    const pageBar = S.luminLoaded && S.luminPages > 1 ? `
      <div class="games-pagination">
        <button class="page-btn" ${S.luminPage <= 1 ? 'disabled' : ''} data-action="lumin-page" data-val="${S.luminPage - 1}">Prev</button>
        <span class="page-info">${S.luminPage} / ${S.luminPages}</span>
        <button class="page-btn" ${S.luminPage >= S.luminPages ? 'disabled' : ''} data-action="lumin-page" data-val="${S.luminPage + 1}">Next</button>
      </div>` : '';

    return `<main class="main" style="overflow:hidden;display:flex;flex-direction:column">
      <div class="topbar">
        <span class="topbar-title">Games</span>
        <div class="cloak-wrap" style="margin-left:auto"></div>
      </div>
      <div class="games-toolbar">
        <div class="games-search">
          ${I.search(14)}
          <input id="games-search-inp" placeholder="Search games…" value="${esc(S.luminSearch)}" autocomplete="off">
        </div>
        <span class="games-count">${S.luminLoaded ? S.luminGames.length + ' games' : 'Loading…'}</span>
      </div>
      <div style="flex:1;overflow-y:auto">
        <div class="game-grid">${gridHtml}</div>
        ${pageBar}
      </div>
    </main>`;
  }

  // ── View: Ageniuz AI ────────────────────────────────────────
  function viewAgeniuz() {
    const showSuggests = S.aiMsgs.length <= 1 && !S.aiThinking;

    const msgHtml = S.aiMsgs.map(m => {
      if (m.from === 'ai') {
        return `<div class="ageniuz-row ai">
          <div class="ageniuz-avatar">${I.spark(14)}</div>
          <div class="ageniuz-bubble ai">
            <div class="ageniuz-bubble-name">Ageniuz</div>
            <div>${esc(m.text)}</div>
          </div>
        </div>`;
      }
      return `<div class="ageniuz-row me">
        <div class="ageniuz-bubble me"><div>${esc(m.text)}</div></div>
      </div>`;
    }).join('');

    const thinkHtml = S.aiThinking ? `
      <div class="ageniuz-row ai">
        <div class="ageniuz-avatar">${I.spark(14)}</div>
        <div class="ageniuz-bubble ai">
          <div class="ageniuz-bubble-name">Ageniuz</div>
          <div class="ageniuz-typing"><span></span><span></span><span></span></div>
        </div>
      </div>` : '';

    const suggestHtml = showSuggests ? `
      <div class="ageniuz-suggests">
        <div class="ageniuz-suggests-h">Try asking</div>
        <div class="ageniuz-chips">
          ${SUGGESTED_PROMPTS.map(p => `
            <button class="ageniuz-chip" data-action="ai-suggest" data-val="${esc(p)}">
              ${I.arrow(12)} ${esc(p)}
            </button>`).join('')}
        </div>
      </div>` : '';

    return `<main class="main" style="overflow:hidden;display:flex;flex-direction:column">
      <div class="topbar">
        <span class="topbar-title">Ageniuz <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-3);letter-spacing:0.1em;margin-left:6px">v1.4 · BETA</span></span>
        <div class="cloak-wrap" style="margin-left:auto"></div>
      </div>
      <div class="ageniuz-stream" id="ai-stream">${msgHtml}${thinkHtml}</div>
      ${suggestHtml}
      <form class="ageniuz-compose" id="ai-form">
        <span class="ageniuz-compose-icon">${I.spark(14)}</span>
        <input id="ai-draft" value="${esc(S.aiDraft)}" placeholder="Ask Ageniuz anything…" autocomplete="off">
        <button type="submit" class="btn btn-primary" ${!S.aiDraft.trim() ? 'disabled' : ''}>
          ${I.arrow(14)} Send
        </button>
      </form>
    </main>`;
  }

  // ── View: Activity Log ─────────────────────────────────────
  function viewLog() {
    const filters = ['All', 'Sessions', 'Games', 'Auth', 'System'];
    return `<main class="main" style="overflow:hidden;display:flex;flex-direction:column">
      <div class="topbar">
        <span class="topbar-title">Activity Log</span>
        <button class="btn" data-action="log-clear" style="margin-left:auto">${I.x(14)} Clear</button>
      </div>
      <div class="log-toolbar">
        <div class="log-search">
          ${I.search(13)}
          <input id="log-query" value="${esc(S.logQuery)}" placeholder="Search events…">
        </div>
        <div class="log-filters">
          ${filters.map(f => `<button class="log-filter ${S.logFilter === f ? 'active' : ''}" data-action="log-filter" data-val="${f}">${f}</button>`).join('')}
        </div>
      </div>
      <div class="log-stream"></div>
    </main>`;
  }

  // ── View: Settings ─────────────────────────────────────────
  function viewSettings() {
    const selectedPreset = CLOAK_PRESETS.find(p => p.id === S.cloakPreset) || CLOAK_PRESETS[0];
    return `<main class="main" style="overflow:hidden;display:flex;flex-direction:column">
      <div class="topbar">
        <span class="topbar-title">Settings</span>
      </div>
      <div class="settings-scroll">

        <section class="settings-section">
          <div class="settings-section-h">Appearance</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Theme</div>
              <div class="settings-row-d">Dark mode is default. Switch to light or let the system decide.</div>
            </div>
            <div class="settings-segment">
              ${['dark','light','auto'].map(m => `<button class="${S.appearance === m ? 'active' : ''}" data-action="set-appearance" data-val="${m}">${m}</button>`).join('')}
            </div>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">Games</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Proxy games <span class="settings-badge">Beta</span></div>
              <div class="settings-row-d">Route game traffic through Ultraviolet when games are blocked on your network. Direct is faster — only enable if needed.</div>
            </div>
            <div class="toggle ${S.proxyGames ? 'on' : ''}" data-action="toggle-proxy-games"></div>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">Tab Disguise</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Quick disguise</div>
              <div class="settings-row-d">Instantly change the page title and favicon to look like a school tool. Use the disguise button in the topbar.</div>
            </div>
          </div>
          <div class="settings-cloak-grid">
            ${CLOAK_PRESETS.map(p => `
              <button class="cloak-preset-btn ${S.cloakPreset === p.id ? 'active' : ''}" data-action="set-cloak-preset" data-id="${p.id}">
                <span class="cloak-preset-label">${esc(p.label)}</span>
                <span class="cloak-preset-title">${esc(p.title.substring(0, 30))}…</span>
              </button>`).join('')}
          </div>
          <div class="settings-decoy-input">
            <label>Custom title</label>
            <input id="decoy-title-input" value="${esc(S.decoyTitle)}" placeholder="Leave blank to use preset title">
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">Proxy</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Auto-close idle sessions</div>
              <div class="settings-row-d">Close the proxy after this many minutes of inactivity.</div>
            </div>
            <div class="settings-stepper">
              <button data-action="ac-dec">−</button>
              <span id="ac-val">${S.autoclose} min</span>
              <button data-action="ac-inc">+</button>
            </div>
          </div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Panic key</div>
              <div class="settings-row-d">Press <kbd>Escape</kbd> to instantly close the proxy and return to Home.</div>
            </div>
            <span class="settings-kbd">Esc</span>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">About</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Agentiz <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-3);margin-left:6px">v3.0 · 2026</span></div>
              <div class="settings-row-d">
                Director: ItzzzShxdow &nbsp;·&nbsp; Developer: Claude / TheSizCorporation<br>
                Game Catalog: Lumin SDK &nbsp;·&nbsp; Proxy: Ultraviolet v3 / TitaniumNetwork<br>
                Bare Server: Mercury Workshop / Railway
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>`;
  }

  // ── Auth modal ─────────────────────────────────────────────
  function renderAuthModal() {
    let el = document.getElementById('auth-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auth-overlay';
      document.getElementById('app').appendChild(el);
    }
    if (!S.authModal) { el.innerHTML = ''; return; }

    const isSignUp = S.authTab === 'signup';
    el.innerHTML = `
      <div class="auth-backdrop" data-action="auth-close">
        <div class="auth-card" onclick="event.stopPropagation()">
          <button class="auth-close" data-action="auth-close">${I.x(14)}</button>
          <div class="auth-eyebrow"><span class="dot"></span> Agentiz</div>
          <h2 class="auth-title">Sign in</h2>
          <p class="auth-body">Sync your settings and activity across devices.</p>

          <button class="auth-google-btn" data-action="auth-google">
            <svg class="auth-google-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div class="auth-divider">or</div>

          <div class="auth-tabs">
            <div class="auth-tab ${S.authTab === 'signin' ? 'active' : ''}" data-action="auth-tab" data-val="signin">Sign in</div>
            <div class="auth-tab ${S.authTab === 'signup' ? 'active' : ''}" data-action="auth-tab" data-val="signup">Create account</div>
          </div>

          <div id="auth-form">
            <div class="auth-field">
              <label>Email</label>
              <input id="auth-email" type="email" placeholder="you@example.com" value="${esc(S.authEmail)}" autocomplete="email">
            </div>
            <div class="auth-field">
              <label>Password</label>
              <input id="auth-pass" type="password" placeholder="••••••••" autocomplete="${isSignUp ? 'new-password' : 'current-password'}">
            </div>
            ${S.authErr ? `<div class="auth-err">${esc(S.authErr)}</div>` : ''}
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px;margin-top:4px" data-action="auth-submit">
              ${isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div class="auth-foot">${I.shield(12)} No ads · no telemetry</div>
        </div>
      </div>`;
  }

  // ── AI reply logic ─────────────────────────────────────────
  function aiReply(q) {
    const lower = q.toLowerCase();
    if (lower.includes('proxy') || lower.includes('wifi') || lower.includes('ultraviolet'))
      return 'Ultraviolet v3 is the only proxy running here, routed through a Railway bare server. It\'s solid for most school networks — enter any URL in the Proxy tab or the home bar and it\'ll handle the routing for you.';
    if (lower.includes('game') || lower.includes('play') || lower.includes('fun'))
      return 'Games are loaded from the Lumin SDK catalog — scroll the Games tab to see what\'s available. Click any card to launch it instantly. If a game is blocked on your network, enable "Proxy games" in Settings to route it through Ultraviolet.';
    if (lower.includes('block') || lower.includes('filter') || lower.includes('school'))
      return 'If something is blocked, try the proxy — enter the URL in the home bar or the Proxy tab. Ultraviolet v3 wraps requests through the Railway server so your school network sees normal HTTPS traffic. If the whole site is completely blocked, the proxy won\'t always help since DNS-level blocks happen before the request even leaves your browser.';
    if (lower.includes('cloak') || lower.includes('disguise') || lower.includes('teacher'))
      return 'Use the Disguise button in the top bar (it looks like a mask icon). You can make the tab look like Google Docs, Khan Academy, Google Classroom, or Schoology. It changes the title and favicon instantly. Press Escape to close the proxy if you need a quick exit.';
    if (lower.includes('setting') || lower.includes('dark') || lower.includes('theme'))
      return 'Settings are in the Settings tab (gear icon in the sidebar). You can switch themes, toggle proxy games, set auto-close timing, and configure which disguise preset to use.';
    return 'Got it — I can help with proxies, games, settings, and how things work in Agentiz. Try asking something specific and I\'ll do my best to help.';
  }

  function sendAiMessage(text) {
    const q = (text !== undefined ? text : S.aiDraft).trim();
    if (!q || S.aiThinking) return;
    S.aiMsgs.push({ from:'me', text: q });
    S.aiDraft = '';
    S.aiThinking = true;
    render();
    setTimeout(() => {
      S.aiThinking = false;
      S.aiMsgs.push({ from:'ai', text: aiReply(q) });
      render();
    }, 900 + Math.random() * 400);
  }

  // ── Main render ────────────────────────────────────────────
  function render() {
    renderRail();
    renderSidebar();

    const view = document.getElementById('view');
    let html = '';

    switch (S.rail) {
      case 'home':     html = viewHome(); break;
      case 'proxy':    html = viewProxy(); break;
      case 'games':    html = viewGames(); break;
      case 'ai':       html = viewAgeniuz(); break;
      case 'log':      html = viewLog(); break;
      case 'settings': html = viewSettings(); break;
      default:         html = viewHome();
    }

    view.innerHTML = html;
    renderAuthModal();
    afterRender();
  }

  // ── Post-render ────────────────────────────────────────────
  function afterRender() {
    // Mount cloak button wherever .cloak-wrap exists
    document.querySelectorAll('.cloak-wrap').forEach(w => {
      renderCloakBtn();
    });
    renderCloakBtn(); // ensure all are populated

    // Wire proxy iframe events after render
    if (S.rail === 'proxy' && S.proxyUrl) {
      const iframe = document.getElementById('proxy-iframe');
      if (iframe) {
        iframe.addEventListener('load', () => {
          updateProxyStatusBar('ok', S.proxyReady ? 'Proxied via Ultraviolet · Railway' : 'Direct connection');
          updateProxyChrome();
        });
        iframe.addEventListener('error', () => {
          updateProxyStatusBar('err', 'Failed to load page');
        });
        // Navigate on first render
        setTimeout(() => navigateProxyIframe(S.proxyUrl), 60);
      }
    }

    // Scroll AI stream to bottom
    if (S.rail === 'ai') {
      const stream = document.getElementById('ai-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }

    // Re-render log stream entries
    if (S.rail === 'log') {
      renderLogStream();
    }
  }

  // ── Event delegation ───────────────────────────────────────
  document.addEventListener('click', (e) => {
    // Close cloak dropdown when clicking outside
    if (!e.target.closest('.cloak-wrap')) {
      S.cloakOpen = false;
      document.querySelectorAll('.cloak-dropdown').forEach(d => d.classList.remove('open'));
    }

    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const val    = btn.dataset.val;

    switch (action) {

      // Navigation
      case 'rail':
        S.rail = val;
        render();
        break;

      // Home proxy bar — go button
      case 'home-proxy-go': {
        const inp = document.getElementById('home-proxy-input');
        const url = inp ? inp.value.trim() : '';
        if (url) proxyGo(url);
        break;
      }

      // Proxy view nav
      case 'proxy-back':    proxyBack(); break;
      case 'proxy-forward': proxyForward(); break;

      case 'proxy-refresh': {
        const iframe = document.getElementById('proxy-iframe');
        if (iframe && iframe.src) { const s = iframe.src; iframe.src = ''; iframe.src = s; }
        break;
      }

      case 'proxy-go': {
        const urlInput = document.getElementById('proxy-url-input');
        proxyGo(urlInput ? urlInput.value : S.proxyUrl);
        break;
      }

      // Games
      case 'play-lumin':
        launchGame(btn.dataset.id, btn.dataset.name);
        break;

      case 'lumin-page':
        loadLuminGames(parseInt(val, 10), S.luminQuery).then(() => render());
        break;

      // AI
      case 'ai-suggest':
        sendAiMessage(val);
        break;

      // Log
      case 'log-filter':
        S.logFilter = val;
        render();
        break;

      case 'log-clear':
        S.log = [];
        renderLogStream();
        break;

      // Settings
      case 'set-appearance':
        S.appearance = val;
        applyTheme();
        saveUserSettings();
        render();
        break;

      case 'toggle-proxy-games':
        S.proxyGames = !S.proxyGames;
        saveUserSettings();
        render();
        break;

      case 'set-cloak-preset':
        S.cloakPreset = btn.dataset.id;
        render();
        break;

      case 'ac-inc':
        S.autoclose = Math.min(120, S.autoclose + 5);
        { const el = document.getElementById('ac-val'); if (el) el.textContent = S.autoclose + ' min'; }
        break;

      case 'ac-dec':
        S.autoclose = Math.max(5, S.autoclose - 5);
        { const el = document.getElementById('ac-val'); if (el) el.textContent = S.autoclose + ' min'; }
        break;

      // Cloak
      case 'cloak-toggle':
        S.cloakOpen = !S.cloakOpen;
        document.querySelectorAll('.cloak-dropdown').forEach(d => d.classList.toggle('open', S.cloakOpen));
        break;

      case 'cloak-apply': {
        const preset = CLOAK_PRESETS.find(p => p.id === btn.dataset.id);
        if (preset) {
          // Apply custom decoy title if set
          if (S.decoyTitle.trim()) {
            applyCloak({ ...preset, title: S.decoyTitle.trim() });
          } else {
            applyCloak(preset);
          }
        }
        break;
      }

      case 'cloak-clear':
        clearCloak();
        break;

      // Auth
      case 'auth-open':
        S.authModal = true;
        S.authErr = '';
        renderAuthModal();
        break;

      case 'auth-close':
        S.authModal = false;
        renderAuthModal();
        break;

      case 'auth-tab':
        S.authTab = val;
        S.authErr = '';
        renderAuthModal();
        break;

      case 'auth-google':
        authWithGoogle();
        break;

      case 'auth-submit':
        authWithEmail(S.authTab === 'signup');
        break;

      case 'auth-signout':
        authSignOut();
        break;

      // Modal
      case 'modal-close':
        closeModal();
        break;

      case 'modal-confirm':
        if (S.modal && S.modal.onConfirm) S.modal.onConfirm();
        closeModal();
        break;
    }
  });

  // ── Form submissions ───────────────────────────────────────
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'ai-form') {
      sendAiMessage();
    }
  });

  // ── Live input sync ────────────────────────────────────────
  document.addEventListener('input', (e) => {
    const id  = e.target.id;
    const val = e.target.value;

    if (id === 'ai-draft') {
      S.aiDraft = val;
      const sendBtn = document.querySelector('#ai-form button[type="submit"]');
      if (sendBtn) sendBtn.disabled = !val.trim();
      return;
    }
    if (id === 'log-query') {
      S.logQuery = val;
      renderLogStream();
      return;
    }
    if (id === 'proxy-url-input') {
      S.proxyInputUrl = val;
      return;
    }
    if (id === 'home-proxy-input') {
      // no state sync needed — read on submit
      return;
    }
    if (id === 'auth-email') {
      S.authEmail = val;
      return;
    }
    if (id === 'auth-pass') {
      S.authPassword = val;
      return;
    }
    if (id === 'decoy-title-input') {
      S.decoyTitle = val;
      return;
    }
    if (id === 'games-search-inp') {
      S.luminSearch = val;
      return;
    }
  });

  // ── Keyboard shortcuts ─────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    // Enter in home proxy bar
    if (e.key === 'Enter' && e.target.id === 'home-proxy-input') {
      e.preventDefault();
      const url = e.target.value.trim();
      if (url) proxyGo(url);
      return;
    }
    // Enter in proxy URL bar
    if (e.key === 'Enter' && e.target.id === 'proxy-url-input') {
      e.preventDefault();
      proxyGo(e.target.value);
      return;
    }
    // Enter in games search → search Lumin
    if (e.key === 'Enter' && e.target.id === 'games-search-inp') {
      e.preventDefault();
      S.luminQuery = e.target.value;
      loadLuminGames(1, S.luminQuery).then(() => render());
      return;
    }
    // Escape — panic key: close proxy (go to home) or close auth modal
    if (e.key === 'Escape') {
      if (S.authModal) {
        S.authModal = false;
        renderAuthModal();
        return;
      }
      if (S.cloakOpen) {
        S.cloakOpen = false;
        document.querySelectorAll('.cloak-dropdown').forEach(d => d.classList.remove('open'));
        return;
      }
      if (S.rail === 'proxy') {
        S.rail = 'home';
        render();
        return;
      }
    }
  });

  // ── Dark mode media query ──────────────────────────────────
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (S.appearance === 'auto') applyTheme();
    });
  }

  // ── Boot ───────────────────────────────────────────────────
  // UV config in main thread
  if (window.Ultraviolet) {
    window.__uv$config = {
      prefix: '/uv/',
      encodeUrl: Ultraviolet.codec.xor.encode,
      decodeUrl: Ultraviolet.codec.xor.decode,
    };
  }

  applyTheme();
  render();

  // Async inits
  initFirebase();
  initProxy();
  initLumin();

})();
