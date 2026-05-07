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
    share:   (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4"/><path d="M8 13l8 4"/>'),
    layers:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>'),
    cube:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l9 5v8l-9 5-9-5V8l9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v10"/>'),
    cog:     (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9z"/>'),
    search:  (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>'),
    chev:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M9 6l6 6-6 6"/>'),
    chevDown:(sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M6 9l6 6 6-6"/>'),
    arrow:   (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>'),
    plus:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 5v14"/><path d="M5 12h14"/>'),
    folder:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>'),
    file:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/>'),
    hist:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/>'),
    archive: (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M3 5h18v4H3z"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M10 13h4"/>'),
    users:   (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M14 20a5 5 0 0 1 7-4"/>'),
    panel:   (sz=18, sw=1.6) => mksvg(sz,sw,'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
    upload:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 17V5"/><path d="M6 11l6-6 6 6"/><path d="M3 21h18"/>'),
    shield:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/>'),
    bolt:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>'),
    more:    (sz=18, sw=1.6) => mksvg(sz,sw,'<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>'),
    link:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66L11 7"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66L13 17"/>'),
    check:   (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M5 12l5 5L20 7"/>'),
    x:       (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
    eye:     (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    download:(sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 5v12"/><path d="M6 13l6 6 6-6"/><path d="M3 21h18"/>'),
    lock:    (sz=18, sw=1.6) => mksvg(sz,sw,'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    filter:  (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>'),
    play:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M7 5v14l12-7L7 5z"/>'),
    star:    (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3z"/>'),
    bolt2:   (sz=18, sw=1.6) => mksvg(sz,sw,'<path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>'),
  };

  // ── Data ──────────────────────────────────────────────────
  const FRIENDS = [
    { id:'n1', name:'Nova',    handle:'@nova',  status:'online',  last:'now',       unread:2, msg:'Sent the proxy link, lmk if it works' },
    { id:'j1', name:'Juno',    handle:'@juno',  status:'online',  last:'2m',        unread:0, msg:'queued for chess at 3pm' },
    { id:'r1', name:'Ren',     handle:'@ren',   status:'idle',    last:'12m',       unread:1, msg:'did you see the new tetris build?' },
    { id:'m1', name:'Milo',    handle:'@milo',  status:'offline', last:'1h',        unread:0, msg:'thanks for the invite' },
    { id:'s1', name:'Saoirse', handle:'@sao',   status:'online',  last:'4m',        unread:0, msg:'joined Arcade room' },
    { id:'k1', name:'Kit',     handle:'@kit',   status:'offline', last:'yesterday', unread:0, msg:'see u tomorrow' },
  ];
  const REQUESTS = [
    { id:'p1', name:'Pax',  handle:'@pax',  mutual:3 },
    { id:'t1', name:'Tama', handle:'@tama', mutual:1 },
  ];
  const LOG_ENTRIES = [
    { t:'10:48:12', kind:'session', lvl:'ok',   actor:'you',    text:'Opened Ultraviolet via uv-edge-04 · 38 ms' },
    { t:'10:47:54', kind:'auth',    lvl:'ok',   actor:'you',    text:'Signed in to Communications Network as @operator' },
    { t:'10:43:08', kind:'comms',   lvl:'info', actor:'Nova',   text:'Sent message · proxy link shared' },
    { t:'10:41:02', kind:'session', lvl:'warn', actor:'system', text:'Rammerhead session held stale handshake 42s before drop' },
    { t:'10:38:30', kind:'catalog', lvl:'info', actor:'you',    text:'Added Tetris (html5 · 1p) to Games Library' },
    { t:'10:34:11', kind:'network', lvl:'info', actor:'system', text:'DNS rotated · school subnet · re-resolved 7 hosts' },
    { t:'10:30:00', kind:'session', lvl:'ok',   actor:'you',    text:'Closed Speed Test · ran 4 cycles · avg 84 Mbps' },
    { t:'10:22:41', kind:'comms',   lvl:'info', actor:'Juno',   text:'Joined Arcade room' },
    { t:'10:18:09', kind:'auth',    lvl:'warn', actor:'system', text:'Failed sign-in attempt · wrong passphrase · @unknown' },
    { t:'10:12:00', kind:'session', lvl:'ok',   actor:'you',    text:'Started Tetris co-op · paired with @juno' },
    { t:'09:58:22', kind:'catalog', lvl:'info', actor:'Ren',    text:'Updated Ultraviolet config · v3.2' },
    { t:'09:51:10', kind:'network', lvl:'ok',   actor:'system', text:'Catalog sync complete · 28 items · 0 conflicts' },
  ];
  const SANDBOX_PRESETS = [
    { id:'stealth',  name:'Stealth',  proxy:'Ultraviolet', region:'uv-edge-04', lifetime:'30 min',  desc:'Routed through Ultraviolet · randomized fingerprint · no cookies persisted' },
    { id:'research', name:'Research', proxy:'Rammerhead',  region:'rh-edge-01', lifetime:'2 hours', desc:'Routed through Rammerhead · long-lived cookies · download enabled' },
    { id:'media',    name:'Media',    proxy:'Alloy',       region:'al-edge-02', lifetime:'1 hour',  desc:'Higher bandwidth allocation · video streaming optimized · ad scrubbing on' },
    { id:'burner',   name:'Burner',   proxy:'Womginx',     region:'wg-edge-03', lifetime:'15 min',  desc:'Maximum isolation · clears every trace on close · single-use' },
  ];
  const TREE = [
    { id:'proxies', name:'Proxies',       count:12, open:true,  children:[
      { id:'ultraviolet', name:'Ultraviolet', leaf:true },
      { id:'rammerhead',  name:'Rammerhead',  leaf:true },
      { id:'alloy',       name:'Alloy',       leaf:true },
    ]},
    { id:'games', name:'Games Library',  count:28, open:true,  children:[
      { id:'arcade',  name:'Arcade',   count:14, leaf:true },
      { id:'puzzle',  name:'Puzzle',   count:9,  leaf:true },
      { id:'classic', name:'Classics', count:5,  leaf:true },
    ]},
    { id:'utils', name:'Utilities',     count:7,  open:false, children:[
      { id:'unblock', name:'Unblock URL', leaf:true },
      { id:'speedt',  name:'Speed Test',  leaf:true },
    ]},
    { id:'config', name:'Configuration', count:3, open:false, children:[
      { id:'theme',   name:'Theme',   leaf:true },
      { id:'domains', name:'Domains', leaf:true },
    ]},
  ];
  const TILES = {
    proxies:    [{ name:'Ultraviolet', meta:'v3.2 · web', live:true }, { name:'Rammerhead', meta:'v0.8 · web', live:true }, { name:'Alloy', meta:'v2.1 · web', live:false }, { name:'Womginx', meta:'v1.4 · ssh', live:false }],
    ultraviolet:[{ name:'Ultraviolet', meta:'v3.2 · web', live:true }],
    rammerhead: [{ name:'Rammerhead',  meta:'v0.8 · web', live:true }],
    alloy:      [{ name:'Alloy',       meta:'v2.1 · web', live:false }],
    games:      [{ name:'Tetris', meta:'html5 · 1p', live:true }, { name:'2048', meta:'html5 · 1p', live:true }, { name:'Chess', meta:'html5 · 2p', live:false }, { name:'Snake', meta:'html5 · 1p', live:true }, { name:'Minesweeper', meta:'html5 · 1p', live:false }, { name:'Solitaire', meta:'html5 · 1p', live:false }],
    arcade:     [{ name:'Tetris', meta:'html5 · 1p', live:true }, { name:'2048', meta:'html5 · 1p', live:true }, { name:'Snake', meta:'html5 · 1p', live:true }],
    puzzle:     [{ name:'Minesweeper', meta:'html5 · 1p', live:false }, { name:'Solitaire', meta:'html5 · 1p', live:false }],
    classic:    [{ name:'Chess', meta:'html5 · 2p', live:false }],
    utils:      [{ name:'Speed Test', meta:'network', live:true }, { name:'URL Unblock', meta:'redirect', live:true }, { name:'Clipboard', meta:'tool', live:false }],
    unblock:    [{ name:'URL Unblock', meta:'redirect', live:true }],
    speedt:     [{ name:'Speed Test', meta:'network', live:true }],
    config:     [{ name:'Theme Config', meta:'settings', live:false }, { name:'Domain Rules', meta:'settings', live:false }],
    theme:      [{ name:'Theme Config', meta:'settings', live:false }],
    domains:    [{ name:'Domain Rules', meta:'settings', live:false }],
  };
  const CREDITS_DATA = [
    { section:'Direction',       people:[{ name:'Operator', role:'Product · Vision · Catalog curation' }, { name:'Ageniuz', role:'Onboard assistant · Knowledge layer' }] },
    { section:'Engineering',     people:[{ name:'Nova', role:'Proxy stack · Ultraviolet integration' }, { name:'Juno', role:'Sandbox runtime · Session lifecycle' }, { name:'Ren', role:'Catalog tree · Search & indexing' }, { name:'Saoirse', role:'Networking · Bandwidth telemetry' }] },
    { section:'Design',          people:[{ name:'Milo', role:'Visual system · Glass surface language' }, { name:'Kit', role:'Iconography · Type pairings' }] },
    { section:'Network & Comms', people:[{ name:'Pax', role:'Communications Network architecture' }, { name:'Tama', role:'Friends graph · Presence model' }] },
    { section:'Library',         people:[{ name:'Arcade Collective', role:'Game library packaging' }, { name:'Off-grid Group', role:'Utility tools & speed tests' }] },
  ];
  const SUGGESTED_PROMPTS = [
    'Find me a working proxy that\'s fast on school WiFi',
    'Recommend a 2-player game I can play with Juno right now',
    'Why is my Ultraviolet session timing out?',
    'Summarize what changed in my catalog this week',
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
  const NAV_PROJECTS = [
    { id:'dashboard', label:'Dashboard',    icon:'panel' },
    { id:'library',   label:'Library',      icon:'layers' },
    { id:'shared',    label:'Shared Space', icon:'share' },
  ];
  const NAV_STATUS = [
    { id:'live',  label:'Live Now',    icon:'bolt',  count:3 },
    { id:'queue', label:'In Queue',    icon:'hist',  count:2 },
    { id:'team',  label:'Team Review', icon:'users' },
  ];
  const NAV_HISTORY = [
    { id:'recent',  label:'Recently Used', icon:'hist' },
    { id:'archive', label:'Archive',       icon:'archive' },
  ];

  // ── State ──────────────────────────────────────────────────
  const S = {
    rail: 'logo',
    nav: 'dashboard',
    tree: 'proxies',
    expanded: { proxies:true, games:true, utils:false, config:false },
    search: '',
    commsUser: null,
    commsActive: 'n1',
    commsThreads: {
      n1: [
        { from:'them', text:'Sent the proxy link, lmk if it works', t:'10:42' },
        { from:'me',   text:'got it, opening now', t:'10:43' },
        { from:'them', text:'lmk if speed test passes', t:'10:43' },
      ],
    },
    commsDraft: '',
    gateUser: '',
    gatePass: '',
    gateErr: false,
    aiMsgs: [{ from:'ai', text:"Hi — I'm Ageniuz, the assistant built into Agentiz. Ask me anything about your workspace, or pick a prompt below." }],
    aiDraft: '',
    aiThinking: false,
    logFilter: 'All',
    logQuery: '',
    catalogTab: 'All',
    activeProxy: 'uv-edge-04',
    sbPreset: 'stealth',
    sbUrl: '',
    sbRunning: [
      { id:'s1', name:'Stealth',   host:'uv-edge-04', up:'12m',     url:'duckduckgo.com' },
      { id:'s2', name:'Research',  host:'rh-edge-01', up:'1h 04m',  url:'wikipedia.org' },
    ],
    appearance: 'auto',
    autoclose: 30,
    stealth: true,
    decoy: 'school-portal',
    reducedMotion: false,
    proxyGames: false,
    modal: null,
    _toastTimer: null,
    _countAnim: null,
    _countVal: 0,
    // Auth
    authUser: null,
    authLoading: true,
    authModal: false,
    authTab: 'signin',
    authEmail: '',
    authPassword: '',
    authErr: '',
    // Proxy browser
    browserOpen: false,
    browserUrl: '',
    browserInputUrl: '',
    browserHistory: [],
    browserHistoryIdx: -1,
    browserStatus: 'idle',     // 'idle' | 'loading' | 'ok' | 'err'
    browserStatusText: 'Enter a URL to browse',
    proxyReady: false,
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
  };

  // Initialise blank threads for other friends
  FRIENDS.forEach(f => { if (!S.commsThreads[f.id]) S.commsThreads[f.id] = []; });

  // ── Dark mode ──────────────────────────────────────────────
  function isDark() {
    if (S.appearance === 'dark') return true;
    if (S.appearance === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme() {
    document.getElementById('app').classList.toggle('theme-dark', isDark());
  }

  // ── Firebase ───────────────────────────────────────────────
  function initFirebase() {
    if (!window.firebase) return;
    firebase.initializeApp(FB_CONFIG);

    firebase.auth().onAuthStateChanged(user => {
      S.authUser = user;
      S.authLoading = false;
      if (user) {
        // Persist user doc and load their settings
        firebase.firestore().collection('users').doc(user.uid).set({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }).catch(() => {});
        loadUserSettings(user.uid);
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
      if (cfg.stealth !== undefined) S.stealth = cfg.stealth;
      if (cfg.decoy) S.decoy = cfg.decoy;
      if (cfg.autoclose) S.autoclose = cfg.autoclose;
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
        decoy: S.decoy,
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
      .catch(e => { S.authErr = e.message; render(); });
  }

  function authWithEmail(isSignUp) {
    if (!window.firebase) return;
    S.authErr = '';
    const email = S.authEmail.trim();
    const pass  = S.authPassword;
    if (!email || !pass) { S.authErr = 'Email and password are required.'; render(); return; }
    const fn = isSignUp
      ? firebase.auth().createUserWithEmailAndPassword(email, pass)
      : firebase.auth().signInWithEmailAndPassword(email, pass);
    fn.then(() => { S.authModal = false; S.authEmail = ''; S.authPassword = ''; render(); })
      .catch(e => { S.authErr = e.message; render(); });
  }

  function authSignOut() {
    if (!window.firebase) return;
    firebase.auth().signOut().then(() => {
      S.authUser = null;
      S.commsUser = null;
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
    if (S.rail === 'home') render();
    try {
      const { games, pages } = await S.luminInst.getGames({ page, limit: 88, q: q || '' });
      S.luminGames = games || [];
      S.luminPages = pages || 1;
      S.luminPage = page;
      S.luminQuery = q || '';
      S.luminLoaded = true;
      loadLuminThumbs(S.luminGames.slice(0, 20));
    } catch (e) {
      console.warn('[Agentiz] Lumin getGames failed:', e);
    } finally {
      S.luminLoading = false;
      if (S.rail === 'home') render();
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
    if (S.rail === 'home') render();
  }

  function luminTiles(limit) {
    if (S.luminLoading && !S.luminLoaded) {
      return Array(limit || 8).fill(null).map((_, i) => ({ _loading: true, id: 'sk' + i }));
    }
    if (S.luminLoaded && S.luminGames.length) {
      return (limit ? S.luminGames.slice(0, limit) : S.luminGames).map(g => ({
        id: g.id,
        name: g.name,
        meta: g.category || 'game',
        live: true,
        thumb: S.luminThumb[g.id] || null,
        _lumin: true,
      }));
    }
    return null; // caller falls back to static TILES
  }

  async function launchGame(id) {
    if (!S.luminInst) { showToast('Game engine not ready'); return; }
    try {
      showToast('Loading game…');
      const { url } = await S.luminInst.getGameUrl(id);
      openBrowser(url, { direct: !S.proxyGames });
    } catch (e) {
      showToast('Could not load game');
    }
  }

  // ── Proxy / UV ─────────────────────────────────────────────
  async function initProxy() {
    if (!('serviceWorker' in navigator)) {
      S.browserStatusText = 'Service workers not supported';
      return;
    }
    try {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      // Set up bare-mux transport (epoxy v3 over the Railway bare server)
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
      S.browserStatusText = 'Proxy ready — enter a URL above';
      if (S.browserOpen) updateBrowserStatus('idle', S.browserStatusText);
    } catch (e) {
      console.warn('[Agentiz] Proxy init failed:', e.message);
      S.browserStatusText = 'Proxy unavailable — direct games still work';
    }
  }

  function proxyEncode(rawUrl) {
    if (!window.__uv$config) return rawUrl;
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }
    return window.__uv$config.prefix + window.__uv$config.encodeUrl(rawUrl);
  }

  function openBrowser(rawUrl, opts = {}) {
    if (!rawUrl) return;
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }
    S.browserOpen = true;
    S.browserHistory = [rawUrl];
    S.browserHistoryIdx = 0;
    S.browserUrl = rawUrl;
    S.browserInputUrl = rawUrl;
    S.browserStatus = 'loading';
    S.browserStatusText = 'Connecting…';
    renderBrowserOverlay();
    // Navigate iframe
    const iframe = document.getElementById('proxy-iframe');
    if (!iframe) { setTimeout(() => navigateIframe(rawUrl, opts), 50); return; }
    navigateIframe(rawUrl, opts);
  }

  function navigateIframe(rawUrl, opts = {}) {
    const iframe = document.getElementById('proxy-iframe');
    if (!iframe) return;
    const direct = opts.direct || !S.proxyReady;
    iframe.src = direct ? rawUrl : proxyEncode(rawUrl);
    S.browserStatus = 'loading';
    S.browserStatusText = direct ? 'Loading directly…' : 'Routing through proxy…';
    updateBrowserStatus('loading', S.browserStatusText);
  }

  function browserGo(rawUrl) {
    if (!rawUrl) return;
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) rawUrl = 'https://' + rawUrl;
    S.browserHistory = S.browserHistory.slice(0, S.browserHistoryIdx + 1);
    S.browserHistory.push(rawUrl);
    S.browserHistoryIdx = S.browserHistory.length - 1;
    S.browserUrl = rawUrl;
    S.browserInputUrl = rawUrl;
    navigateIframe(rawUrl);
    updateBrowserChrome();
  }

  function browserBack() {
    if (S.browserHistoryIdx > 0) {
      S.browserHistoryIdx--;
      S.browserUrl = S.browserHistory[S.browserHistoryIdx];
      S.browserInputUrl = S.browserUrl;
      navigateIframe(S.browserUrl);
      updateBrowserChrome();
    }
  }

  function browserForward() {
    if (S.browserHistoryIdx < S.browserHistory.length - 1) {
      S.browserHistoryIdx++;
      S.browserUrl = S.browserHistory[S.browserHistoryIdx];
      S.browserInputUrl = S.browserUrl;
      navigateIframe(S.browserUrl);
      updateBrowserChrome();
    }
  }

  function closeBrowser() {
    S.browserOpen = false;
    const overlay = document.getElementById('proxy-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 300);
    }
  }

  function updateBrowserChrome() {
    const urlInput = document.getElementById('pb-url-input');
    if (urlInput) urlInput.value = S.browserUrl;
    const backBtn = document.getElementById('pb-back');
    const fwdBtn  = document.getElementById('pb-forward');
    if (backBtn) backBtn.disabled = S.browserHistoryIdx <= 0;
    if (fwdBtn)  fwdBtn.disabled  = S.browserHistoryIdx >= S.browserHistory.length - 1;
  }

  function updateBrowserStatus(status, text) {
    S.browserStatus = status;
    S.browserStatusText = text;
    const dot  = document.querySelector('#proxy-overlay .pb-status-dot');
    const span = document.querySelector('#proxy-overlay .pb-status-text');
    if (dot) { dot.className = 'pb-status-dot ' + (status === 'ok' ? 'ok' : status === 'loading' ? 'loading' : status === 'err' ? 'err' : ''); }
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
    S._toastTimer = setTimeout(() => el.remove(), 2200);
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
              ${I.bolt(14)} ${esc(S.modal.action)}
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── Spark bars ─────────────────────────────────────────────
  function renderSpark(data) {
    const max = Math.max(...data);
    return '<div class="spark">' +
      data.map(v => `<div class="spark-bar ${v === max ? 'peak' : ''}" style="height:${(v/max)*100}%"></div>`).join('') +
    '</div>';
  }

  // ── Donut chart ────────────────────────────────────────────
  function renderDonut(value, total) {
    const r = 36, c = 2 * Math.PI * r, pct = value / total;
    return `<svg class="donut" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r="${r}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="10"/>
      <circle cx="48" cy="48" r="${r}" fill="none" stroke="currentColor" stroke-width="10"
        stroke-dasharray="${(pct*c).toFixed(1)} ${c.toFixed(1)}"
        stroke-linecap="round" transform="rotate(-90 48 48)"/>
      <text x="48" y="52" text-anchor="middle" font-size="18" font-weight="600" fill="currentColor"
        font-family="var(--font-display)">${Math.round(pct*100)}%</text>
    </svg>`;
  }

  // ── Rail ───────────────────────────────────────────────────
  function renderRail() {
    const top = [
      { id:'logo',   icon:'logo',   isLogo:true },
      { id:'home',   icon:'home' },
      { id:'globe',  icon:'globe' },
      { id:'spark',  icon:'spark',  dot:true },
      { id:'share',  icon:'share' },
      { id:'layers', icon:'layers' },
      { id:'cube',   icon:'cube' },
    ];
    const btns = top.map((t, i) => {
      const active = S.rail === t.id ? 'active' : '';
      const dotEl  = t.dot ? '<span class="dot"></span>' : '';
      const div    = t.isLogo && i > 0 ? '<div class="rail-divider"></div>' : '';
      const divAfter = t.isLogo ? '<div class="rail-divider"></div>' : '';
      return `${div}<button class="rail-btn ${active}" data-action="rail" data-val="${t.id}" aria-label="${t.id}">
        ${I[t.icon](t.isLogo ? 20 : 18, t.isLogo ? 1.4 : 1.6)}${dotEl}
      </button>${divAfter}`;
    }).join('');
    const settingsActive = S.rail === 'settings' ? 'active' : '';
    return `
      <div class="rail-block">${btns}</div>
      <div class="rail-spacer">AGENTIZ · 2026</div>
      <div class="rail-spacer" style="flex:0;padding:0;font-size:9px">SETTINGS</div>
      <div class="rail-block" style="padding:6px">
        <button class="rail-btn ${settingsActive}" data-action="rail" data-val="settings" aria-label="settings">
          ${I.cog(18)}
        </button>
      </div>`;
  }

  // ── Sidebar ────────────────────────────────────────────────
  function renderSidebar() {
    const hideSidebar = ['logo','globe','spark','share','layers','cube','settings'].includes(S.rail);
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden', hideSidebar);
    if (hideSidebar) return;

    const navGroup = (items) => items.map(n => {
      const active = S.nav === n.id ? 'active' : '';
      const countEl = n.count != null ? `<span class="count">${n.count}</span>` : '';
      return `<div class="nav-item ${active}" data-action="nav" data-val="${n.id}">
        <span class="ico">${I[n.icon](16)}</span>
        <span class="label">${esc(n.label)}</span>
        ${countEl}
      </div>`;
    }).join('');

    const treeRows = TREE.map(node => {
      const isOpen = S.expanded[node.id];
      const nodeActive = S.tree === node.id ? 'active' : '';
      const twistClass = isOpen ? 'open' : '';
      const countEl = node.count != null ? `<span class="count">${node.count}</span>` : '';
      let html = `<div class="tree-row ${nodeActive}" data-action="tree" data-id="${node.id}" data-toggle="true">
        <span class="twist ${twistClass}">${I.chev(10)}</span>
        <span class="ico">${I.folder(14)}</span>
        <span class="name">${esc(node.name)}</span>
        ${countEl}
      </div>`;
      if (isOpen) {
        html += node.children.map(c => {
          const childActive = S.tree === c.id ? 'active' : '';
          const childCount = c.count != null ? `<span class="count">${c.count}</span>` : '';
          return `<div class="tree-row ${childActive}" style="padding-left:26px" data-action="tree" data-id="${c.id}">
            <span class="twist leaf">${I.chev(10)}</span>
            <span class="ico">${I.file(14)}</span>
            <span class="name">${esc(c.name)}</span>
            ${childCount}
          </div>`;
        }).join('');
      }
      return html;
    }).join('');

    sidebar.innerHTML = `
      <div class="sidebar-chrome">
        <div class="traffic"></div><div class="traffic"></div><div class="traffic"></div>
        <div class="grow"></div>
        <div class="icon">${I.panel(14)}</div>
      </div>
      ${S.authUser
        ? `<div class="user">
            ${S.authUser.photoURL
              ? `<img class="user-avatar" src="${esc(S.authUser.photoURL)}" style="object-fit:cover" referrerpolicy="no-referrer" alt="">`
              : `<div class="user-avatar">${esc((S.authUser.displayName||S.authUser.email||'?')[0].toUpperCase())}</div>`}
            <div class="user-meta">
              <div class="user-name">${esc(S.authUser.displayName || 'Operator')} ${I.chevDown(12)}</div>
              <div class="user-mail">${esc(S.authUser.email || '')}</div>
            </div>
            <button style="margin-left:auto;color:var(--ink-3);display:flex" data-action="auth-signout" title="Sign out">${I.x(14)}</button>
          </div>`
        : `<button class="sidebar-signin" data-action="auth-open">
            ${I.lock(14)} Sign in to unlock Comms &amp; sync
           </button>`}
      <div class="section-label">Workspace</div>
      <nav class="nav">${navGroup(NAV_PROJECTS)}</nav>
      <div class="section-label">Status</div>
      <nav class="nav">${navGroup(NAV_STATUS)}</nav>
      <div class="section-label">History</div>
      <nav class="nav">${navGroup(NAV_HISTORY)}</nav>
      <div class="section-label">
        <span>Catalog</span>
        <button class="add">${I.plus(12)}</button>
      </div>
      <div class="search">
        ${I.search(14)}
        <input id="sidebar-search" placeholder="Search apps, proxies…" value="${esc(S.search)}">
        <span class="kbd">⌘K</span>
      </div>
      <div class="tree">${treeRows}</div>`;
  }

  // ── Views ──────────────────────────────────────────────────

  function viewWelcome() {
    return `<main class="main welcome">
      <div class="welcome-inner">
        <div class="welcome-eyebrow"><span class="dot"></span> AGENTIZ · v3.0 · 2026 RELEASE</div>
        <h1 class="welcome-title">Agentiz</h1>
        <p class="welcome-tag">
          A sandboxed workspace for proxies, games and utilities — designed
          for school computers, locked-down networks, and anywhere you need
          to slip past friction without leaving a trail.
        </p>
        <div class="welcome-grid">
          <div class="welcome-cell">
            <div class="welcome-cell-num">01</div>
            <div class="welcome-cell-h">Bring your own catalog</div>
            <div class="welcome-cell-b">Drop in proxies, web games, and tools. Organize them in a folder tree that mirrors how you actually think.</div>
          </div>
          <div class="welcome-cell">
            <div class="welcome-cell-num">02</div>
            <div class="welcome-cell-h">Run from anywhere</div>
            <div class="welcome-cell-b">Sessions are sandboxed and ephemeral. Close the tab and nothing's left behind on the host machine.</div>
          </div>
          <div class="welcome-cell">
            <div class="welcome-cell-num">03</div>
            <div class="welcome-cell-h">Share with friends</div>
            <div class="welcome-cell-b">Hand someone a link. They get the same workspace, scoped to what you've published — no install needed.</div>
          </div>
          <div class="welcome-cell">
            <div class="welcome-cell-num">04</div>
            <div class="welcome-cell-h">Stays out of the way</div>
            <div class="welcome-cell-b">Quiet, neutral interface. No noise, no telemetry, no ads. Just the apps you opened and the room to run them.</div>
          </div>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary" data-action="enter-dashboard">
            ${I.arrow(14)} Open dashboard
          </button>
          <button class="btn" data-action="go-catalog">${I.eye(14)} View catalog</button>
          <button class="btn">${I.link(14)} Share link</button>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat"><div class="n" id="stat-sessions">0</div><div class="l">sessions today</div></div>
          <div class="welcome-stat"><div class="n">28</div><div class="l">apps catalogued</div></div>
          <div class="welcome-stat"><div class="n">128<span>GB</span></div><div class="l">last 24h traffic</div></div>
          <div class="welcome-stat"><div class="n">99.4<span>%</span></div><div class="l">uptime · 30d</div></div>
        </div>
      </div>
    </main>`;
  }

  function viewDashboard() {
    const featured = [
      { name:'Tetris',   tag:'Arcade',  meta:'1p · html5', plays:'1.2k', hot:true,  glyph:'▦' },
      { name:'2048',     tag:'Puzzle',  meta:'1p · html5', plays:'984',  hot:true,  glyph:'▤' },
      { name:'Chess',    tag:'Classic', meta:'2p · html5', plays:'612',  hot:false, glyph:'♞' },
      { name:'Snake',    tag:'Arcade',  meta:'1p · html5', plays:'548',  hot:false, glyph:'▟' },
    ];
    const proxies = [
      { id:'uv-edge-04', name:'Ultraviolet', region:'uv-edge-04', ping:38, load:42, status:'online' },
      { id:'rh-edge-01', name:'Rammerhead',  region:'rh-edge-01', ping:54, load:61, status:'online' },
      { id:'al-edge-02', name:'Alloy',       region:'al-edge-02', ping:71, load:28, status:'online' },
      { id:'wg-edge-03', name:'Womginx',     region:'wg-edge-03', ping:96, load:12, status:'idle'   },
    ];
    const friends = [
      { n:'Nova',    s:'online',  doing:'Arcade · Tetris' },
      { n:'Juno',    s:'online',  doing:'queued · Chess' },
      { n:'Ren',     s:'idle',    doing:'—' },
      { n:'Saoirse', s:'online',  doing:'Speed Test' },
    ];
    const recent = [
      { n:'Tetris',      kind:'Game',  ago:'2m ago' },
      { n:'Ultraviolet', kind:'Proxy', ago:'8m ago' },
      { n:'Speed Test',  kind:'Tool',  ago:'30m ago' },
      { n:'2048',        kind:'Game',  ago:'1h ago' },
    ];
    const glyphFor = (kind) => kind === 'Game' ? '▦' : kind === 'Proxy' ? '◉' : '◇';

    return `<main class="main">
      <div class="main-head">
        <div>
          <div class="main-title">Lobby</div>
          <div class="main-sub">Pick a game, hop on a proxy, or jump back into something you were running.</div>
        </div>
        <div class="main-head-actions">
          <button class="btn">${I.search(14)} Search catalog</button>
          <button class="btn btn-primary" data-action="launch-session">${I.play(14)} Quick play</button>
        </div>
      </div>
      <div class="main-body lobby">

        <!-- Hero featured game -->
        <div class="lobby-hero">
          <div class="lobby-hero-art">
            <div class="lobby-hero-glyph">▦</div>
            <div class="lobby-hero-grid"></div>
          </div>
          <div class="lobby-hero-meta">
            <div class="lobby-eyebrow"><span class="led on"></span> FEATURED · TODAY</div>
            <div class="lobby-hero-title">Tetris</div>
            <div class="lobby-hero-desc">A clean, distraction-free build of the classic. Loads in under a second on locked-down WiFi.</div>
            <div class="lobby-hero-stats">
              <div><span class="k">Plays today</span><span class="v">1,248</span></div>
              <div><span class="k">Avg session</span><span class="v">7m 12s</span></div>
              <div><span class="k">Status</span><span class="v">Online</span></div>
            </div>
            <div class="lobby-hero-actions">
              <button class="btn btn-primary" data-action="launch-session">${I.play(14)} Play now</button>
              <button class="btn">${I.users(14)} Invite Juno</button>
              <button class="btn">${I.star(14)} Save</button>
            </div>
          </div>
        </div>

        <!-- Quick play strip -->
        <div class="lobby-section-h">
          <span>Quick play${S.luminLoading ? ' <span style="font-size:10px;opacity:.5;font-weight:400">Loading…</span>' : ''}</span>
          <button class="card-action" data-action="go-catalog">See all ${I.arrow(12)}</button>
        </div>
        <div class="lobby-row">
          ${(() => {
            const live = luminTiles(4);
            if (live) {
              return live.map(g => g._loading
                ? `<div class="lobby-game lumin-loading">
                    <div class="lobby-game-art" style="background:var(--line)"></div>
                    <div class="lobby-game-name" style="height:14px;background:var(--line);border-radius:4px;width:70%"></div>
                    <div class="lobby-game-meta" style="height:10px;background:var(--line);border-radius:4px;width:50%"></div>
                   </div>`
                : `<button class="lobby-game" data-action="play-lumin" data-id="${esc(g.id)}">
                    <div class="lobby-game-art${g.thumb?' has-img':''}" ${g.thumb?`style="background-image:url('${g.thumb}')"`:''}>
                      ${g.thumb ? '' : `<span class="lobby-game-glyph">▦</span>`}
                    </div>
                    <div class="lobby-game-name">${esc(g.name)}</div>
                    <div class="lobby-game-meta">${esc(g.meta)}</div>
                   </button>`
              ).join('');
            }
            // Static fallback
            return featured.map(g => `
              <button class="lobby-game" data-action="launch-item" data-name="${esc(g.name)}" data-meta="${esc(g.meta)}">
                <div class="lobby-game-art">
                  <span class="lobby-game-glyph">${g.glyph}</span>
                  ${g.hot ? '<span class="lobby-game-hot">HOT</span>' : ''}
                </div>
                <div class="lobby-game-name">${esc(g.name)}</div>
                <div class="lobby-game-meta">
                  <span>${esc(g.tag)}</span><span class="dotsep">·</span><span>${esc(g.plays)} plays</span>
                </div>
              </button>`).join('');
          })()}
        </div>

        <!-- Proxy picker + Friends -->
        <div class="lobby-split">
          <div class="lobby-card">
            <div class="lobby-card-h">
              <span>Proxies</span>
              <span class="lobby-card-sub">Tap one to set as default</span>
            </div>
            ${proxies.map(p => `
              <button class="proxy-row ${S.activeProxy===p.id?'active':''}" data-action="set-proxy" data-id="${p.id}">
                <div class="proxy-led ${p.status}"><span></span></div>
                <div class="proxy-meta">
                  <div class="proxy-name">${esc(p.name)}</div>
                  <div class="proxy-region">${esc(p.region)}</div>
                </div>
                <div class="proxy-bars">
                  ${[0,1,2,3].map(i => `<span class="${p.load > (i+1)*20 ? 'on' : ''}"></span>`).join('')}
                </div>
                <div class="proxy-ping">
                  <div class="v">${p.ping}<span>ms</span></div>
                  <div class="k">ping</div>
                </div>
              </button>`).join('')}
          </div>

          <div class="lobby-card">
            <div class="lobby-card-h">
              <span>Friends in lobby</span>
              <span class="lobby-card-sub">${friends.filter(f=>f.s==='online').length} online</span>
            </div>
            ${friends.map(f => `
              <div class="friend-row">
                <div class="comms-avatar" style="width:32px;height:32px;font-size:13px">
                  ${esc(f.n[0])}<span class="presence ${f.s}"></span>
                </div>
                <div class="friend-meta">
                  <div class="friend-name">${esc(f.n)}</div>
                  <div class="friend-doing">${esc(f.doing)}</div>
                </div>
                <button class="btn" style="padding:6px 10px;font-size:12px">${I.bolt(12)} Join</button>
              </div>`).join('')}
          </div>
        </div>

        <!-- Recent + What's new -->
        <div class="lobby-split">
          <div class="lobby-card">
            <div class="lobby-card-h">
              <span>Pick up where you left off</span>
              <span class="lobby-card-sub">Recent</span>
            </div>
            ${recent.map(r => `
              <button class="recent-row" data-action="launch-item" data-name="${esc(r.n)}" data-meta="${esc(r.kind)}">
                <div class="recent-glyph">${glyphFor(r.kind)}</div>
                <div class="recent-meta">
                  <div class="recent-name">${esc(r.n)}</div>
                  <div class="recent-kind">${esc(r.kind)} · ${esc(r.ago)}</div>
                </div>
                <div class="recent-resume">${I.play(12)} Resume</div>
              </button>`).join('')}
          </div>

          <div class="lobby-card lobby-news">
            <div class="lobby-card-h">
              <span>What's new</span>
              <span class="lobby-card-sub">v3.0 · 2026.05</span>
            </div>
            <div class="news-item">
              <div class="news-tag">NEW</div>
              <div><div class="news-h">Sandbox profiles</div><div class="news-d">Four new disposable browsing profiles with their own proxies.</div></div>
            </div>
            <div class="news-item">
              <div class="news-tag">FIX</div>
              <div><div class="news-h">Ultraviolet handshake</div><div class="news-d">Stale connections now drop in 8s instead of 42s.</div></div>
            </div>
            <div class="news-item">
              <div class="news-tag">+4</div>
              <div><div class="news-h">Catalog additions</div><div class="news-d">Tetris, 2048, Snake, and Speed Test joined this week.</div></div>
            </div>
          </div>
        </div>

      </div>
    </main>`;
  }

  function viewCatalog() {
    const titleMap = { proxies:'Proxies', games:'Games Library', utils:'Utilities', config:'Configuration' };
    const isGames  = ['games','arcade','puzzle','classic'].includes(S.tree) || S.tree === 'library';
    const title    = titleMap[S.tree] || (S.tree.charAt(0).toUpperCase() + S.tree.slice(1));
    const tabs     = ['All','Live','Drafts','Shared'];

    // Use Lumin data for game-related trees
    const luminData = isGames ? luminTiles(null) : null;
    const items = luminData || TILES[S.tree] || TILES.proxies;
    const subtitle = luminData
      ? `${S.luminGames.length} games · page ${S.luminPage} of ${S.luminPages}`
      : `${items.length} items · last sync 2 min ago`;

    // Page controls for Lumin
    const pageBar = luminData && S.luminPages > 1 ? `
      <div class="catalog-pagination">
        <button class="page-btn" ${S.luminPage<=1?'disabled':''} data-action="lumin-page" data-val="${S.luminPage-1}">← Prev</button>
        <span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-3)">${S.luminPage} / ${S.luminPages}</span>
        <button class="page-btn" ${S.luminPage>=S.luminPages?'disabled':''} data-action="lumin-page" data-val="${S.luminPage+1}">Next →</button>
      </div>` : '';

    return `<main class="main">
      <div class="main-head">
        <div>
          <div class="main-title">${esc(title)}</div>
          <div class="main-sub">${subtitle}</div>
        </div>
        <div class="main-head-actions">
          <button class="btn">${I.filter(14)} Filter</button>
          <button class="btn btn-primary">${I.plus(14)} Add</button>
        </div>
      </div>
      <div class="tabs">
        ${tabs.map(t => `<div class="tab ${S.catalogTab===t?'active':''}" data-action="catalog-tab" data-val="${t}">${t}</div>`).join('')}
      </div>
      ${isGames ? `<div class="catalog-search">${I.search(14)}<input id="catalog-search-inp" placeholder="Search games…" value="${esc(S.luminSearch)}"></div>` : ''}
      <div class="tile-grid">
        ${items.map(t => t._loading
          ? `<div class="tile lumin-loading">
              <div class="tile-thumb"></div>
              <div class="tile-name">Loading</div>
              <div class="tile-meta">—</div>
              <div class="tile-status"></div>
             </div>`
          : t._lumin
          ? `<div class="tile" data-action="play-lumin" data-id="${esc(t.id)}">
              <div class="tile-thumb${t.thumb?' has-img':''}" ${t.thumb?`style="background-image:url('${t.thumb}')"`:''}>
                ${t.thumb ? '' : I.cube(28,1.2)}
              </div>
              <div class="tile-name">${esc(t.name)}</div>
              <div class="tile-meta">${esc(t.meta)}</div>
              <div class="tile-status live"><span class="led"></span>online</div>
             </div>`
          : `<div class="tile" data-action="launch-item" data-name="${esc(t.name)}" data-meta="${esc(t.meta||'')}">
              <div class="tile-thumb">${I.cube(28, 1.2)}</div>
              <div class="tile-name">${esc(t.name)}</div>
              <div class="tile-meta">${esc(t.meta||'')}</div>
              <div class="tile-status ${t.live?'live':''}"><span class="led"></span>${t.live?'online':'ready'}</div>
             </div>`
        ).join('')}
        ${!luminData ? `<div class="tile" style="justify-content:center;align-items:center;color:var(--ink-3)">${I.plus(20)}<div class="tile-name" style="color:var(--ink-3);font-weight:500">Add new</div></div>` : ''}
      </div>
      ${pageBar}
    </main>`;
  }

  function viewGate() {
    return `<main class="main gate">
      <div class="gate-card">
        <div class="gate-lock">${I.lock(28, 1.4)}</div>
        <div class="gate-status locked"><span class="led"></span> ACCESS · RESTRICTED</div>
        <h2 class="gate-title">Communications Network</h2>
        <p class="gate-body">
          Sign in with your Agentiz account to reach friends, share rooms, and queue sessions together.
          The network stays closed to anonymous traffic.
        </p>
        <div class="gate-actions" style="margin-top:6px">
          <button class="btn" data-action="auth-open">Request invite</button>
          <button class="btn btn-primary" data-action="auth-open">${I.arrow(14)} Sign in</button>
        </div>
        <div class="gate-foot">
          <span>${I.shield(12)} End-to-end · sandboxed · no telemetry</span>
        </div>
      </div>
    </main>`;
  }

  function viewComms() {
    const active = FRIENDS.find(f => f.id === S.commsActive) || FRIENDS[0];
    const thread  = S.commsThreads[S.commsActive] || [];
    const onlineCount = FRIENDS.filter(f => f.status === 'online').length;

    const statusText = active.status === 'online'
      ? 'Online · in Arcade room'
      : active.status === 'idle'
      ? `Idle · 12 min`
      : `Last seen ${active.last}`;

    const presenceClass = active.status;

    return `<main class="main comms">
      <div class="main-head">
        <div>
          <div class="main-title">Communications Network</div>
          <div class="main-sub">Signed in as <strong>${esc(S.commsUser.name)}</strong> · ${onlineCount} friends online</div>
        </div>
        <div class="main-head-actions">
          <button class="btn">${I.users(14)} Add friend</button>
          <button class="btn" data-action="comms-logout">${I.x(14)} Sign out</button>
        </div>
      </div>
      <div class="comms-body">
        <aside class="comms-list">
          <div class="comms-section-h">Friends · ${FRIENDS.length}</div>
          ${FRIENDS.map(f => `
            <button class="comms-row ${S.commsActive===f.id?'active':''}" data-action="comms-select" data-id="${f.id}">
              <div class="comms-avatar">${esc(f.name[0])}<span class="presence ${f.status}"></span></div>
              <div class="comms-meta">
                <div class="comms-name">
                  <span>${esc(f.name)}</span>
                  <span class="comms-time">${esc(f.last)}</span>
                </div>
                <div class="comms-msg">
                  <span>${esc(f.msg)}</span>
                  ${f.unread > 0 ? `<span class="comms-unread">${f.unread}</span>` : ''}
                </div>
              </div>
            </button>`).join('')}
          <div class="comms-section-h" style="margin-top:8px">Requests · ${REQUESTS.length}</div>
          ${REQUESTS.map(r => `
            <div class="comms-row">
              <div class="comms-avatar">${esc(r.name[0])}<span class="presence offline"></span></div>
              <div class="comms-meta">
                <div class="comms-name"><span>${esc(r.name)}</span><span class="comms-time">${esc(r.handle)}</span></div>
                <div class="comms-msg" style="color:var(--ink-3)">${r.mutual} mutual · pending</div>
              </div>
              <div class="comms-req-actions">
                <button class="comms-icon" title="Accept" data-action="friend-accept" data-id="${r.id}">${I.check(12)}</button>
                <button class="comms-icon" title="Reject" data-action="friend-reject" data-id="${r.id}">${I.x(12)}</button>
              </div>
            </div>`).join('')}
        </aside>

        <section class="comms-thread">
          <div class="thread-head">
            <div class="comms-avatar lg">${esc(active.name[0])}<span class="presence ${presenceClass}"></span></div>
            <div>
              <div class="thread-name">${esc(active.name)} <span class="thread-handle">${esc(active.handle)}</span></div>
              <div class="thread-status">
                <span class="presence-dot ${presenceClass}"></span>${esc(statusText)}
              </div>
            </div>
            <div style="flex:1"></div>
            <button class="btn">${I.bolt(14)} Invite to session</button>
          </div>
          <div class="thread-stream" id="thread-stream">
            <div class="thread-day">— today —</div>
            ${thread.map(m => `
              <div class="bubble ${m.from === 'me' ? 'me' : 'them'}">
                <div>${esc(m.text)}</div>
                <div class="bubble-time">${esc(m.t)}</div>
              </div>`).join('')}
          </div>
          <form class="thread-compose" id="comms-form">
            <button type="button" class="comms-icon">${I.plus(14)}</button>
            <input id="comms-draft" value="${esc(S.commsDraft)}" placeholder="Message ${esc(active.name)}…" autocomplete="off">
            <button type="submit" class="btn btn-primary" ${!S.commsDraft.trim()?'disabled':''}>
              ${I.arrow(14)} Send
            </button>
          </form>
        </section>

        <aside class="comms-rail">
          <div class="comms-section-h">Rooms</div>
          ${[{name:'Arcade',members:4,live:true},{name:'Study',members:2,live:true},{name:'Off-grid',members:0,live:false}].map(r=>`
            <div class="comms-room">
              <div class="comms-room-h"><span class="led ${r.live?'on':''}"></span> ${esc(r.name)}</div>
              <div class="comms-room-meta">${r.members} members</div>
            </div>`).join('')}
          <div class="comms-section-h" style="margin-top:8px">Activity</div>
          <div class="comms-activity">
            <div><strong>Nova</strong> joined <em>Arcade</em></div>
            <div><strong>Juno</strong> queued <em>Chess</em></div>
            <div><strong>Sao</strong> shared a proxy link</div>
            <div><strong>Ren</strong> went idle</div>
          </div>
        </aside>
      </div>
    </main>`;
  }

  function viewAgeniuz() {
    const showSuggests = S.aiMsgs.length <= 1 && !S.aiThinking;
    const msgHtml = S.aiMsgs.map(m => {
      if (m.from === 'ai') {
        return `<div class="ageniuz-row ai">
          <div class="ageniuz-avatar">${I.spark(14, 1.6)}</div>
          <div class="ageniuz-bubble ai">
            <div class="ageniuz-name">Ageniuz</div>
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
        <div class="ageniuz-avatar">${I.spark(14, 1.6)}</div>
        <div class="ageniuz-bubble ai">
          <div class="ageniuz-name">Ageniuz</div>
          <div class="ageniuz-typing"><span></span><span></span><span></span></div>
        </div>
      </div>` : '';

    const suggestHtml = showSuggests ? `
      <div class="ageniuz-suggest">
        <div class="ageniuz-suggest-h">Try asking</div>
        <div class="ageniuz-suggest-grid">
          ${SUGGESTED_PROMPTS.map(p => `
            <button class="ageniuz-chip" data-action="ai-suggest" data-val="${esc(p)}">
              ${I.arrow(12)} ${esc(p)}
            </button>`).join('')}
        </div>
      </div>` : '';

    return `<main class="main ageniuz">
      <div class="main-head">
        <div>
          <div class="ageniuz-eyebrow">
            <span class="ageniuz-mark">${I.spark(12, 1.6)}</span>
            BUILT BY AGENTIZ
          </div>
          <div class="main-title" style="display:flex;align-items:baseline;gap:12px">
            Ageniuz
            <span style="font-size:13px;color:var(--ink-3);font-family:var(--font-mono);letter-spacing:0.1em">v1.4 · BETA</span>
          </div>
          <div class="main-sub">Your in-workspace assistant. Ask about sessions, friends, your catalog — or anything else.</div>
        </div>
        <div class="main-head-actions">
          <button class="btn">${I.hist(14)} History</button>
          <button class="btn">${I.cog(14)} Settings</button>
        </div>
      </div>
      <div class="ageniuz-stream" id="ai-stream">${msgHtml}${thinkHtml}</div>
      ${suggestHtml}
      <form class="ageniuz-compose" id="ai-form">
        <span class="ageniuz-compose-icon">${I.spark(14)}</span>
        <input id="ai-draft" value="${esc(S.aiDraft)}" placeholder="Ask Ageniuz anything…" autocomplete="off">
        <button type="button" class="comms-icon">${I.upload(14)}</button>
        <button type="submit" class="btn btn-primary" ${!S.aiDraft.trim()?'disabled':''}>
          ${I.arrow(14)} Send
        </button>
      </form>
    </main>`;
  }

  function viewCredits() {
    return `<main class="main credits">
      <div class="credits-inner">
        <div class="welcome-eyebrow"><span class="dot"></span> AGENTIZ · CREDITS · 2026</div>
        <h1 class="credits-title">About <span class="credits-mono">/</span> Credits</h1>
        <p class="credits-tag">
          Agentiz is a sandboxed workspace for proxies, games and utilities.
          Built quietly by a small group who wanted school computers to feel
          a little less locked down. These are the people who made it.
        </p>
        <div class="credits-grid">
          ${CREDITS_DATA.map(s => `
            <section class="credits-section">
              <div class="credits-section-h">${esc(s.section)}</div>
              <div class="credits-people">
                ${s.people.map(p => `
                  <div class="credits-row">
                    <div class="credits-name">${esc(p.name)}</div>
                    <div class="credits-role">${esc(p.role)}</div>
                  </div>`).join('')}
              </div>
            </section>`).join('')}
        </div>
        <div class="credits-thanks">
          <div class="credits-section-h">With thanks to</div>
          <p>
            The open-source maintainers of Ultraviolet, Rammerhead and Alloy.
            The friends who tested late-night builds. Anyone who filed an issue
            in good faith. And every operator who spun up a session somewhere
            they probably weren't supposed to.
          </p>
        </div>
        <footer class="credits-footer">
          <div class="credits-foot-left">
            <span class="credits-mono">© 2026 Agentiz</span>
            <span class="credits-mono">v3.0</span>
          </div>
          <nav class="credits-foot-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
        </footer>
      </div>
    </main>`;
  }

  function viewLog() {
    const filters = ['All','Sessions','Comms','Auth','Catalog','Network'];
    const kindMap = { Sessions:'session', Comms:'comms', Auth:'auth', Catalog:'catalog', Network:'network' };
    const visible = LOG_ENTRIES.filter(e => {
      if (S.logFilter !== 'All' && e.kind !== kindMap[S.logFilter]) return false;
      if (S.logQuery.trim() && !`${e.actor} ${e.text}`.toLowerCase().includes(S.logQuery.toLowerCase())) return false;
      return true;
    });

    return `<main class="main log">
      <div class="main-head">
        <div>
          <div class="main-title">Activity Log</div>
          <div class="main-sub">Every session, request, and event across this workspace · last 24 hours</div>
        </div>
        <div class="main-head-actions">
          <button class="btn">${I.download(14)} Export</button>
          <button class="btn">${I.x(14)} Clear</button>
        </div>
      </div>
      <div class="log-tools">
        <div class="log-search">
          ${I.search(14)}
          <input id="log-query" value="${esc(S.logQuery)}" placeholder="Search by actor, text, or host…">
        </div>
        <div class="log-filters">
          ${filters.map(f => `<button class="log-filter ${S.logFilter===f?'active':''}" data-action="log-filter" data-val="${f}">${f}</button>`).join('')}
        </div>
      </div>
      <div class="log-stream">
        ${visible.length === 0
          ? '<div class="log-empty">No entries match your filter.</div>'
          : visible.map(e => `
            <div class="log-entry lvl-${e.lvl}">
              <div class="log-time">${esc(e.t)}</div>
              <div class="log-kind">${esc(e.kind)}</div>
              <div class="log-actor">${esc(e.actor)}</div>
              <div class="log-text">${esc(e.text)}</div>
              <button class="log-more">${I.more(14)}</button>
            </div>`).join('')}
      </div>
    </main>`;
  }

  function viewSandbox() {
    const preset = SANDBOX_PRESETS.find(p => p.id === S.sbPreset) || SANDBOX_PRESETS[0];
    return `<main class="main sandbox">
      <div class="main-head">
        <div>
          <div class="main-title">Sandbox</div>
          <div class="main-sub">Disposable browsing instances. Each one runs in isolation with its own proxy and identity.</div>
        </div>
        <div class="main-head-actions">
          <button class="btn">${I.shield(14)} Privacy report</button>
        </div>
      </div>
      <div class="sandbox-body">
        <div class="sandbox-launcher">
          <div class="card-title" style="margin-bottom:12px">Launch profile</div>
          <div class="sandbox-presets">
            ${SANDBOX_PRESETS.map(p => `
              <button class="sandbox-preset ${S.sbPreset===p.id?'active':''}" data-action="sb-preset" data-val="${p.id}">
                <div class="sandbox-preset-h">${esc(p.name)}</div>
                <div class="sandbox-preset-meta">${esc(p.proxy)} · ${esc(p.lifetime)}</div>
              </button>`).join('')}
          </div>
          <div class="sandbox-detail">
            <div class="sandbox-detail-row"><span class="k">Profile</span><span class="v">${esc(preset.name)}</span></div>
            <div class="sandbox-detail-row">
              <span class="k">Proxy</span>
              <span class="v">${esc(preset.proxy)} <span style="color:var(--ink-3);font-family:var(--font-mono);font-size:11px;margin-left:6px">${esc(preset.region)}</span></span>
            </div>
            <div class="sandbox-detail-row"><span class="k">Lifetime</span><span class="v">${esc(preset.lifetime)}</span></div>
            <div class="sandbox-detail-row" style="border-bottom:none">
              <span class="k">Notes</span>
              <span class="v" style="font-size:13px;color:var(--ink-2);line-height:1.4">${esc(preset.desc)}</span>
            </div>
          </div>
          <div class="sandbox-target">
            <input id="sb-url" value="${esc(S.sbUrl)}" placeholder="Enter a URL · leave blank for blank tab">
            <button class="btn btn-primary" data-action="sb-launch">${I.bolt(14)} Launch sandbox</button>
          </div>
        </div>
        <div class="sandbox-running">
          <div class="card-title" style="padding:0 0 8px">Currently running · ${S.sbRunning.length}</div>
          ${S.sbRunning.length === 0
            ? '<div class="log-empty">No sandboxes running.</div>'
            : S.sbRunning.map(r => `
              <div class="sandbox-instance">
                <div class="sandbox-instance-led"><span></span></div>
                <div class="sandbox-instance-meta">
                  <div class="sandbox-instance-h">${esc(r.name)} <span class="sandbox-instance-host">${esc(r.host)}</span></div>
                  <div class="sandbox-instance-url">${esc(r.url)}</div>
                </div>
                <div class="sandbox-instance-up">${esc(r.up)}</div>
                <button class="comms-icon" title="Open">${I.eye(14)}</button>
                <button class="comms-icon" title="Terminate" data-action="sb-close" data-id="${r.id}">${I.x(14)}</button>
              </div>`).join('')}
        </div>
      </div>
    </main>`;
  }

  function viewSettings() {
    return `<main class="main settings-page">
      <div class="main-head">
        <div>
          <div class="main-title">Settings</div>
          <div class="main-sub">Workspace preferences and the panic kit.</div>
        </div>
      </div>
      <div class="settings-body">
        <section class="settings-section">
          <div class="settings-section-h">Appearance</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Theme mode</div>
              <div class="settings-row-d">Match the host system or pick one explicitly.</div>
            </div>
            <div class="settings-segment">
              ${['auto','light','dark'].map(m => `<button class="${S.appearance===m?'active':''}" data-action="set-appearance" data-val="${m}">${m}</button>`).join('')}
            </div>
          </div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Reduced motion</div>
              <div class="settings-row-d">Disable transitions and animated meters.</div>
            </div>
            <div class="toggle ${S.reducedMotion?'on':''}" data-action="toggle-reduced"></div>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">Games</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Proxy games <span class="proxy-games-badge">Beta</span></div>
              <div class="settings-row-d">Route game traffic through Ultraviolet when games are blocked on your network. Direct is faster — only enable if needed.</div>
            </div>
            <div class="toggle ${S.proxyGames?'on':''}" data-action="toggle-proxy-games"></div>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">Sessions</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Auto-close idle sessions</div>
              <div class="settings-row-d">Close any sandbox or proxy after this many minutes of inactivity.</div>
            </div>
            <div class="settings-stepper">
              <button data-action="ac-dec">−</button>
              <span id="ac-val">${S.autoclose} min</span>
              <button data-action="ac-inc">+</button>
            </div>
          </div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Stealth fingerprint</div>
              <div class="settings-row-d">Randomize user-agent, timezone, and screen metrics on every launch.</div>
            </div>
            <div class="toggle ${S.stealth?'on':''}" data-action="toggle-stealth"></div>
          </div>
        </section>

        <section class="settings-section danger">
          <div class="settings-section-h">Panic kit</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Hotkey</div>
              <div class="settings-row-d">Press to instantly hide everything and switch to the decoy page.</div>
            </div>
            <div class="settings-kbd">⌘ + ⇧ + .</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Decoy page</div>
              <div class="settings-row-d">What appears when panic is triggered.</div>
            </div>
            <div class="settings-segment">
              ${[['school-portal','Portal'],['docs','Docs'],['calc','Calculator']].map(([id,label]) =>
                `<button class="${S.decoy===id?'active':''}" data-action="set-decoy" data-val="${id}">${label}</button>`
              ).join('')}
            </div>
          </div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h" style="color:var(--ink)">Wipe workspace</div>
              <div class="settings-row-d">Erase all sandboxes, sessions, history, and signed-in accounts. This cannot be undone.</div>
            </div>
            <button class="btn btn-danger" data-action="panic">${I.shield(14)} Wipe now</button>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-h">About</div>
          <div class="settings-row">
            <div class="settings-row-meta">
              <div class="settings-row-h">Agentiz <span class="settings-mono">v3.0 · build 2026.05</span></div>
              <div class="settings-row-d">Released May 2026. © Agentiz operators.</div>
            </div>
            <button class="btn">Check for updates</button>
          </div>
        </section>
      </div>
    </main>`;
  }

  // ── Browser overlay ───────────────────────────────────────
  function renderBrowserOverlay() {
    let el = document.getElementById('proxy-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'proxy-overlay';
      el.className = 'proxy-overlay';
      document.getElementById('app').appendChild(el);
      // Wire iframe load events after insertion
      setTimeout(() => {
        const iframe = document.getElementById('proxy-iframe');
        if (!iframe) return;
        iframe.addEventListener('load', () => {
          updateBrowserStatus('ok', S.proxyReady ? `Proxied via Railway` : 'Direct connection');
          updateBrowserChrome();
        });
        iframe.addEventListener('error', () => {
          updateBrowserStatus('err', 'Failed to load page');
        });
      }, 100);
    }
    const canBack    = S.browserHistoryIdx > 0;
    const canForward = S.browserHistoryIdx < S.browserHistory.length - 1;
    const dotCls     = S.browserStatus === 'ok' ? 'ok' : S.browserStatus === 'loading' ? 'loading' : S.browserStatus === 'err' ? 'err' : '';
    el.innerHTML = `
      <div class="pb-chrome">
        <div class="pb-nav">
          <button id="pb-back" ${canBack?'':'disabled'} data-action="browser-back" title="Back">
            ${I.chev(16, 2)}
          </button>
          <button id="pb-forward" ${canForward?'':'disabled'} data-action="browser-forward" title="Forward" style="transform:scaleX(-1)">
            ${I.chev(16, 2)}
          </button>
          <button data-action="browser-refresh" title="Refresh">
            ${I.hist(16)}
          </button>
        </div>
        <div class="pb-urlbar">
          <span class="pb-lock">${I.lock(13, 1.4)}</span>
          <input id="pb-url-input" value="${esc(S.browserUrl)}" placeholder="Enter a URL or search…" spellcheck="false">
          <button class="pb-go" data-action="browser-go">Go</button>
        </div>
        <div class="pb-actions">
          <button data-action="browser-new" title="New tab (opens in Agentiz)">${I.plus(16)}</button>
          <button data-action="browser-close" title="Close">${I.x(16)}</button>
        </div>
      </div>
      ${S.browserUrl
        ? `<iframe id="proxy-iframe" class="pb-frame" referrerpolicy="no-referrer" allow="autoplay; fullscreen; gamepad; pointer-lock"></iframe>`
        : `<div class="pb-splash">
            <div class="pb-splash-icon">${I.globe(28, 1.2)}</div>
            <div class="pb-splash-h">New Tab</div>
            <div class="pb-splash-sub">${esc(S.browserStatusText)}</div>
          </div>`}
      <div class="pb-status">
        <span class="pb-status-dot ${dotCls}"></span>
        <span class="pb-status-text">${esc(S.browserStatusText)}</span>
        ${S.proxyReady ? `<span style="margin-left:auto">Ultraviolet · ${BARE_URL.replace('wss://','').split('/')[0]}</span>` : ''}
      </div>`;
    // Animate open on next frame
    requestAnimationFrame(() => el.classList.add('open'));
    // Navigate iframe if we have a URL
    if (S.browserUrl) {
      setTimeout(() => navigateIframe(S.browserUrl), 80);
    }
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
      <div class="auth-overlay">
        <div class="auth-card">
          <button class="auth-close" data-action="auth-close">${I.x(14)}</button>
          <div class="auth-eyebrow"><span class="dot"></span> AGENTIZ · NETWORK ACCESS</div>
          <h2 class="auth-title">Sign in to continue</h2>
          <p class="auth-body">Connect to the Communications Network, sync your settings, and save your workspace across devices.</p>

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
            <div class="auth-tab ${S.authTab==='signin'?'active':''}" data-action="auth-tab" data-val="signin">Sign in</div>
            <div class="auth-tab ${S.authTab==='signup'?'active':''}" data-action="auth-tab" data-val="signup">Create account</div>
          </div>

          <div class="auth-form" id="auth-form">
            <div class="auth-field">
              <label>Email</label>
              <input id="auth-email" type="email" placeholder="you@example.com" value="${esc(S.authEmail)}" autocomplete="email">
            </div>
            <div class="auth-field">
              <label>Password</label>
              <input id="auth-pass" type="password" placeholder="••••••••" autocomplete="${isSignUp ? 'new-password' : 'current-password'}">
            </div>
            ${S.authErr ? `<div class="auth-err">${esc(S.authErr)}</div>` : ''}
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px" data-action="auth-submit">
              ${I.arrow(14)} ${isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div class="auth-foot">${I.shield(12)} End-to-end · no ads · no telemetry</div>
        </div>
      </div>`;
  }

  // ── Main render ────────────────────────────────────────────
  function render() {
    // Rail
    document.getElementById('rail').innerHTML = renderRail();
    // Sidebar
    renderSidebar();
    // Main content
    const view = document.getElementById('view');
    let html = '';

    if (S.rail === 'logo') {
      html = viewWelcome();
    } else if (S.rail === 'globe') {
      if (S.authUser) {
        if (!S.commsUser) S.commsUser = { name: S.authUser.displayName || S.authUser.email.split('@')[0] };
        html = viewComms();
      } else {
        html = viewGate();
      }
    } else if (S.rail === 'spark') {
      html = viewAgeniuz();
    } else if (S.rail === 'share') {
      html = viewCredits();
    } else if (S.rail === 'layers') {
      html = viewLog();
    } else if (S.rail === 'cube') {
      html = viewSandbox();
    } else if (S.rail === 'settings') {
      html = viewSettings();
    } else {
      // home rail — show dashboard or catalog
      html = S.nav === 'dashboard' ? viewDashboard() : viewCatalog();
    }

    view.innerHTML = html;
    renderAuthModal();
    afterRender();
  }

  // ── Post-render hooks ──────────────────────────────────────
  function afterRender() {
    // Count-up on welcome and dashboard
    if (S.rail === 'logo') {
      animateCount('stat-sessions', 340, 1200);
    }
    if (S.rail === 'home' && S.nav === 'dashboard') {
      animateCount('dash-count', 340, 900);
    }
    // Scroll comms thread to bottom
    if (S.rail === 'globe' && S.commsUser) {
      const stream = document.getElementById('thread-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }
    // Scroll AI stream to bottom
    if (S.rail === 'spark') {
      const stream = document.getElementById('ai-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }
    // Re-focus inputs
    if (S.rail === 'spark') {
      const inp = document.getElementById('ai-draft');
      // don't auto-focus, let user decide
    }
  }

  function animateCount(id, target, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    clearTimeout(S._countAnim);
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * ease);
      if (k < 1) S._countAnim = requestAnimationFrame(tick);
    };
    S._countAnim = requestAnimationFrame(tick);
  }

  // ── AI logic ───────────────────────────────────────────────
  function aiReply(q) {
    const lower = q.toLowerCase();
    if (lower.includes('proxy') || lower.includes('wifi'))
      return 'Right now Ultraviolet (uv-edge-04) is averaging 38 ms on the school subnet — fastest of your three. Rammerhead is healthy too if UV gets blocked. Want me to launch one?';
    if (lower.includes('game') || lower.includes('play') || lower.includes('juno'))
      return "Juno's online and free for the next 18 minutes. Chess is queued for both of you, or you could jump into Tetris co-op in the Arcade room.";
    if (lower.includes('timeout') || lower.includes('ultraviolet') || lower.includes('session'))
      return 'Two things stand out: your last UV session held a stale handshake for 42s before drop, and the school DNS rotated at 10:14. Try a fresh session — I can spin one up and watch the first ping.';
    if (lower.includes('summary') || lower.includes('week') || lower.includes('change'))
      return 'This week: 4 new tiles (3 games, 1 utility), bandwidth up 24%, and 2 sessions auto-closed for inactivity. Nothing flagged for review.';
    return 'Got it — let me look across your workspace. I\'ll cross-check your catalog, recent sessions, and friend activity, then pull the most relevant snippet.';
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
    }, 900);
  }

  // ── Event delegation ───────────────────────────────────────
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const val    = btn.dataset.val;

    switch (action) {
      case 'rail':
        S.rail = val;
        if (val === 'home') S.nav = 'dashboard';
        render();
        break;

      case 'nav':
        S.nav = val;
        render();
        break;

      case 'tree': {
        const id = btn.dataset.id;
        const isToggle = btn.dataset.toggle === 'true';
        if (isToggle && S.expanded.hasOwnProperty(id)) {
          S.expanded[id] = !S.expanded[id];
        }
        S.tree = id;
        S.nav = 'library';
        render();
        break;
      }

      case 'enter-dashboard':
        S.rail = 'home';
        S.nav = 'dashboard';
        render();
        break;

      case 'go-catalog':
        S.rail = 'home';
        S.nav = 'library';
        render();
        break;

      case 'launch-session':
        openModal('Start a new session', 'Pick a proxy, game or utility to start. Sessions auto-close after 30 minutes of inactivity.', 'Pick item', () => { showToast('Session started'); });
        break;

      case 'launch-item':
        openModal(
          `Launch ${btn.dataset.name}?`,
          `Open ${btn.dataset.name} (${btn.dataset.meta}) in a sandboxed session. Your activity stays local to this workspace.`,
          'Launch',
          () => { showToast('Session started'); }
        );
        break;

      case 'catalog-tab':
        S.catalogTab = val;
        render();
        break;

      case 'modal-close':
        closeModal();
        break;

      case 'modal-confirm':
        if (S.modal && S.modal.onConfirm) S.modal.onConfirm();
        closeModal();
        break;

      case 'comms-select':
        S.commsActive = btn.dataset.id;
        render();
        break;

      case 'comms-logout':
        S.commsUser = null;
        S.gateUser = '';
        S.gatePass = '';
        S.gateErr = false;
        render();
        break;

      case 'friend-accept':
        showToast('Friend request accepted');
        break;
      case 'friend-reject':
        showToast('Friend request declined');
        break;

      case 'ai-suggest':
        sendAiMessage(val);
        break;

      case 'log-filter':
        S.logFilter = val;
        render();
        break;

      case 'set-proxy':
        S.activeProxy = btn.dataset.id;
        render();
        break;

      case 'sb-preset':
        S.sbPreset = val;
        render();
        break;

      case 'sb-launch': {
        const preset = SANDBOX_PRESETS.find(p => p.id === S.sbPreset) || SANDBOX_PRESETS[0];
        const target = S.sbUrl.trim();
        if (!target) { showToast('Enter a URL first'); break; }
        S.sbRunning.unshift({ id: 's' + Date.now(), name: preset.name, host: preset.region, up: 'now', url: target });
        S.sbUrl = '';
        showToast(`${preset.name} sandbox launched`);
        render();
        // Open in browser overlay
        openBrowser(target);
        break;
      }

      case 'sb-close':
        S.sbRunning = S.sbRunning.filter(r => r.id !== btn.dataset.id);
        render();
        break;

      case 'set-appearance':
        S.appearance = val;
        applyTheme();
        render();
        break;

      case 'toggle-stealth':
        S.stealth = !S.stealth;
        render();
        break;

      case 'toggle-reduced':
        S.reducedMotion = !S.reducedMotion;
        render();
        break;

      case 'set-decoy':
        S.decoy = val;
        render();
        break;

      case 'ac-inc':
        S.autoclose = Math.min(120, S.autoclose + 5);
        render();
        break;

      case 'ac-dec':
        S.autoclose = Math.max(5, S.autoclose - 5);
        render();
        break;

      case 'panic':
        S.sbRunning = [];
        S.commsUser = null;
        showToast('Workspace wiped');
        render();
        break;

      // ── Auth ──────────────────────────────────────────────
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

      // ── Browser / proxy ────────────────────────────────────
      case 'browser-back':    browserBack(); break;
      case 'browser-forward': browserForward(); break;

      case 'browser-refresh': {
        const iframe = document.getElementById('proxy-iframe');
        if (iframe) iframe.src = iframe.src;
        break;
      }

      case 'browser-go': {
        const urlInput = document.getElementById('pb-url-input');
        browserGo(urlInput ? urlInput.value : S.browserUrl);
        break;
      }

      case 'browser-new':
        S.browserUrl = '';
        S.browserInputUrl = '';
        renderBrowserOverlay();
        break;

      case 'browser-close':
        closeBrowser();
        break;

      // ── Lumin games ────────────────────────────────────────
      case 'play-lumin':
        launchGame(btn.dataset.id);
        break;

      case 'lumin-page':
        loadLuminGames(parseInt(val, 10), S.luminQuery);
        break;

      // ── Sandbox launch → open in proxy browser ─────────────
      case 'toggle-proxy-games':
        S.proxyGames = !S.proxyGames;
        saveUserSettings();
        render();
        break;
    }
  });

  // ── Form submissions ───────────────────────────────────────
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.id === 'gate-form') {
      const user = (document.getElementById('gate-user')?.value || '').trim();
      const pass = (document.getElementById('gate-pass')?.value || '').trim();
      if (user && pass) {
        S.commsUser = { name: user.replace(/^@/, '') };
        S.gateUser = '';
        S.gatePass = '';
        S.gateErr = false;
        showToast('Connected to network');
        render();
      } else {
        S.gateErr = true;
        const card = document.getElementById('gate-card');
        if (card) {
          card.classList.remove('shake');
          void card.offsetWidth; // reflow to restart animation
          card.classList.add('shake');
          setTimeout(() => card.classList.remove('shake'), 400);
        }
        // re-render to show error text
        const view = document.getElementById('view');
        view.innerHTML = viewGate();
      }
      return;
    }

    if (form.id === 'comms-form') {
      const draft = S.commsDraft.trim();
      if (!draft) return;
      if (!S.commsThreads[S.commsActive]) S.commsThreads[S.commsActive] = [];
      const now = new Date();
      const t = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
      S.commsThreads[S.commsActive].push({ from:'me', text: draft, t });
      S.commsDraft = '';
      render();
      return;
    }

    if (form.id === 'ai-form') {
      sendAiMessage();
      return;
    }
  });

  // ── Live input sync ────────────────────────────────────────
  document.addEventListener('input', (e) => {
    const id = e.target.id;
    const val = e.target.value;

    if (id === 'sidebar-search') {
      S.search = val;
      // Just update sidebar, not full render
      renderSidebar();
      return;
    }
    if (id === 'comms-draft') {
      S.commsDraft = val;
      // Update send button state without full re-render
      const sendBtn = document.querySelector('#comms-form button[type="submit"]');
      if (sendBtn) sendBtn.disabled = !val.trim();
      return;
    }
    if (id === 'ai-draft') {
      S.aiDraft = val;
      const sendBtn = document.querySelector('#ai-form button[type="submit"]');
      if (sendBtn) sendBtn.disabled = !val.trim();
      return;
    }
    if (id === 'log-query') {
      S.logQuery = val;
      // Re-render just the log stream
      const logStream = document.querySelector('.log-stream');
      if (!logStream) return;
      const kindMap = { Sessions:'session', Comms:'comms', Auth:'auth', Catalog:'catalog', Network:'network' };
      const visible = LOG_ENTRIES.filter(e2 => {
        if (S.logFilter !== 'All' && e2.kind !== kindMap[S.logFilter]) return false;
        if (val.trim() && !`${e2.actor} ${e2.text}`.toLowerCase().includes(val.toLowerCase())) return false;
        return true;
      });
      logStream.innerHTML = visible.length === 0
        ? '<div class="log-empty">No entries match your filter.</div>'
        : visible.map(e2 => `
          <div class="log-entry lvl-${e2.lvl}">
            <div class="log-time">${esc(e2.t)}</div>
            <div class="log-kind">${esc(e2.kind)}</div>
            <div class="log-actor">${esc(e2.actor)}</div>
            <div class="log-text">${esc(e2.text)}</div>
            <button class="log-more">${I.more(14)}</button>
          </div>`).join('');
      return;
    }
    if (id === 'sb-url') {
      S.sbUrl = val;
      return;
    }
    if (id === 'pb-url-input') {
      S.browserInputUrl = val;
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
    if (id === 'catalog-search-inp') {
      S.luminSearch = val;
      return;
    }
  });

  // ── Keyboard shortcuts ─────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    // ⌘/Ctrl+K → sidebar search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const inp = document.getElementById('sidebar-search');
      if (inp) inp.focus();
      return;
    }
    // Enter in browser URL bar → navigate
    if (e.key === 'Enter' && e.target.id === 'pb-url-input') {
      browserGo(e.target.value);
      return;
    }
    // Enter in catalog search → Lumin search
    if (e.key === 'Enter' && e.target.id === 'catalog-search-inp') {
      S.luminQuery = e.target.value;
      loadLuminGames(1, S.luminQuery);
      return;
    }
    // Escape → close browser overlay or auth modal
    if (e.key === 'Escape') {
      if (S.browserOpen) { closeBrowser(); return; }
      if (S.authModal) { S.authModal = false; renderAuthModal(); return; }
    }
  });

  // ── Dark mode media query listener ────────────────────────
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (S.appearance === 'auto') applyTheme();
    });
  }

  // ── Boot ───────────────────────────────────────────────────
  // Set up UV config in main thread (uv.bundle.js must be loaded first)
  if (window.Ultraviolet) {
    window.__uv$config = {
      prefix: '/uv/',
      encodeUrl: Ultraviolet.codec.xor.encode,
      decodeUrl: Ultraviolet.codec.xor.decode,
    };
  }

  applyTheme();
  render();

  // Async inits — run in background after first render
  initFirebase();
  initProxy();
  initLumin();

})();
