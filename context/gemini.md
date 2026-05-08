---
session_id: SIZ-20260507-1600
date: 2026-05-07
time: 16:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
current_phase: Phase 4 — Dark UI Overhaul, Fake Data Purge, S3 Deployed
---

# Gemini Context — Agentiz

## Project Identity
Agentiz is a school filter-bypassing web proxy and games site. Static web app — no framework, no build step — deployed to AWS S3. The frontend is a vanilla HTML/CSS/JS SPA with 6 interactive views. Proxy engine: Ultraviolet v3.2.10 + epoxy-transport v3.0.1 + bare-mux v2.1.9, routed through a Railway bare server.

## Current State (as of 2026-05-07 Phase 4)
- Local repo: `/home/itzzzshxdow/agentiz/`
- Files: `index.html`, `style.css` (1435 lines), `app.js` (1377 lines), `sw.js`
- GitHub `shxdowxxx/agentiz` main — see latest closeout commit for HEAD hash
- S3 bucket `agentiz` (us-east-1, account 329435595007) — deployed this session, live
- Live URL: `https://agentiz.s3.amazonaws.com/agentiz/index.html`
- Railway bare server: `https://balanced-amazement-production-c715.up.railway.app/`
- Firebase project: `agentiz-b18ad` (Google + email/password auth, Firestore settings sync)

## UI / Design
- Default theme: Dark (`#0d0d0d` base, silver/white text). Light mode = `body.light` class toggle.
- Views (6): Home, Proxy, Games, AI (Ageniuz), Log, Settings
- Removed views: Welcome, Sandbox, Credits, Comms, Catalog
- All fake data removed: no mock friends, proxy servers, log entries, fictional credits

## Key Features Added This Phase
- **Big proxy URL bar on Home** — full-width pill input, Enter to browse
- **Tab Cloak** — `CLOAK_PRESETS` array with 4 real combos (Google Docs, Khan Academy, Google Classroom, Schoology). `applyCloak(preset)` / `clearCloak()` functions.
- **Panic key** — Escape closes proxy view instantly
- **Real activity log** — empty on start, `logEvent(kind, lvl, text)` populates on real events
- **Real credits** — ItzzzShxdow (vision/product), Claude/TheSizCorporation (engineering), Lumin SDK, Ultraviolet/TitaniumNetwork, Mercury Workshop/Railway

## Proxy Stack
- Ultraviolet v3.2.10 from jsDelivr
- epoxy-transport v3.0.1 from jsDelivr — fixes `headers is not iterable`
- bare-mux v2.1.9 from jsDelivr
- Service worker: `sw.js` using `UVServiceWorker` + `sw.route()`/`sw.fetch()`
- Bare server: `https://balanced-amazement-production-c715.up.railway.app/`
- Proxy rendered as an inline rail view, not a floating overlay

## Hard Constraints (from all prior phases)
1. Never `window.location.href` for proxy navigation — causes S3 403 before SW can intercept. Use inline proxy view (iframe) only.
2. Transport must be native ESM — `setTransport` uses `import(url)` + `{default:T}`. UMD fails.
3. bare-mux is required for UV v3 — cannot be removed.
4. Proxy requires HTTPS — test via S3 or GitHub Pages, never file://.

## Games (Lumin SDK)
- `const inst = new Lumin()`
- `await inst.init({ headless: true, onReady, onError })`
- `const { games, pages } = await inst.getGames({ page, limit, q })`
- `const blobUrl = await inst.getImageUrl(game.image_token)`
- `const { url } = await inst.getGameUrl(game.id)` → iframe src

## What's Not Done Yet
- Proxy untested end-to-end in browser
- Firestore security rules for `users` collection not written for `agentiz-b18ad`
- Tab cloak favicons from external CDNs — may fail on heavily filtered networks
- Comms feature removed — no real messaging

## Infrastructure
- Railway bare server: `https://balanced-amazement-production-c715.up.railway.app/` — do not delete
- S3 bucket: `agentiz` (us-east-1, account 329435595007) — deployed and live
- Unused `agentiz-organization` bucket — safe to delete
- Deploy script: `agentiz/deploy.sh`

## Session Docs
`agentiz/context/` and `agentiz/summaries/` — commit at every closeout.
