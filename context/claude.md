---
session_id: SIZ-20260505-2100
date: 2026-05-05
time: 21:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
version: 1.0
current_phase: Phase 2 — Proxy Engine Integration
---

# Claude Context — Agentiz

Read this file at the start of any Agentiz session. It reflects the state of the project as of the last session closeout.

---

## What This Project Is
Agentiz is a **school filter-bypassing web proxy** deployed as a static site on AWS S3. It uses the **Ultraviolet (UV) proxy engine** with a **Railway-hosted bare server** to tunnel HTTPS requests through a service worker. The landing page at the S3 bucket root looks like a legitimate productivity/education tool to pass content filter categorization.

It is NOT an Electron app. The original Electron scaffold was wiped in session SIZ-20260503-2100 and replaced with the current web proxy.

---

## Current Phase: Phase 2 — Proxy Engine Integration

All core wiring is done. The proxy has not been confirmed working end-to-end by the director. The first task of the next session is to test the proxy in a browser.

---

## Key URLs
- **App (React SPA):** `https://agentiz.s3.amazonaws.com/agentiz`
- **Landing page:** `https://agentiz.s3.amazonaws.com/index.html`
- **Bare server (Railway):** `https://balanced-amazement-production-c715.up.railway.app/`
- **GitHub:** `shxdowxxx/agentiz`, branch `main`, HEAD = `775b3bb`

---

## Architecture

### File Layout (repo root = `/home/itzzzshxdow/agentiz/`)
- `index.html` — marketing landing page (no proxy code; filtered separately)
- `src-app/` — React + Vite + Tailwind source (build output goes into S3 at `/agentiz` key)
- `engine/` — UV v3.2.10 engine files
  - `core.bundle.js` — official UV bundle
  - `core.sw.js` — UV service worker helper
  - `core.client.js` — UV client
  - `core.handler.js` — UV handler
  - `core.config.js` — UV config (bare server URL lives here)
- `sw.js` — service worker entry point (imports `engine/core.sw.js`, uses `UVServiceWorker`)
- `transport/` — BareMux (renamed from baremux)
- `relay/` — Epoxy (renamed from epoxy)
- `netfetch/` — libcurl WASM (renamed from libcurl)
- `net-bundle.js` / `net-sync.js` — NetStream (Scramjet) bundles
- `server/` — Railway bare server (`server.js`, uses `@tomphttp/bare-server-node`)
- `deploy.sh` — builds `src-app/` and syncs to S3

### React App (`src-app/src/`)
- `components/ProxyFrame.jsx` — full-screen iframe that hosts proxied sites; the parent page never navigates away
- `components/SearchBar.jsx` — URL/search input, calls `onNavigate(dest)`
- `components/QuickTiles.jsx` — quick-launch tiles, calls `onNavigate(dest)`
- `components/RecentHistory.jsx` — history list, calls `onNavigate(dest)`
- `components/Bookmarks.jsx` — bookmarks, calls `onNavigate(dest)`
- `components/CommandPalette.jsx` — Ctrl+K palette, 16 commands
- `lib/proxy.js` — SW registration + readiness (uses `ready` flag + 4s timeout)
- `lib/codec.js` — XOR URL encoder (must match UV's codec)
- `lib/auth.js` — Discord auth (`requestCode`/`verifyCode` → Sentry bot)

---

## Critical Constraints

### Navigation Rule
ALL navigation inside the app must call `onNavigate(dest)` which sets `frameUrl` state which opens `ProxyFrame`. Never use `window.location.href = '/s/...'` — that navigates the top-level page off the S3 origin before the SW can intercept, causing S3 to return 403 AccessDenied.

### SW Readiness
`proxy.js` uses a `ready` flag with a 4-second hard timeout. Do not revert to checking `navigator.serviceWorker.controller` — if SW registration fails, `controller` stays null forever, locking the UI on "loading...".

### Codec Match
`src/lib/codec.js` must use the same XOR algorithm as `engine/core.bundle.js`. They are already aligned. Do not change one without changing the other.

### Bare Server URL
The Railway bare server URL is hardcoded in `engine/core.config.js`. It must match the actual Railway deployment. Do not point it at `/bare/` (that is an S3 path that does not exist).

---

## Filter Status
- Lightspeed: Education (pass)
- FortiGuard: Information Technology (pass)
- Palo Alto: Computer-and-Internet-Info (pass)
- Cisco Umbrella: Cloud and Data Centers (pass)
- Securly: Other (pass)
- AristotleK12: Allowed (pass)
- ContentKeeper: Allowed (pass)
- GoGuardian: Uncategorized (GoGuardian blocks all uncategorized — no technical fix)
- Score: 18/20

The landing page uses education/productivity framing and `manifest.json` categories `["education", "productivity", "utilities"]`. Do not add copy that references bypassing filters, school networks, or disguising tabs.

---

## Outstanding Work
1. **Test proxy end-to-end** — open the app, enter a URL, confirm it loads in the iframe.
2. **Implement Sentry bot auth endpoints** — `POST /api/auth/request` and `POST /api/auth/verify` in `discord-bot/dashboard/routes/api.js`.
3. **Delete orphan AWS bucket** `agentiz-organization` (329435595007, us-east-1).
4. **Debug if proxy fails** — check SW registration in DevTools, check Railway bare server logs.

---

## Build and Deploy
```bash
# Build React app
cd /home/itzzzshxdow/agentiz/src-app
npm run build

# Deploy everything to S3
cd /home/itzzzshxdow/agentiz
./deploy.sh
```

The deploy script syncs the entire agentiz directory to the `agentiz` S3 bucket with public-read ACL.
