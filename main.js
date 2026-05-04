/**
 * Agentiz — Main Process (Electron)
 * Floating pill widget with proximity-based opacity control.
 * Window morphs from a small pill to a full side panel on click.
 */

const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  screen,
  nativeImage
} = require('electron');
const path  = require('path');
const fs    = require('fs');
const https = require('https');
const { exec } = require('child_process');
const os    = require('os');

// electron-store v8 — CommonJS require
const Store = require('electron-store');
const store = new Store({ encryptionKey: 'agentiz-secure-v1' });

// ─── Constants ────────────────────────────────────────────────────────────────

const FLOATING_WIDTH  = 60;    // pill window width (px)
const FLOATING_HEIGHT = 160;   // pill window height (px)
const EXPANDED_WIDTH  = 440;   // full panel width (px)
const ANIM_STEPS      = 18;    // frames for setBounds animation
const ANIM_INTERVAL   = 12;    // ms per frame (~83 fps)
const CURSOR_POLL_MS  = 60;    // how often to check cursor position
const PROX_FAR        = 250;   // outer proximity zone (px from right edge)
const PROX_NEAR       = 80;    // inner zone — full opacity (px from right edge)
const PROX_Y_FAR      = 400;   // vertical proximity half-height (outer)
const PROX_Y_NEAR     = 200;   // vertical proximity half-height (inner)
const LINGER_MS       = 2000;  // how long pill stays after cursor leaves

// ─── State ────────────────────────────────────────────────────────────────────

let mainWindow      = null;
let tray            = null;
let animTimer       = null;
let cursorPollTimer = null;
let lingerTimer     = null;
let isExpanded      = false;
let currentOpacity  = 0;

// ─── Window creation ─────────────────────────────────────────────────────────

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: sw, height: sh } = primaryDisplay.workAreaSize;

  // Position: right edge, vertically centered
  const x = sw - FLOATING_WIDTH - 8;
  const y = Math.round((sh - FLOATING_HEIGHT) / 2);

  mainWindow = new BrowserWindow({
    width:           FLOATING_WIDTH,
    height:          FLOATING_HEIGHT,
    x,
    y,
    frame:           false,
    transparent:     true,           // needed for pill rounded corners
    backgroundColor: '#00000000',    // fully transparent backing
    alwaysOnTop:     true,
    resizable:       false,
    skipTaskbar:     true,
    hasShadow:       false,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
      sandbox:          false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.setMenuBarVisibility(false);

  // Start invisible — cursor polling controls opacity
  mainWindow.setOpacity(0);
  // Ignore mouse events when fully invisible so clicks pass through
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  // Re-anchor to right edge if display metrics change
  screen.on('display-metrics-changed', () => {
    if (!mainWindow || mainWindow.isDestroyed() || isExpanded) return;
    const { width: nw, height: nh } = screen.getPrimaryDisplay().workAreaSize;
    const nx = nw - FLOATING_WIDTH - 8;
    const ny = Math.round((nh - FLOATING_HEIGHT) / 2);
    mainWindow.setBounds({ x: nx, y: ny, width: FLOATING_WIDTH, height: FLOATING_HEIGHT });
  });
}

// ─── Opacity control ─────────────────────────────────────────────────────────

function setOpacity(opacity) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  currentOpacity = opacity;
  mainWindow.setOpacity(opacity);
  // Pass through mouse events when essentially invisible
  const ignore = opacity < 0.05;
  mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
}

// ─── Linger timer helpers ─────────────────────────────────────────────────────

function clearLinger() {
  if (lingerTimer) { clearTimeout(lingerTimer); lingerTimer = null; }
}

function armLinger() {
  clearLinger();
  lingerTimer = setTimeout(() => {
    if (!isExpanded) setOpacity(0);
  }, LINGER_MS);
}

// ─── Cursor proximity polling ─────────────────────────────────────────────────

function startCursorPolling() {
  if (cursorPollTimer) return; // already running

  cursorPollTimer = setInterval(() => {
    if (isExpanded) return; // skip polling — panel is open

    const cursor  = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursor);
    const rightEdge   = display.bounds.x + display.bounds.width;
    const distFromRight = rightEdge - cursor.x;

    // Vertical distance from pill center
    const pillCenterY   = display.bounds.y + Math.round(display.bounds.height / 2);
    const distFromPillY = Math.abs(cursor.y - pillCenterY);

    const inNearZone = distFromRight <= PROX_NEAR  && distFromPillY <= PROX_Y_NEAR;
    const inFarZone  = distFromRight <= PROX_FAR   && distFromPillY <= PROX_Y_FAR;

    if (inNearZone) {
      // Full visibility — reset linger so pill stays while cursor dwells here
      setOpacity(1);
      clearLinger();
      armLinger();
    } else if (inFarZone) {
      // Linear ramp between PROX_FAR and PROX_NEAR
      const t = 1 - ((distFromRight - PROX_NEAR) / (PROX_FAR - PROX_NEAR));
      const targetOpacity = Math.max(0.05, Math.min(0.9, t));
      setOpacity(targetOpacity);
      clearLinger();
    }
    // Out of all zones: do nothing — linger timer handles fade-out naturally
  }, CURSOR_POLL_MS);
}

function stopCursorPolling() {
  if (cursorPollTimer) { clearInterval(cursorPollTimer); cursorPollTimer = null; }
}

// ─── Smooth animation (setBounds interpolation) ────────────────────────────────

function animateBounds(targetBounds, onComplete) {
  if (animTimer) clearInterval(animTimer);
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const startBounds = mainWindow.getBounds();
  let step = 0;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  animTimer = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      clearInterval(animTimer); animTimer = null; return;
    }

    step++;
    const t     = Math.min(step / ANIM_STEPS, 1);
    const eased = easeOutCubic(t);

    const bounds = {
      x:      Math.round(startBounds.x      + (targetBounds.x      - startBounds.x)      * eased),
      y:      Math.round(startBounds.y      + (targetBounds.y      - startBounds.y)      * eased),
      width:  Math.round(startBounds.width  + (targetBounds.width  - startBounds.width)  * eased),
      height: Math.round(startBounds.height + (targetBounds.height - startBounds.height) * eased)
    };

    mainWindow.setBounds(bounds);

    if (step >= ANIM_STEPS) {
      clearInterval(animTimer);
      animTimer = null;
      mainWindow.setBounds(targetBounds); // snap to exact target
      if (onComplete) onComplete();
    }
  }, ANIM_INTERVAL);
}

// ─── Expand panel ─────────────────────────────────────────────────────────────

function expandPanel() {
  if (isExpanded) return;
  isExpanded = true;
  clearLinger();
  stopCursorPolling();
  setOpacity(1);

  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;

  animateBounds({
    x:      sw - EXPANDED_WIDTH,
    y:      0,
    width:  EXPANDED_WIDTH,
    height: sh
  });
}

// ─── Collapse panel ────────────────────────────────────────────────────────────

function collapsePanel() {
  if (!isExpanded) return;

  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  const targetX = sw - FLOATING_WIDTH - 8;
  const targetY = Math.round((sh - FLOATING_HEIGHT) / 2);

  animateBounds(
    { x: targetX, y: targetY, width: FLOATING_WIDTH, height: FLOATING_HEIGHT },
    () => {
      isExpanded = false;
      // Brief linger so pill stays visible, then polling takes over
      armLinger();
      startCursorPolling();
    }
  );
}

// ─── System tray ─────────────────────────────────────────────────────────────

function createTray() {
  const candidates = [
    path.join(__dirname, 'assets', 'tray-icon.png'),
    path.join(__dirname, 'assets', 'icon.png')
  ];

  let icon;
  for (const p of candidates) {
    try {
      const candidate = nativeImage.createFromPath(p);
      if (!candidate.isEmpty()) { icon = candidate; break; }
    } catch { /* skip */ }
  }

  if (!icon) {
    icon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABSSURBVDiNY2AYBYMHMDIy/mdgYPjPQKJmkgxgJFEzSQYwkqiZJAMYSdRMkgGMJGomyQBGEjWTZAAjiZpJMoCRRM0kGcBIomaSDGAkUTMpBgMAO+4GnzV3MWIAAAAASUVORK5CYII='
    );
  }

  tray = new Tray(icon);
  tray.setToolTip('Agentiz');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Agentiz',
      click: () => {
        if (mainWindow) expandPanel();
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => { if (mainWindow) expandPanel(); });
}

// ─── Helper: HTTPS POST → parsed JSON ────────────────────────────────────────

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const options = {
      hostname,
      path,
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(new Error('Request timed out')); });
    req.write(bodyStr);
    req.end();
  });
}

// ─── IPC handlers ─────────────────────────────────────────────────────────────

// Panel state control
ipcMain.on('panel-expand',   () => expandPanel());
ipcMain.on('panel-collapse', () => collapsePanel());

// Legacy peek/unpeel handlers — kept for IPC name compatibility (no-ops in new model)
ipcMain.on('panel-peek',   () => {});
ipcMain.on('panel-unpeel', () => {});

// ── Secure store ──────────────────────────────────────────────────────────────
ipcMain.handle('store-get',    (_e, key)        => store.get(key));
ipcMain.handle('store-set',    (_e, key, value) => store.set(key, value));
ipcMain.handle('store-delete', (_e, key)        => store.delete(key));

// ── AI Chat ───────────────────────────────────────────────────────────────────
ipcMain.handle('ai-chat', async (_e, { provider, apiKey, messages, model }) => {
  try {
    if (!apiKey || !apiKey.trim()) {
      return { content: null, error: 'No API key configured. Add your key in the Settings tab.' };
    }

    let result;

    if (provider === 'claude') {
      const resp = await httpsPost(
        'api.anthropic.com',
        '/v1/messages',
        {
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01'
        },
        {
          model:      model || 'claude-opus-4-7',
          max_tokens: 2048,
          messages
        }
      );
      if (resp.status !== 200) {
        const errMsg = resp.body?.error?.message || JSON.stringify(resp.body);
        return { content: null, error: `Anthropic API error ${resp.status}: ${errMsg}` };
      }
      result = resp.body?.content?.[0]?.text ?? '';

    } else if (provider === 'chatgpt') {
      const resp = await httpsPost(
        'api.openai.com',
        '/v1/chat/completions',
        { 'Authorization': `Bearer ${apiKey}` },
        {
          model:      model || 'gpt-4o',
          messages,
          max_tokens: 2048
        }
      );
      if (resp.status !== 200) {
        const errMsg = resp.body?.error?.message || JSON.stringify(resp.body);
        return { content: null, error: `OpenAI API error ${resp.status}: ${errMsg}` };
      }
      result = resp.body?.choices?.[0]?.message?.content ?? '';

    } else if (provider === 'gemini') {
      const contents = messages.map(m => ({
        role:  m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const resp = await httpsPost(
        'generativelanguage.googleapis.com',
        `/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {},
        { contents }
      );
      if (resp.status !== 200) {
        const errMsg = resp.body?.error?.message || JSON.stringify(resp.body);
        return { content: null, error: `Gemini API error ${resp.status}: ${errMsg}` };
      }
      result = resp.body?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    } else {
      return { content: null, error: `Unknown provider: ${provider}` };
    }

    return { content: result, error: null };
  } catch (err) {
    return { content: null, error: err.message || String(err) };
  }
});

// ── VS Code detection ─────────────────────────────────────────────────────────
ipcMain.handle('vscode-status', () => {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    let cmd;
    if (isWin) {
      cmd = 'tasklist /FI "IMAGENAME eq Code.exe" /NH 2>nul';
    } else {
      cmd = 'ps aux | grep -E "(code|code-oss|vscode|Code)" | grep -v grep | grep -v agentiz';
    }

    exec(cmd, { timeout: 3000 }, (err, stdout) => {
      if (err && !stdout) { resolve(false); return; }
      const out = (stdout || '').toLowerCase();
      const detected = isWin
        ? out.includes('code.exe')
        : /\/(code|code-oss)\b/.test(out) || out.includes('vscode-electron');
      resolve(detected);
    });
  });
});

// ── File system ───────────────────────────────────────────────────────────────
ipcMain.handle('read-file', async (_event, filePath) => {
  try {
    const resolved = path.resolve(filePath);
    const stat     = fs.statSync(resolved);
    if (stat.size > 512 * 1024) {
      return { error: 'File too large to preview (> 512 KB)', content: null };
    }
    const content = fs.readFileSync(resolved, 'utf8');
    return { error: null, content };
  } catch (e) {
    return { error: e.message, content: null };
  }
});

ipcMain.handle('list-directory', async (_event, dirPath) => {
  try {
    const resolved = path.resolve(dirPath);
    const entries  = fs.readdirSync(resolved, { withFileTypes: true });
    return {
      error:   null,
      entries: entries.map(e => ({ name: e.name, isDir: e.isDirectory() }))
    };
  } catch (e) {
    return { error: e.message, entries: [] };
  }
});

ipcMain.handle('get-home-dir', () => os.homedir());

ipcMain.handle('write-file', async (_event, filePath, content) => {
  try {
    const home     = os.homedir();
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(home)) {
      return { error: 'Write access is limited to your home directory.' };
    }
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, content, 'utf8');
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
});

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();
  createTray();
  // Start polling after window is ready so display APIs return real values
  mainWindow.once('ready-to-show', () => {
    startCursorPolling();
  });
});

app.on('window-all-closed', () => {
  // Keep running in tray on all platforms
});

app.on('activate', () => {
  if (!mainWindow || mainWindow.isDestroyed()) createWindow();
});
