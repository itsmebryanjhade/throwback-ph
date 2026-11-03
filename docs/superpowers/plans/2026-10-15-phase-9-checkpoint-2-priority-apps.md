# Phase 9 Checkpoint 2 — Priority App Restorations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic dashboard styling in Net Café Manager, Reality TV Vote, and P-pop Passport with believable period artifacts.

**Architecture:** Preserve each reducer and interaction loop while replacing presentation components, CSS, and asset-backed identity. Original fictional portraits and reconstruction images live under `public/museum/phase-9/priority/` and receive permanent entries in the shared media manifest created in Checkpoint 1.

**Tech Stack:** React, TypeScript, CSS Modules, Next Image-compatible local assets, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Preserve current state transitions, simulation labels, museum citations, and completion behavior.
- Do not use emojis, generic neon gradients, glass cards, or copied proprietary UI assets.
- Portraits must depict fictional people and be labeled as reconstructions.
- Every app must have distinct standard and maximized compositions.

## Review Focus

- Existing saved reducer state still renders safely.
- Long names and translated copy do not overflow.
- Portrait or environmental image failure has a labeled fallback.
- Primary actions remain visible at minimum window size.
- Maximized layouts use the width for artifact context, not repeated stretched cards.

---

### Task 1: Net Café Manager cashier restoration

**Files:**
- Modify: `components/apps/netcafe/NetCafeApp.tsx`
- Modify: `components/apps/netcafe/TerminalList.tsx`
- Modify: `components/apps/netcafe/TerminalCard.tsx`
- Modify: `components/apps/netcafe/ActiveSessionPanel.tsx`
- Modify: `components/apps/netcafe/PrintServicesPanel.tsx`
- Modify: `components/apps/netcafe/SessionHistoryPanel.tsx`
- Modify: `components/apps/netcafe/netcafe.module.css`
- Modify: `content/media.ts`
- Test: `tests/components/NetCafeApp.test.tsx`

**Interfaces:**
- Consumes: `data-window-mode` and shared curator styling.
- Preserves: current `NetCafeAction` dispatch contract.

- [ ] **Step 1: Write failing tests** for cashier header, floor-map/ledger semantics, readable labels, and unchanged start/extend/print/checkout behavior.
- [ ] **Step 2: Run the focused test** and verify failure.
- [ ] **Step 3: Implement** the XP-era cashier composition and local environmental image with fallback.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): restore net cafe cashier experience`.

### Task 2: Reality TV broadcast restoration

**Files:**
- Modify: `lib/apps/realitytv/types.ts`
- Modify: `lib/apps/realitytv/data.ts`
- Modify: `components/apps/realitytv/RealityTvVoteApp.tsx`
- Modify: `components/apps/realitytv/NomineeCard.tsx`
- Modify: `components/apps/realitytv/VoteDeskPanel.tsx`
- Modify: `components/apps/realitytv/LiveStandingsPanel.tsx`
- Modify: `components/apps/realitytv/realitytv.module.css`
- Modify: `content/media.ts`
- Test: `tests/components/RealityTvVoteApp.test.tsx`
- Test: `tests/unit/realitytv-state.test.ts`

**Interfaces:**
- Adds: `portraitSrc: string` and `portraitAlt: string` to each fictional nominee.
- Preserves: voting reducer actions and fictional tariff/shortcode notices.

- [ ] **Step 1: Write failing tests** for portrait metadata, broadcast lower thirds, fallback portrait, and existing vote/result/history flows.
- [ ] **Step 2: Run focused unit and component tests** and verify failure.
- [ ] **Step 3: Implement** fictional reconstruction portraits and the eviction-night broadcast composition.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): restore reality tv broadcast experience`.

### Task 3: P-pop passport scrapbook restoration

**Files:**
- Modify: `components/apps/ppoppassport/PpopPassportApp.tsx`
- Modify: `components/apps/ppoppassport/PassportBookletPanel.tsx`
- Modify: `components/apps/ppoppassport/InfluenceRoutesPanel.tsx`
- Modify: `components/apps/ppoppassport/CulturalTimelinePanel.tsx`
- Modify: `components/apps/ppoppassport/PpopCulturalNotesPanel.tsx`
- Modify: `components/apps/ppoppassport/ppoppassport.module.css`
- Modify: `content/media.ts`
- Test: `tests/components/PpopPassportApp.test.tsx`

**Interfaces:**
- Preserves: stamp collection, traveler name, route, and timeline reducer contracts.

- [ ] **Step 1: Write failing tests** for open-book semantics, stamp collection, paper-photo fallbacks, curatorial labels, and standard/maximized classes.
- [ ] **Step 2: Run the focused test** and verify failure.
- [ ] **Step 3: Implement** the paper passport/scrapbook composition and period ephemera assets.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): restore ppop passport scrapbook`.

### Task 4: Priority-app visual checkpoint

- [ ] **Step 1: Add Playwright journeys** opening and maximizing all three apps and completing their primary actions.
- [ ] **Step 2: Capture and inspect** all three apps at standard and maximized sizes.
- [ ] **Step 3: Fix visible overflow, density, focus, and fallback defects only within this checkpoint.**
- [ ] **Step 4: Run** full tests, lint, build, and four-project Playwright.
- [ ] **Step 5: Commit** QA fixes as `fix(phase-9): polish priority artifact restorations`, confirm a clean tree, and stop for approval.

