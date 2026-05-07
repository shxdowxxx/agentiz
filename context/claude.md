---
session_id: SIZ-20260506-2200
date: 2026-05-06
time: 22:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
current_phase: Phase 3 — Rebuild (Pending)
---

# Claude Context — Agentiz

## Project Identity
Agentiz is a school filter-bypassing web proxy. It is a static web app (no Node/Electron) deployed to AWS S3. The project has been wiped and is ready for a full rebuild.

## Current State (as of 2026-05-06)
- Local repo `/home/itzzzshxdow/agentiz/` contains only `.git` — all source files deleted.
- GitHub `shxdowxxx/agentiz` main is at wipe commit `4d66abf`.
- S3 bucket `agentiz` (us-east-1, account 329435595007) is empty, website hosting active.
- Railway bare server is live: `https://balanced-amazement-production-c715.up.railway.app/` — supports bare v1/v2/v3.

## Why It Was Wiped
The Phase 2 build used UV v3 + bare-mux v2.1.6 + KoopBin's epoxy-transport. That combination is broken:
- KoopBin's `epoxy-transport.mjs` throws `headers is not iterable` against bare-mux v2.1.6.
- Removing bare-mux is not an option — UV v3 internally uses `BroadcastChannel("bare-mux")`.
- The ESM transport (`bare-mod-transport.mjs`) loaded without errors but the proxy still returned 500s.
- Rather than continue patching, the director chose a clean wipe.

## Architectural Constraints for the Rebuild
1. **Never use `window.location.href` to navigate proxy URLs** — takes the top-level page off S3 origin before the service worker can intercept, resulting in S3 403 AccessDenied. All navigation must go through a full-screen iframe.
2. **Transport must be native ESM** — bare-mux's `setTransport` calls `import(url)` then `{default:T}=mod`. UMD builds fail with `a is not a constructor`.
3. **bare-mux cannot be removed from a UV v3 stack** — UV v3 uses `BroadcastChannel("bare-mux")` internally.

## Recommended Next Steps
1. Use Scramjet as the proxy engine (what LucideProxy and KoopBin actually use) or use a fully working reference implementation (Holy Unblocker / Nebula) rather than assembling UV v3 transport wiring from scratch.
2. Confirm a minimal proxy (bare HTML + SW, no React) works end-to-end before adding UI.
3. Re-integrate Lumin SDK games once proxy is confirmed.

## Lumin SDK (Games)
- Load: `<script src="https://cdn.jsdelivr.net/gh/luminsdk/script@latest/lumin.min.js">`
- Init: `const inst = new Lumin(); await inst.init({ headless: true, onReady, onError })`
- Games: `const { games, pages } = await inst.getGames({ page, limit, q })`
- Thumbnail: `const blobUrl = await inst.getImageUrl(game.image_token)`
- Launch: `const { url } = await inst.getGameUrl(game.id)` — set as iframe `src`
- jsDelivr CDN is categorized as Education/CDN — filter-safe

## Infrastructure
- **Railway bare server:** `https://balanced-amazement-production-c715.up.railway.app/` — keep this, do not delete
- **S3 bucket:** `agentiz` (us-east-1, account 329435595007) — empty, ready
- **Unused bucket:** `agentiz-organization` (same account) — can be deleted
- **Deploy script:** Will need to be recreated for new build

## Filter Status (last measured 2026-05-05, S3 domain)
Lightspeed: Education | FortiGuard: IT | Palo Alto: Computer-and-Internet-Info | Cisco Umbrella: Cloud and Data Centers | Securly: Other | AristotleK12: Allowed | ContentKeeper: Allowed | GoGuardian: Uncategorized (blocked — no technical fix)

## Session Docs Location
`agentiz/context/` and `agentiz/summaries/` — commit these at every closeout.
