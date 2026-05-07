---
session_id: SIZ-20260506-2200
date: 2026-05-06
time: 22:00 UTC
project: Agentiz
agent: SessionCloseoutAgent
current_phase: Phase 3 — Rebuild (Pending)
---

# Gemini Context — Agentiz

## Project Identity
Agentiz is a school filter-bypassing web proxy. Static web app (no Node/Electron) deployed to AWS S3. The project was wiped on 2026-05-06 after the Phase 2 UV + bare-mux proxy stack proved unfixable. The repo and S3 bucket are now empty and ready for a clean rebuild.

## Current State (as of 2026-05-06)
- Local repo `/home/itzzzshxdow/agentiz/` contains only `.git`.
- GitHub `shxdowxxx/agentiz` main is at wipe commit `4d66abf`.
- S3 bucket `agentiz` (us-east-1, account 329435595007) is empty, website hosting active.
- Railway bare server is live and must be preserved: `https://balanced-amazement-production-c715.up.railway.app/` (bare v1/v2/v3).

## Why It Was Wiped
Phase 2 used UV v3 + bare-mux v2.1.6 + KoopBin's epoxy-transport. The combination is broken:
- `epoxy-transport.mjs` (KoopBin version) is incompatible with bare-mux v2.1.6 — throws `headers is not iterable`.
- bare-mux cannot be removed: UV v3 uses `BroadcastChannel("bare-mux")` internally.
- ESM transport loaded but proxy still returned 500 errors.
- Director chose clean wipe over continued patching.

## Hard Constraints for Rebuild
1. All proxy navigation must go through a full-screen iframe — never `window.location.href = '/s/...'` (causes S3 403 before SW can intercept).
2. Transport module must be native ESM — bare-mux `setTransport` uses `import()` + `{default:T}`. UMD builds fail.
3. bare-mux is required when using UV v3.

## Recommended Approach
Use Scramjet (the engine LucideProxy/KoopBin actually run) or a proven reference implementation (Holy Unblocker, Nebula). Do not hand-assemble UV v3 transport wiring again. Confirm a minimal proxy works before adding UI.

## Lumin SDK (Games)
Script: `https://cdn.jsdelivr.net/gh/luminsdk/script@latest/lumin.min.js`
- `const inst = new Lumin()`
- `await inst.init({ headless: true, onReady, onError })`
- `const { games, pages } = await inst.getGames({ page, limit, q })`
- `const blobUrl = await inst.getImageUrl(game.image_token)`
- `const { url } = await inst.getGameUrl(game.id)` → iframe src
- Filter-safe: jsDelivr CDN is categorized as Education on all major filters.

## Infrastructure
- Railway bare server: `https://balanced-amazement-production-c715.up.railway.app/` — do not delete
- S3 bucket `agentiz` (us-east-1, account 329435595007) — empty, ready
- Unused `agentiz-organization` bucket — safe to delete

## Session Docs
`agentiz/context/` and `agentiz/summaries/` — commit at every closeout.
