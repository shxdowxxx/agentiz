/**
 * Agentiz — Preload / IPC Bridge
 * Exposes a locked-down `agentiz` API to the renderer via contextBridge.
 * Nothing from Node or Electron leaks beyond what is explicitly listed here.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('agentiz', {

  // ── Panel state ─────────────────────────────────────────────────────────
  /** Expand the panel to full width. */
  expand()  { ipcRenderer.send('panel-expand');   },
  /** Collapse the panel to the thin edge strip. */
  collapse() { ipcRenderer.send('panel-collapse'); },
  /** Expand to peek width. */
  peek()    { ipcRenderer.send('panel-peek');      },
  /** Return from peek to collapsed. */
  unpeel()  { ipcRenderer.send('panel-unpeel');    },

  // ── VS Code detection ────────────────────────────────────────────────────
  /** @returns {Promise<boolean>} */
  checkVSCode() { return ipcRenderer.invoke('vscode-status'); },

  // ── Secure store ─────────────────────────────────────────────────────────
  /** @returns {Promise<any>} */
  storeGet(key)        { return ipcRenderer.invoke('store-get', key); },
  /** @returns {Promise<void>} */
  storeSet(key, value) { return ipcRenderer.invoke('store-set', key, value); },
  /** @returns {Promise<void>} */
  storeDelete(key)     { return ipcRenderer.invoke('store-delete', key); },

  // ── AI Chat ──────────────────────────────────────────────────────────────
  /**
   * Send a chat request to a real AI API.
   * @param {{ provider: string, apiKey: string, messages: Array<{role:string,content:string}>, model?: string }} opts
   * @returns {Promise<{content: string|null, error: string|null}>}
   */
  aiChat({ provider, apiKey, messages, model }) {
    return ipcRenderer.invoke('ai-chat', { provider, apiKey, messages, model });
  },

  // ── File system ──────────────────────────────────────────────────────────
  /**
   * Read the text content of a file.
   * @param {string} path
   * @returns {Promise<{error: string|null, content: string|null}>}
   */
  readFile(path) { return ipcRenderer.invoke('read-file', path); },

  /**
   * List entries in a directory.
   * @param {string} path
   * @returns {Promise<{error: string|null, entries: Array<{name:string, isDir:boolean}>}>}
   */
  listDir(path) { return ipcRenderer.invoke('list-directory', path); },

  /** @returns {Promise<string>} */
  getHomeDir() { return ipcRenderer.invoke('get-home-dir'); },

  /**
   * Write text content to a file (restricted to home directory).
   * @param {string} path  Absolute path within home directory.
   * @param {string} content  UTF-8 text to write.
   * @returns {Promise<{error: string|null}>}
   */
  writeFile(path, content) { return ipcRenderer.invoke('write-file', path, content); }
});
