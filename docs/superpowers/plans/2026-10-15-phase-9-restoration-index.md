# Phase 9 Authentic Restoration — Execution Index

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement these plans checkpoint-by-checkpoint. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Phase 9 restoration through six independently reviewable checkpoints.

**Architecture:** Shared visual, media, and persistence foundations support isolated app restorations. Each checkpoint must leave the museum runnable, tested, committed, and ready for the project owner's review before the next checkpoint begins.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest, Testing Library, Playwright, browser localStorage, native HTML audio/video.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Preserve the existing static Next.js architecture, desktop metaphor, nine-app catalog, and window manager.
- Use only public-domain, compatible Creative Commons, or original generated/reconstruction media.
- Bundle accepted media locally and record title, creator, license, source URL, local filename, usage, and edits.
- Do not add authentication, cloud sync, real messaging, real uploads, databases, analytics, commercial copyrighted media, or third-party streaming embeds.
- Normal body text targets 14–16px; approximately 12px is reserved for timestamps, captions, and secondary metadata.
- Every control must work, expose understandable state, and remain keyboard accessible.
- Pause after every checkpoint for the project owner's visual review and approval.

## Review Focus

- A maximized app on a 1440×900 viewport should recompose rather than stretch tiny cards.
- A minimum-size app should keep its primary action reachable without horizontal scrolling.
- Missing or failed media should retain context, credits, and a retry/fallback state.
- Corrupted or incompatible saved data should reset only the affected record.
- Reduced-motion users should not receive shaking, flashing, or essential animation-only feedback.

## Checkpoint Plans

1. `2026-10-15-phase-9-checkpoint-1-foundation.md`
2. `2026-10-15-phase-9-checkpoint-2-priority-apps.md`
3. `2026-10-15-phase-9-checkpoint-3-authentic-media.md`
4. `2026-10-15-phase-9-checkpoint-4-remaining-polish.md`
5. `2026-10-15-phase-9-checkpoint-5-persistence-accessibility.md`
6. `2026-10-15-phase-9-checkpoint-6-final-qa.md`

Implementation order is mandatory because later checkpoints consume the shared interfaces defined earlier.

