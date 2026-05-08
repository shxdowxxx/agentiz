---
session_id: SIZ-20260507-1600
date: 2026-05-07
time: 16:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
current_phase: Phase 4 — Dark UI Overhaul, Fake Data Purge, S3 Deployed
---

# Claude Context — Agentiz

## Project Identity
Agentiz is a school filter-bypassing web proxy and games site. Static web app (no Node/Electron, no build step) deployed to AWS S3. The frontend is a vanilla HTML/CSS/JS SPA with 6 interactive views. The proxy engine is Ultraviolet v3.2.10 + epoxy-transport v3.0.1 + bare-mux v2.1.9, routed through a Railway bare server.

## Current State (as of 2026-05-07 Phase 4)
- Local repo: `/home/itzzzshxdow/agentiz/`
- Files: `index.html`, `style.css` (1435 lines), `app.js` (1377 lines), `sw.js`
- GitHub `shxdowxxx/agentiz` main — see latest closeout commit for HEAD hash
- S3 bucket `agentiz` (us-east-1, account 329435595007) — deployed this session, live
- Live URL: `https://agentiz.s3.amazonaws.com/agentiz/index.html`
- Railway bare server: `https://balanced-amazement-production-c715.up.railway.app/`
- Firebase project: `agentiz-b18ad` (Google + email/password auth, Firestore settings sync)

## UI / Design
- **Default theme:** Dark — `#0d0d0d` base, silver/white text
- **Light mode:** `body.light` class toggle via topbar button
- **Views (6):** Home, Proxy, Games, AI (Ageniuz), Log, Settings
- **Removed views:** Welcome, Sandbox, Credits, Comms, Catalog
- **Sidebar:** 6 items — Home, Proxy, Games, Ageniuz, Activity, Settings
- **No fake data anywhere** — all mock friends, servers, log entries, credits, sandbox presets are gone

## Key Features Added This Phase
- **Big proxy URL bar on Home** — full-width pill input, Enter to browse
- **Tab Cloak** — topbar "Disguise" button, `CLOAK_PRESETS` array with 4 combos:
  - Google Docs: real favicon + "Document" title
  - Khan Academy: real favicon + "Khan Academy" title
  - Google Classroom: real favicon + "Google Classroom" title
  - Schoology: real favicon + "Schoology" title
  - Implemented via `applyCloak(preset)` / `clearCloak()`
- **Panic key** — Escape closes proxy view instantly
- **Real activity log** — starts empty, `logEvent(kind, lvl, text)` populates it on: proxy open, game launch, sign in, system events
- **Credits (real):** ItzzzShxdow (vision/product), Claude/TheSizCorporation (engineering), Lumin SDK (games), Ultraviolet/TitaniumNetwork (proxy), Mercury Workshop/Railway (bare server)

## Proxy Stack
- **Engine:** Ultraviolet v3.2.10 — `https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@3.2.10/dist/`
- **Transport:** epoxy-transport v3.0.1 — `https://cdn.jsdelivr.net/npm/epoxy-transport@3.0.1/dist/` — fixes `headers is not iterable`
- **bare-mux:** v2.1.9 — `https://cdn.jsdelivr.net/npm/bare-mux@2.1.9/dist/`
- **Bare server:** `https://balanced-amazement-production-c715.up.railway.app/`
- **Service worker:** `sw.js` at repo root — `UVServiceWorker` pattern with `sw.route()`/`sw.fetch()`
- **Proxy UI:** Inline rail view (not floating overlay) — proxy is its own view in the sidebar

## Hard Constraints (Preserved Across All Phases)
1. **Never use `window.location.href` for proxy navigation** — takes the top-level page off S3 origin before the SW can intercept, resulting in S3 403. All proxy navigation goes through the inline proxy view (iframe).
2. **Transport must be native ESM** — bare-mux `setTransport` calls `import(url)` then `{default:T}=mod`. UMD builds fail with `a is not a constructor`.
3. **bare-mux is required for UV v3** — UV v3 uses `BroadcastChannel("bare-mux")` internally.
4. **Proxy requires HTTPS** — test only via S3 or GitHub Pages, never `file://`.

## Games (Lumin SDK)
- `const inst = new Lumin()`
- `await inst.init({ headless: true, onReady, onError })`
- `const { games, pages } = await inst.getGames({ page, limit, q })`
- `const blobUrl = await inst.getImageUrl(game.image_token)`
- `const { url } = await inst.getGameUrl(game.id)` → iframe src
- jsDelivr CDN is categorized as Education on all major filters — filter-safe

## What's Not Done Yet
- Proxy not tested end-to-end in a browser (S3 is HTTPS so SW should register — just untested)
- Firestore security rules for `users` collection not written for `agentiz-b18ad`
- Tab cloak favicons fetched from external CDNs — may fail on heavily filtered networks (could cache as data URIs)
- Comms feature removed — rebuild with Firebase Realtime Database if needed

## Infrastructure
- **Railway bare server:** `https://balanced-amazement-production-c715.up.railway.app/` — preserve, do not delete
- **S3 bucket:** `agentiz` (us-east-1, account 329435595007) — deployed and live
- **Unused bucket:** `agentiz-organization` (same account) — safe to delete
- **Deploy script:** `agentiz/deploy.sh`

## Filter Status (last measured 2026-05-05, S3 domain)
Lightspeed: Education | FortiGuard: IT | Palo Alto: Computer-and-Internet-Info | Cisco Umbrella: Cloud and Data Centers | Securly: Other | AristotleK12: Allowed | ContentKeeper: Allowed | GoGuardian: Uncategorized (blocked — no technical fix)

## Session Docs Location
`agentiz/context/` and `agentiz/summaries/` — commit these at every closeout.
