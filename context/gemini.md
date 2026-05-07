---
session_id: SIZ-20260507-1200
date: 2026-05-07
time: 12:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
current_phase: Phase 3 — Frontend Complete, Proxy + Auth Integrated
---

# Gemini Context — Agentiz

## Project Identity
Agentiz is a school filter-bypassing web proxy. Static web app — no framework, no build step — deployed to AWS S3. The frontend is a vanilla HTML/CSS/JS SPA. The proxy engine is Ultraviolet v3.2.10 + epoxy-transport v3.0.1 + bare-mux v2.1.9, routed through a Railway bare server.

## Current State (as of 2026-05-07)
- Local repo: `/home/itzzzshxdow/agentiz/`
- Files: `index.html`, `style.css` (~1900 lines), `app.js` (~2100 lines), `sw.js`
- GitHub `shxdowxxx/agentiz` main at `2c979c5`
- S3 bucket `agentiz` (us-east-1, account 329435595007) — deploy.sh not run this session, state unknown
- Railway bare server live: `https://balanced-amazement-production-c715.up.railway.app/`
- Firebase project: `agentiz-b18ad` (Google + email/password auth, Firestore settings sync)

## Proxy Stack
- Ultraviolet v3.2.10 from jsDelivr
- epoxy-transport v3.0.1 from jsDelivr — fixes `headers is not iterable` from Phase 2
- bare-mux v2.1.9 from jsDelivr
- Service worker: `sw.js` using `UVServiceWorker` + `sw.route()`/`sw.fetch()`
- Bare server: `https://balanced-amazement-production-c715.up.railway.app/`
- Proxy UI: slide-in overlay with chrome bar and URL history

## Hard Constraints (from Phase 2 learnings)
1. Never `window.location.href` for proxy navigation — causes S3 403 before SW can intercept. Use full-screen iframe only.
2. Transport must be native ESM — `setTransport` uses `import(url)` + `{default:T}`. UMD fails.
3. bare-mux is required for UV v3 — cannot be removed.
4. Proxy requires HTTPS — test via S3 or GitHub Pages, never file://.

## App Architecture
- 9 views: Welcome, Lobby/Dashboard, Catalog, Communications, Ageniuz AI, Activity Log, Sandbox, Settings, Credits
- Games: Lumin SDK from `cdn.jsdelivr.net/gh/luminsdk/script@latest/lumin.min.js`
- Auth: Firebase `agentiz-b18ad` — Google + email/password
- Settings synced to Firestore `users/{uid}`

## Lumin SDK
- `const inst = new Lumin()`
- `await inst.init({ headless: true, onReady, onError })`
- `const { games, pages } = await inst.getGames({ page, limit, q })`
- `const blobUrl = await inst.getImageUrl(game.image_token)`
- `const { url } = await inst.getGameUrl(game.id)` → iframe src

## What's Not Done Yet
- Proxy untested end-to-end in browser
- Firestore security rules for `users` collection not written
- Comms/friends system is static mock data
- S3 not deployed this session

## Infrastructure
- Railway bare server: `https://balanced-amazement-production-c715.up.railway.app/` — do not delete
- S3 bucket: `agentiz` (us-east-1, account 329435595007)
- Unused `agentiz-organization` bucket — safe to delete
- Deploy script: `agentiz/deploy.sh`

## Session Docs
`agentiz/context/` and `agentiz/summaries/` — commit at every closeout.
