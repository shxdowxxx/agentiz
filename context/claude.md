---
session_id: SIZ-20260507-1200
date: 2026-05-07
time: 12:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
current_phase: Phase 3 — Frontend Complete, Proxy + Auth Integrated
---

# Claude Context — Agentiz

## Project Identity
Agentiz is a school filter-bypassing web proxy. It is a static web app (no Node/Electron, no build step) deployed to AWS S3. The frontend is a vanilla HTML/CSS/JS SPA with 9 interactive views. The proxy engine is Ultraviolet v3.2.10 + epoxy-transport v3.0.1 + bare-mux v2.1.9, routed through a Railway bare server.

## Current State (as of 2026-05-07)
- Local repo: `/home/itzzzshxdow/agentiz/`
- Files: `index.html`, `style.css` (~1900 lines), `app.js` (~2100 lines), `sw.js`
- GitHub `shxdowxxx/agentiz` main is at `2c979c5`
- S3 bucket `agentiz` (us-east-1, account 329435595007) — deploy.sh not run this session, state unknown
- Railway bare server is live: `https://balanced-amazement-production-c715.up.railway.app/`
- Firebase project: `agentiz-b18ad` (Google + email/password auth, Firestore settings sync)

## Proxy Stack
- **Engine:** Ultraviolet v3.2.10 — `https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@3.2.10/dist/`
- **Transport:** epoxy-transport v3.0.1 — `https://cdn.jsdelivr.net/npm/epoxy-transport@3.0.1/dist/` — fixes `headers is not iterable` from Phase 2
- **bare-mux:** v2.1.9 — `https://cdn.jsdelivr.net/npm/bare-mux@2.1.9/dist/`
- **Bare server:** `https://balanced-amazement-production-c715.up.railway.app/`
- **Service worker:** `sw.js` at repo root — uses `UVServiceWorker` pattern with `sw.route()`/`sw.fetch()`
- **Proxy UI:** Slide-in browser overlay with chrome bar, URL history, status indicator

## Hard Constraints (Preserved from Phase 2 Learnings)
1. **Never use `window.location.href` for proxy navigation** — takes the top-level page off S3 origin before the SW can intercept, resulting in S3 403 AccessDenied. All navigation goes through a full-screen iframe in the overlay.
2. **Transport must be native ESM** — bare-mux `setTransport` calls `import(url)` then `{default:T}=mod`. UMD builds fail with `a is not a constructor`.
3. **bare-mux is required for UV v3** — UV v3 uses `BroadcastChannel("bare-mux")` internally.
4. **Proxy requires HTTPS** — test only via S3 or GitHub Pages, never `file://`.

## App Architecture
- **Stack:** Vanilla HTML/CSS/JS — no framework, no build step
- **Views (9):** Welcome, Lobby/Dashboard, Catalog, Communications, Ageniuz AI, Activity Log, Sandbox, Settings, Credits
- **Games:** Lumin SDK from `cdn.jsdelivr.net/gh/luminsdk/script@latest/lumin.min.js` — live catalog, thumbnails, search, pagination. Games load directly by default; "Proxy games" toggle in Settings routes through UV.
- **Auth:** Firebase `agentiz-b18ad` — Google + email/password. Auth state drives sidebar user card and Comms gate.
- **Settings:** Synced to Firestore `users/{uid}` document.

## Lumin SDK (Games)
- `const inst = new Lumin()`
- `await inst.init({ headless: true, onReady, onError })`
- `const { games, pages } = await inst.getGames({ page, limit, q })`
- `const blobUrl = await inst.getImageUrl(game.image_token)`
- `const { url } = await inst.getGameUrl(game.id)` → iframe src or proxy target
- jsDelivr CDN is categorized as Education on all major filters — filter-safe

## What's Not Done Yet
- Proxy has not been tested end-to-end in a browser
- Firestore security rules for `users` collection not written
- Comms/friends system uses static mock data
- S3 not deployed this session

## Infrastructure
- **Railway bare server:** `https://balanced-amazement-production-c715.up.railway.app/` — preserve, do not delete
- **S3 bucket:** `agentiz` (us-east-1, account 329435595007)
- **Unused bucket:** `agentiz-organization` (same account) — safe to delete
- **Deploy script:** `agentiz/deploy.sh`

## Filter Status (last measured 2026-05-05, S3 domain)
Lightspeed: Education | FortiGuard: IT | Palo Alto: Computer-and-Internet-Info | Cisco Umbrella: Cloud and Data Centers | Securly: Other | AristotleK12: Allowed | ContentKeeper: Allowed | GoGuardian: Uncategorized (blocked — no technical fix)

## Session Docs Location
`agentiz/context/` and `agentiz/summaries/` — commit these at every closeout.
