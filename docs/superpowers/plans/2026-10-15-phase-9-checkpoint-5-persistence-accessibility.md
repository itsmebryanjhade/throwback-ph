# Phase 9 Checkpoint 5 — Persistence and Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist meaningful museum progress safely and complete the keyboard, focus, media, motion, and reset experience.

**Architecture:** A versioned storage adapter validates each record independently and exposes a small React hook to apps. Accessibility behavior is tested at shared primitives and representative app flows, then applied consistently across all nine apps.

**Tech Stack:** TypeScript, React hooks, browser localStorage, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Storage failures fall back to memory with a nonblocking notice.
- Invalid data resets only the affected record.
- Per-app reset, restore-layout, and reset-all are distinct actions.
- Destructive reset actions require clear confirmation.
- Audio/video has labels, captions/transcripts where meaningful, and no autoplay dependency.

## Review Focus

- Malformed JSON does not crash the museum.
- Schema-version mismatch resets one record only.
- Storage quota/security errors retain the current session.
- Reset cancellation changes nothing.
- Keyboard and reduced-motion paths provide equivalent feedback.

---

### Task 1: Versioned storage adapter

**Files:**
- Create: `lib/persistence/types.ts`
- Create: `lib/persistence/storage.ts`
- Create: `lib/persistence/usePersistentReducer.ts`
- Create: `tests/unit/persistence.test.ts`

**Interfaces:**
- Produces: `loadRecord<T>(key, version, validate, fallback): LoadResult<T>`.
- Produces: `saveRecord<T>(key, version, value): SaveResult`.
- Produces: `removeRecord(key): void` and `removeMuseumRecords(keys): ResetResult`.
- Produces: `usePersistentReducer(reducer, initialState, options)` with app-scoped key/version/validator.

- [ ] **Step 1: Write failing tests** for valid load, malformed JSON, wrong version, failed validation, quota error, selective reset, and unrelated-key preservation.
- [ ] **Step 2: Run** `npx vitest run tests/unit/persistence.test.ts`; expect FAIL.
- [ ] **Step 3: Implement** the adapter and hook with memory fallback.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): add versioned museum persistence`.

### Task 2: App and window persistence integration

**Files:**
- Modify: `lib/window-system/WindowContext.tsx`
- Modify: all nine `components/apps/*/*App.tsx` entry components
- Modify: app-specific type/data files only where validators require explicit guards
- Test: all nine component tests
- Test: `tests/unit/window-manager.test.ts`

**Interfaces:**
- Consumes: `usePersistentReducer` and app-specific storage keys `throwback-ph:app:<id>`.
- Uses window key: `throwback-ph:windows`.

- [ ] **Step 1: Add failing tests** for refresh restoration, invalid-record isolation, volume/mute restoration, and state continuity for every app's primary choice.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Integrate** the hook into window and app entry components without moving app state into the global reducer.
- [ ] **Step 4: Run all unit/component tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): persist museum progress and windows`.

### Task 3: Reset controls and accessibility pass

**Files:**
- Create: `components/shared/ConfirmDialog.tsx`
- Modify: `components/desktop/DesktopShell.tsx`
- Modify: `components/desktop/NotificationHistory.tsx`
- Modify: all nine app entry components for reset actions
- Modify: shared and app CSS modules as needed
- Test: `tests/components/Accessibility.test.tsx`
- Test: `tests/components/DesktopShell.test.tsx`
- Test: all nine app component tests

**Interfaces:**
- Produces: `ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel })` with focus trap/return.

- [ ] **Step 1: Write failing tests** for reset confirmation/cancellation, per-app isolation, reset-all unrelated-key preservation, keyboard navigation, focus return, motion reduction, and media labels.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Implement** reset controls and fix accessibility gaps across all apps.
- [ ] **Step 4: Run all unit/component tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): complete reset and accessibility controls`.

### Task 4: Persistence/accessibility browser checkpoint

- [ ] **Step 1: Add Playwright journeys** for refresh recovery, one-app reset, reset cancellation, reset-all, keyboard-only use, reduced motion, and media controls.
- [ ] **Step 2: Run** four-project Playwright and inspect focus/announcement behavior manually where screenshots cannot prove it.
- [ ] **Step 3: Run** tests, lint, and production build.
- [ ] **Step 4: Commit** QA fixes as `fix(phase-9): harden persistence and accessibility`, confirm a clean tree, and stop for approval.

