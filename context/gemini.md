---
session_id: SIZ-20260505-2100
date: 2026-05-05
time: 21:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
version: 1.0
current_phase: Phase 2 — Proxy Engine Integration
---

# Gemini Context — Agentiz

Read this file at the start of any Agentiz session. It reflects the state of the project as of the last session closeout.

---

## What This Project Is
Agentiz is a **school filter-bypassing web proxy** deployed as a static site on AWS S3. It uses the **Ultraviolet (UV) proxy engine** with a **Railway-hosted bare server** to tunnel HTTPS requests through a service worker. The landing page at the S3 bucket root is styled as a legitimate productivity/education tool to pass content filter categorization checks.

It is NOT an Electron app. The original Electron scaffold was replaced with a web proxy in a prior session.

---

## Current Phase: Phase 2 — Proxy Engine Integration

All core proxy wiring is complete. End-to-end proxy functionality has NOT been confirmed by the director. First task next session: test in a browser.

---

## Key URLs
- **App (React SPA):** `https://agentiz.s3.amazonaws.com/agentiz`
- **Landing page:** `https://agentiz.s3.amazonaws.com/index.html`
- **Bare server (Railway):** `https://balanced-amazement-production-c715.up.railway.app/`
- **GitHub:** `shxdowxxx/agentiz`, branch `main`, HEAD = `775b3bb`

---

## Architecture

### Repo Root (`/home/itzzzshxdow/agentiz/`)
- `index.html` — marketing landing page (no proxy code)
- `src-app/` — React + Vite + Tailwind source (build output → S3 `/agentiz` key)
- `engine/` — UV v3.2.10 engine
  - `core.bundle.js` — official UV bundle
  - `core.sw.js`, `core.client.js`, `core.handler.js` — UV support files
  - `core.config.js` — UV config (bare server URL)
- `sw.js` — service worker entry point (uses `UVServiceWorker` pattern)
- `transport/` — BareMux transport layer
- `relay/` — Epoxy relay
- `netfetch/` — libcurl WASM
- `net-bundle.js` / `net-sync.js` — NetStream (Scramjet) bundles
- `server/server.js` — Railway bare server (`@tomphttp/bare-server-node`)
- `deploy.sh` — build + S3 sync

### React App (`src-app/src/`)
- `components/ProxyFrame.jsx` — full-screen iframe for proxied sites (parent page never navigates away)
- `components/SearchBar.jsx`, `QuickTiles.jsx`, `RecentHistory.jsx`, `Bookmarks.jsx` — all call `onNavigate(dest)` to open ProxyFrame
- `components/CommandPalette.jsx` — Ctrl+K, 16 commands
- `lib/proxy.js` — SW registration + readiness (`ready` flag + 4s hard timeout)
- `lib/codec.js` — XOR URL encoder (must match UV's codec exactly)
- `lib/auth.js` — Discord auth flow → Sentry bot

---

## Critical Rules

### Navigation
All navigation must go through `onNavigate(dest)` → `frameUrl` state → `ProxyFrame`. Using `window.location.href = '/s/...'` causes S3 to receive the request before the service worker can intercept it, resulting in 403 AccessDenied. This is the root cause of the "AccessDenied" bug that was fixed in the last commit.

### Service Worker Readiness
`proxy.js` uses a `ready` boolean flag with a 4-second hard timeout. Do not check `navigator.serviceWorker.controller` for readiness — if SW registration fails, `controller` is null forever, locking the UI.

### Codec Alignment
`src/lib/codec.js` (XOR encoder) and `engine/core.bundle.js` must use the same encoding algorithm. They are currently aligned. Never change one without updating the other.

### Bare Server URL
`engine/core.config.js` must point to the Railway bare server URL. Do not use `/bare/` — that path does not exist in S3.

---

## Filter Status (as of 2026-05-05)
- Lightspeed: Education (pass)
- FortiGuard: Information Technology (pass)
- Palo Alto: Computer-and-Internet-Info (pass)
- Cisco Umbrella: Cloud and Data Centers (pass)
- Securly: Other (pass)
- AristotleK12: Allowed (pass)
- ContentKeeper: Allowed (pass)
- GoGuardian: Uncategorized (blocked — no fix available; GoGuardian blocks all uncategorized)
- Score: 18/20

Do not add any copy referencing filter bypass, school networks, disguising tabs, or uncategorized content — it will trigger filter re-scans.

---

## Outstanding Work
1. Test proxy end-to-end in a real browser.
2. Implement `POST /api/auth/request` and `POST /api/auth/verify` on the Sentry bot (discord-bot repo) for Discord login.
3. Delete orphan AWS bucket `agentiz-organization` (account 329435595007, us-east-1).
4. Debug if proxy still fails — check DevTools Network for SW status, check Railway logs.

---

## Build and Deploy
```bash
# Build React app
cd /home/itzzzshxdow/agentiz/src-app
npm run build

# Deploy to S3
cd /home/itzzzshxdow/agentiz
./deploy.sh
```
