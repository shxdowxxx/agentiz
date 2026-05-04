/**
 * Agentiz — Renderer Process
 * Floating pill / full panel UI.
 * Panel UI: pill → expanded, tabs, VS Code detection, real AI chat,
 * auto-debounced prompt analysis, settings/keys, context file wizard, guide.
 */

'use strict';

// ─── Mode attribute (pill | expanded) ───────────────────────────────────────
//
// body[data-mode="pill"]     → floating pill is visible, panel is hidden
// body[data-mode="expanded"] → panel is visible, pill is hidden
//
// CSS drives all visibility; these JS functions just toggle the attribute
// and fire the IPC call to resize the Electron window.

document.body.setAttribute('data-mode', 'pill');
document.getElementById('panel').setAttribute('aria-hidden', 'true');

// ─── Floating pill ───────────────────────────────────────────────────────────

const floatingPill = document.getElementById('floating-pill');

floatingPill.addEventListener('click', (e) => {
  // If user clicked the gear icon specifically, expand AND switch to settings
  const isSettings = !!e.target.closest('[data-action="settings"]');
  expandPanel();
  if (isSettings) {
    // Brief delay to let the panel render before switching tabs
    setTimeout(() => {
      const settingsTab = document.querySelector('.tab[data-tab="settings"]');
      if (settingsTab) settingsTab.click();
    }, 80);
  }
});

floatingPill.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    expandPanel();
  }
});

// ─── Expand / collapse ───────────────────────────────────────────────────────

function expandPanel() {
  document.body.setAttribute('data-mode', 'expanded');
  document.getElementById('panel').setAttribute('aria-hidden', 'false');
  window.agentiz.expand();
  refreshVSCodeStatus();
  updateChatStatusPill();
}

function collapsePanel() {
  document.body.setAttribute('data-mode', 'pill');
  document.getElementById('panel').setAttribute('aria-hidden', 'true');
  window.agentiz.collapse();
}

document.getElementById('collapse-btn').addEventListener('click', collapsePanel);

// ─── Tab switching ───────────────────────────────────────────────────────────

const tabs   = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === target);
      t.setAttribute('aria-selected', t.dataset.tab === target);
    });
    panels.forEach(p => {
      const active = p.id === `tab-${target}`;
      p.classList.toggle('active', active);
      p.hidden = !active;
    });
    if (target === 'files')    initFilesTab();
    if (target === 'settings') initSettingsTab();
  });
});

// ─── VS Code status ──────────────────────────────────────────────────────────

const vsDot   = document.getElementById('vscode-dot');
const vsLabel = document.getElementById('vscode-label');

async function refreshVSCodeStatus() {
  try {
    const detected = await window.agentiz.checkVSCode();
    if (detected) {
      vsDot.className     = 'status-dot online';
      vsLabel.textContent = 'VS Code open';
    } else {
      vsDot.className     = 'status-dot offline';
      vsLabel.textContent = 'VS Code not open';
    }
  } catch {
    vsDot.className     = 'status-dot offline';
    vsLabel.textContent = 'Status unknown';
  }
}

// Poll every 8 seconds — only meaningful when panel is expanded
setInterval(() => {
  if (document.body.getAttribute('data-mode') === 'expanded') {
    refreshVSCodeStatus();
  }
}, 8_000);

// Run once on load so badge is populated when panel first opens
refreshVSCodeStatus();

// ─────────────────────────────────────────────────────────────────────────────
//  TAB 1 — CHAT (real AI via IPC, uses stored API keys)
// ─────────────────────────────────────────────────────────────────────────────

(function initChatTab() {
  const messageList = document.getElementById('message-list');
  const chatInput   = document.getElementById('chat-input');
  const sendBtn     = document.getElementById('send-btn');
  const providerSel = document.getElementById('provider-select');
  const hintBar     = document.getElementById('chat-hint-bar');
  const hintText    = document.getElementById('chat-hint-text');

  // In-memory conversation history for context
  const conversationHistory = [];

  // Welcome message
  appendMessage('assistant',
    'Welcome to Agentiz. Add your API key in Settings, then select a provider above and start chatting.'
  );

  // Update the status pill when provider selection changes
  providerSel.addEventListener('change', updateChatStatusPill);

  // ── Send message ─────────────────────────────────────────────────────────

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    const provider = providerSel.value;
    const apiKey   = await window.agentiz.storeGet(`apiKey_${provider}`);

    if (!apiKey) {
      appendMessage('system', 'No API key for this provider. Add one in the Settings tab.');
      return;
    }

    conversationHistory.push({ role: 'user', content: text });
    appendMessage('user', text);
    chatInput.value        = '';
    chatInput.style.height = 'auto';

    hintBar.hidden = true;

    const typingEl = appendTyping();

    sendBtn.disabled   = true;
    chatInput.disabled = true;

    try {
      const resp = await window.agentiz.aiChat({
        provider,
        apiKey,
        messages: conversationHistory.slice()
      });

      typingEl.remove();

      if (resp.error) {
        appendMessage('system', `Error: ${resp.error}`);
      } else {
        conversationHistory.push({ role: 'assistant', content: resp.content });
        appendMessage('assistant', resp.content);
      }
    } catch (err) {
      typingEl.remove();
      appendMessage('system', `Unexpected error: ${err.message}`);
    } finally {
      sendBtn.disabled   = false;
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  // ── Message rendering ────────────────────────────────────────────────────

  function appendMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `message ${role}`;

    if (role !== 'system') {
      const roleLabel       = document.createElement('div');
      roleLabel.className   = 'message-role';
      roleLabel.textContent = role === 'user'
        ? 'You'
        : providerSel.options[providerSel.selectedIndex].text;
      wrap.appendChild(roleLabel);
    }

    const bubble       = document.createElement('div');
    bubble.className   = 'message-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);

    messageList.appendChild(wrap);
    messageList.scrollTop = messageList.scrollHeight;
    return wrap;
  }

  function appendTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'message assistant typing';

    const roleLabel       = document.createElement('div');
    roleLabel.className   = 'message-role';
    roleLabel.textContent = providerSel.options[providerSel.selectedIndex].text;
    wrap.appendChild(roleLabel);

    const bubble     = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    wrap.appendChild(bubble);

    messageList.appendChild(wrap);
    messageList.scrollTop = messageList.scrollHeight;
    return wrap;
  }

  // ── Auto-resize textarea ─────────────────────────────────────────────────

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
    debounceChatHint();
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  sendBtn.addEventListener('click', handleSend);

  // ── Inline Grammarly-style hint bar (debounced 800ms) ────────────────────

  let hintTimer = null;

  function debounceChatHint() {
    clearTimeout(hintTimer);
    const text = chatInput.value.trim();
    if (!text || text.length < 10) { hintBar.hidden = true; return; }
    hintTimer = setTimeout(() => {
      const hint = computeQuickHint(text);
      if (hint) {
        hintText.textContent = hint;
        hintBar.hidden       = false;
      } else {
        hintBar.hidden = true;
      }
    }, 800);
  }

  /**
   * Returns a single short hint string, or null if the prompt looks fine.
   */
  function computeQuickHint(text) {
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length < 5) return null; // too short to hint meaningfully

    const codeKw = /\b(function|code|write|build|implement|refactor|debug|fix|script|component|api|endpoint)\b/i;
    const langKw = /\b(javascript|typescript|python|rust|go|java|css|html|sql|bash|react|vue|swift|kotlin|php|c\+\+)\b/i;
    if (codeKw.test(text) && !langKw.test(text)) {
      return 'Tip: add a language, e.g. "in TypeScript"';
    }

    const vague = /^\s*(help|do|make|fix everything|stuff|something)\b/i;
    if (vague.test(text)) {
      return 'Tip: replace vague openers with specific verbs like "generate", "refactor", "explain"';
    }

    return null;
  }
})();

// ── Update chat status pill based on stored key ──────────────────────────────

async function updateChatStatusPill() {
  const pill     = document.getElementById('chat-status-pill');
  const provider = document.getElementById('provider-select').value;
  const key      = await window.agentiz.storeGet(`apiKey_${provider}`);
  if (key) {
    pill.textContent = 'Key saved';
    pill.className   = 'status-pill has-key';
  } else {
    pill.textContent = 'No key';
    pill.className   = 'status-pill no-key';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  TAB 2 — PROMPT (auto-debounced analysis, no button)
// ─────────────────────────────────────────────────────────────────────────────

(function initPromptTab() {
  const promptTextarea = document.getElementById('prompt-textarea');
  const resultsArea    = document.getElementById('prompt-results');
  const analyzingEl    = document.getElementById('prompt-analyzing');

  let debounceTimer = null;

  promptTextarea.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const text = promptTextarea.value.trim();

    if (!text) {
      analyzingEl.hidden = true;
      showPlaceholder('Start typing above — analysis appears automatically.');
      return;
    }

    analyzingEl.hidden    = false;
    resultsArea.innerHTML = '';

    debounceTimer = setTimeout(() => {
      analyzingEl.hidden = true;
      runPromptCheck(text);
    }, 600);
  });

  // ── Heuristic analysis ───────────────────────────────────────────────────

  function runPromptCheck(text) {
    const issues = [];
    const words  = text.split(/\s+/).filter(Boolean);

    if (words.length < 8) {
      issues.push({
        type: 'warning', icon: '⚠',
        title: 'Too short',
        desc: 'Prompts under 8 words rarely give the AI enough context. Add what you want, why you need it, and any constraints.'
      });
    }

    const codeKw = /\b(function|class|code|write|build|implement|refactor|debug|fix|script|component|api|endpoint|query|loop|array|object)\b/i;
    const langKw = /\b(javascript|typescript|python|rust|go|java|css|html|sql|bash|react|vue|swift|kotlin|c\+\+|php)\b/i;
    if (codeKw.test(text) && !langKw.test(text)) {
      issues.push({
        type: 'warning', icon: '⚠',
        title: 'No language specified',
        desc: 'Looks like a coding prompt, but you haven\'t named the language or framework. Add e.g. "in TypeScript" or "using React 18".'
      });
    }

    const outputKw = /\b(return|output|result|expect|should|must|want|need|give me|produce|generate)\b/i;
    if (!outputKw.test(text)) {
      issues.push({
        type: 'warning', icon: '⚠',
        title: 'Missing expected output',
        desc: 'Tell the AI what the end result should look like — e.g. "return a JSON array", "output a 200-word paragraph".'
      });
    }

    const vagueVerbs = /\b(do|make|help|stuff|things|something|somehow|whatever)\b/i;
    if (vagueVerbs.test(text)) {
      issues.push({
        type: 'warning', icon: '⚠',
        title: 'Vague language detected',
        desc: 'Words like "help", "make", or "do something" leave too much to interpretation. Use precise verbs: "generate", "refactor", "explain".'
      });
    }

    if (words.length > 250) {
      issues.push({
        type: 'info', icon: 'ℹ',
        title: 'Long prompt',
        desc: 'Prompts over 250 words can dilute focus. Consider splitting into smaller requests or using a system prompt for context.'
      });
    }

    const roleKw = /\b(you are|act as|as an? |pretend|role|expert|senior|professional)\b/i;
    if (!roleKw.test(text) && words.length > 20) {
      issues.push({
        type: 'info', icon: 'ℹ',
        title: 'Consider adding role context',
        desc: 'Framing the AI with a role ("You are a senior backend engineer…") often improves response quality for technical prompts.'
      });
    }

    if (words.length >= 20 && langKw.test(text) && outputKw.test(text)) {
      issues.push({
        type: 'ok', icon: '✓',
        title: 'Good structure',
        desc: 'Your prompt includes a technology context and describes the expected output — both strong signals for high-quality responses.'
      });
    }

    if (text.trim().endsWith('?') && words.length >= 10) {
      issues.push({
        type: 'ok', icon: '✓',
        title: 'Clear question format',
        desc: 'Ending with a question mark keeps the intent clear and helps the AI know it should answer directly.'
      });
    }

    let score = 50;
    score -= issues.filter(i => i.type === 'warning').length * 14;
    score += issues.filter(i => i.type === 'ok').length * 18;
    if (words.length >= 15 && words.length <= 120) score += 8;
    score = Math.max(0, Math.min(100, score));

    renderResults(issues, score);
  }

  function renderResults(issues, score) {
    resultsArea.innerHTML = '';

    const scoreRow = document.createElement('div');
    scoreRow.className = 'prompt-score-row';
    scoreRow.innerHTML = `
      <span class="prompt-score-label">Score</span>
      <div class="prompt-score-bar-track">
        <div class="prompt-score-bar-fill" style="width: 0%"></div>
      </div>
      <span class="prompt-score-value">${score}</span>
    `;
    resultsArea.appendChild(scoreRow);

    requestAnimationFrame(() => {
      const fill = scoreRow.querySelector('.prompt-score-bar-fill');
      if (score >= 70)      fill.style.background = 'var(--success)';
      else if (score >= 45) fill.style.background = 'var(--warning)';
      else                  fill.style.background = 'var(--error)';
      requestAnimationFrame(() => { fill.style.width = `${score}%`; });
    });

    issues.forEach((issue, idx) => {
      const card = document.createElement('div');
      card.className = `feedback-card ${issue.type}`;
      card.style.animationDelay = `${idx * 0.06}s`;
      card.innerHTML = `
        <span class="feedback-icon">${issue.icon}</span>
        <div class="feedback-body">
          <div class="feedback-title">${escHtml(issue.title)}</div>
          <div class="feedback-desc">${escHtml(issue.desc)}</div>
        </div>
      `;
      resultsArea.appendChild(card);
    });

    if (issues.length === 0) {
      const ok = document.createElement('div');
      ok.className = 'feedback-card ok';
      ok.innerHTML = `
        <span class="feedback-icon">✓</span>
        <div class="feedback-body">
          <div class="feedback-title">Looks solid</div>
          <div class="feedback-desc">No major issues detected. Your prompt has good coverage.</div>
        </div>
      `;
      resultsArea.appendChild(ok);
    }
  }

  function showPlaceholder(msg) {
    resultsArea.innerHTML = `<p class="results-placeholder">${escHtml(msg)}</p>`;
  }
})();

// ─────────────────────────────────────────────────────────────────────────────
//  TAB 3 — FILES
// ─────────────────────────────────────────────────────────────────────────────

let filesInitialized = false;
let currentDir       = '';
let dirHistory       = [];
let homeDir          = '';

async function initFilesTab() {
  if (filesInitialized) return;
  filesInitialized = true;

  try {
    homeDir    = await window.agentiz.getHomeDir();
    currentDir = homeDir;
  } catch {
    homeDir    = '/home';
    currentDir = homeDir;
  }

  updateFilesPath(currentDir);
  await loadDirectory(currentDir);
}

function updateFilesPath(dir) {
  const el    = document.getElementById('files-path');
  let display = dir;
  if (homeDir && dir.startsWith(homeDir)) {
    display = '~' + dir.slice(homeDir.length);
  }
  el.textContent = display || '/';
  el.title       = dir;
  document.getElementById('files-up-btn').disabled = (dir === '/');
}

async function loadDirectory(dirPath) {
  const listEl     = document.getElementById('file-list');
  listEl.innerHTML = '<div class="file-list-loading">Loading…</div>';
  hidePreview();

  const { error, entries } = await window.agentiz.listDir(dirPath);

  if (error) {
    listEl.innerHTML = `<div class="error-text">${escHtml(error)}</div>`;
    return;
  }

  if (!entries || entries.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <span class="es-icon">📂</span>
        <span class="es-text">This directory is empty.</span>
      </div>`;
    return;
  }

  const sorted  = [...entries].sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
  const visible = sorted.filter(e => !e.name.startsWith('.') || dirPath.includes('/.'));

  listEl.innerHTML = '';

  visible.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.role      = 'listitem';
    item.setAttribute('aria-label', entry.isDir ? `Directory: ${entry.name}` : `File: ${entry.name}`);

    const icon       = document.createElement('span');
    icon.className   = `file-icon${entry.isDir ? ' dir' : ''}`;
    icon.textContent = entry.isDir ? '▸' : fileIcon(entry.name);
    icon.setAttribute('aria-hidden', 'true');

    const name       = document.createElement('span');
    name.className   = `file-name${entry.isDir ? ' dir' : ''}`;
    name.textContent = entry.name;

    item.appendChild(icon);
    item.appendChild(name);

    item.addEventListener('click', () => {
      const fullPath = `${dirPath}/${entry.name}`.replace('//', '/');
      if (entry.isDir) {
        dirHistory.push(dirPath);
        currentDir = fullPath;
        updateFilesPath(fullPath);
        loadDirectory(fullPath);
        document.getElementById('files-up-btn').disabled = false;
      } else {
        previewFile(fullPath, entry.name);
      }
    });

    listEl.appendChild(item);
  });
}

document.getElementById('files-up-btn').addEventListener('click', () => {
  if (dirHistory.length > 0) {
    const prev = dirHistory.pop();
    currentDir = prev;
    updateFilesPath(prev);
    loadDirectory(prev);
    document.getElementById('files-up-btn').disabled = (dirHistory.length === 0);
  } else {
    const parent = currentDir.split('/').slice(0, -1).join('/') || '/';
    currentDir   = parent;
    updateFilesPath(parent);
    loadDirectory(parent);
  }
});

async function previewFile(filePath, fileName) {
  const previewEl  = document.getElementById('file-preview');
  const contentEl  = document.getElementById('preview-content');
  const filenameEl = document.getElementById('preview-filename');

  filenameEl.textContent = fileName;
  contentEl.textContent  = 'Loading…';
  previewEl.hidden       = false;

  const { error, content } = await window.agentiz.readFile(filePath);
  contentEl.textContent    = error ? `Error: ${error}` : (content ?? '(empty file)');
}

function hidePreview() {
  document.getElementById('file-preview').hidden = true;
  document.getElementById('preview-content').textContent = '';
}

document.getElementById('preview-close').addEventListener('click', hidePreview);

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const map = {
    js:'·js', ts:'·ts', jsx:'·jsx', tsx:'·tsx', html:'·htm', css:'·css',
    json:'·jsn', md:'·md', py:'·py', rs:'·rs', go:'·go', sh:'·sh',
    txt:'·txt', yml:'·yml', yaml:'·yml', env:'·env', png:'·img', jpg:'·img',
    svg:'·svg', gif:'·img', mp3:'·mp3', mp4:'·mp4', pdf:'·pdf', zip:'·zip',
    sql:'·sql', lua:'·lua', rb:'·rb', php:'·php', c:'·c', cpp:'·cpp',
    h:'·h', cs:'·cs'
  };
  return map[ext] ?? '·';
}

// ─────────────────────────────────────────────────────────────────────────────
//  TAB 4 — SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

let settingsInitialized = false;

async function initSettingsTab() {
  if (settingsInitialized) return;
  settingsInitialized = true;

  // ── Load stored keys into inputs ─────────────────────────────────────────
  const providers = ['claude', 'chatgpt', 'gemini'];
  for (const p of providers) {
    const stored = await window.agentiz.storeGet(`apiKey_${p}`);
    if (stored) {
      const input = document.querySelector(`.key-input[data-key="${p}"]`);
      if (input) input.value = stored;
      setKeyStatus(p, 'saved', 'Saved');
    }
  }

  // ── Save buttons ─────────────────────────────────────────────────────────
  document.querySelectorAll('.key-save-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const provider = btn.dataset.save;
      const input    = document.querySelector(`.key-input[data-key="${provider}"]`);
      const key      = input ? input.value.trim() : '';
      if (!key) {
        await window.agentiz.storeDelete(`apiKey_${provider}`);
        setKeyStatus(provider, '', '');
        updateChatStatusPill();
        return;
      }
      await window.agentiz.storeSet(`apiKey_${provider}`, key);
      setKeyStatus(provider, 'ok', 'Saved');
      updateChatStatusPill();
    });
  });

  // ── Test buttons ─────────────────────────────────────────────────────────
  document.querySelectorAll('.key-test-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const provider = btn.dataset.test;
      const input    = document.querySelector(`.key-input[data-key="${provider}"]`);
      const key      = input ? input.value.trim() : '';
      if (!key) { setKeyStatus(provider, 'err', 'No key'); return; }

      setKeyStatus(provider, 'testing', 'Testing…');
      btn.disabled = true;

      try {
        const resp = await window.agentiz.aiChat({
          provider,
          apiKey: key,
          messages: [{ role: 'user', content: 'Reply with only the word: ok' }]
        });
        if (resp.error) {
          setKeyStatus(provider, 'err', 'Failed');
        } else {
          setKeyStatus(provider, 'ok', 'Connected');
          await window.agentiz.storeSet(`apiKey_${provider}`, key);
          updateChatStatusPill();
        }
      } catch (err) {
        setKeyStatus(provider, 'err', 'Error');
      } finally {
        btn.disabled = false;
      }
    });
  });

  // ── Context file buttons ──────────────────────────────────────────────────
  document.querySelectorAll('[data-create-context]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.createContext;
      openContextWizard(type);
    });
  });

  // ── Wizard close ─────────────────────────────────────────────────────────
  document.getElementById('ctx-wizard-close').addEventListener('click', closeContextWizard);

  // ── Wizard save ──────────────────────────────────────────────────────────
  document.getElementById('ctx-wizard-save').addEventListener('click', async () => {
    const pathEl   = document.getElementById('ctx-wizard-path');
    const textarea = document.getElementById('ctx-wizard-textarea');
    const statusEl = document.getElementById('ctx-wizard-status');

    const filePath = pathEl.dataset.path;
    const content  = textarea.value;

    statusEl.textContent = 'Saving…';
    statusEl.className   = 'ctx-wizard-status';

    const { error } = await window.agentiz.writeFile(filePath, content);

    if (error) {
      statusEl.textContent = `Error: ${error}`;
      statusEl.className   = 'ctx-wizard-status err';
    } else {
      statusEl.textContent = 'Saved successfully';
      statusEl.className   = 'ctx-wizard-status ok';
      setTimeout(closeContextWizard, 1200);
    }
  });
}

function setKeyStatus(provider, cssClass, text) {
  const el = document.querySelector(`.key-status[data-status="${provider}"]`);
  if (!el) return;
  el.textContent = text;
  el.className   = `key-status${cssClass ? ' ' + cssClass : ''}`;
}

// ── Context file wizard ───────────────────────────────────────────────────────

const CONTEXT_TEMPLATES = {
  claude: {
    filename: 'CLAUDE.md',
    title:    'Create CLAUDE.md',
    template: `# Project
Describe your project here.

# Stack
List your tech stack: languages, frameworks, databases.

# Style preferences
- Indentation: 2 spaces
- Prefer CSS custom properties over hardcoded values
- Write comments for non-obvious logic only

# Patterns to follow
- Functional style — avoid classes where possible
- All async functions handle errors with try/catch

# Avoid
- jQuery
- Inline styles
- Magic numbers without constants
`
  },
  cursorrules: {
    filename: '.cursorrules',
    title:    'Create .cursorrules',
    template: `# Cursor AI Rules
You are working on [describe your project].

## Language and framework
- Language: TypeScript / JavaScript / Python (choose one)
- Framework: (React / Next.js / Express / etc.)

## Code style
- Prefer functional patterns
- 2-space indentation
- All async functions must handle errors with try/catch
- Use const by default; let only when reassignment is needed

## Avoid
- var
- any type (TypeScript)
- Nested ternaries
`
  },
  agents: {
    filename: 'AGENTS.md',
    title:    'Create AGENTS.md',
    template: `# Agent Instructions

These instructions apply to all AI agents working in this project.

## Before making changes
- Read all relevant files before editing
- Understand the existing patterns before introducing new ones

## When making changes
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused on the task
- Do not introduce dependencies unless necessary

## After making changes
- Explain what you changed and why
- Flag any side effects or follow-up actions needed
`
  }
};

async function openContextWizard(type) {
  const tmpl = CONTEXT_TEMPLATES[type];
  if (!tmpl) return;

  const wizard   = document.getElementById('ctx-wizard');
  const titleEl  = document.getElementById('ctx-wizard-title');
  const pathEl   = document.getElementById('ctx-wizard-path');
  const textarea = document.getElementById('ctx-wizard-textarea');
  const statusEl = document.getElementById('ctx-wizard-status');

  const home     = await window.agentiz.getHomeDir();
  const filePath = `${home}/${tmpl.filename}`;

  titleEl.textContent  = tmpl.title;
  pathEl.textContent   = filePath;
  pathEl.dataset.path  = filePath;
  statusEl.textContent = '';
  statusEl.className   = 'ctx-wizard-status';

  const existing = await window.agentiz.readFile(filePath);
  textarea.value = existing.error ? tmpl.template : (existing.content || tmpl.template);

  wizard.hidden = false;
}

function closeContextWizard() {
  document.getElementById('ctx-wizard').hidden = true;
}

// ─────────────────────────────────────────────────────────────────────────────
//  TAB 5 — GUIDE  (static HTML, no JS needed)
// ─────────────────────────────────────────────────────────────────────────────
// Content is fully declarative in index.html. Nothing to initialize here.

// ─── Utility ─────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
