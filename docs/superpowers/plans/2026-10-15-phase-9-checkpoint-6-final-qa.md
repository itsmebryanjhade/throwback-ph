# Phase 9 Checkpoint 6 — Final Museum QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the complete museum, correct remaining defects, audit licenses and performance, and produce the final clean checkpoint.

**Architecture:** No new subsystem is introduced. This checkpoint exercises the integrated product, applies only evidence-backed fixes, and records final verification and attribution.

**Tech Stack:** Vitest, ESLint, Next.js production build, Playwright, browser visual inspection.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Do not redesign approved screens during final QA.
- Every fix must correspond to a reproduced failure, audit finding, missing credit, or visible defect.
- The final tree must be clean and the static production build must succeed.

## Review Focus

- Every media file has a valid manifest record and direct source/license evidence.
- No emoji or CSS/stick-figure placeholder remains in visitor-facing artifact UI.
- All nine apps work at standard and maximized sizes.
- Refresh, reset, failure, keyboard, and reduced-motion flows remain intact.
- Bundled media does not make the portfolio impractically large or slow.

---

### Task 1: Attribution and asset audit

**Files:**
- Modify: `content/media.ts`
- Modify: `public/museum/phase-9/media/README.md`
- Create: `components/museum/MediaCredits.tsx`
- Modify: relevant museum/desktop navigation surface to expose consolidated credits
- Test: `tests/unit/media-manifest.test.ts`
- Test: `tests/components/Accessibility.test.tsx`

- [ ] **Step 1: Write failing tests** requiring every file under the Phase 9 asset directory to map to a complete manifest record and every record to render in consolidated credits.
- [ ] **Step 2: Run focused tests** and verify any missing entries fail.
- [ ] **Step 3: Correct** metadata, missing links, inaccessible credit text, and orphan files.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `docs(phase-9): finalize media credits and licenses`.

### Task 2: Full regression and visual matrix

**Files:**
- Modify only files implicated by reproduced defects.
- Test: `tests/e2e/museum.spec.ts`

- [ ] **Step 1: Run** `npm test`, `npm run lint`, and `npm run build`; record exact results.
- [ ] **Step 2: Run** all Playwright projects and exercise desktop, rooms, nine apps, media, persistence, resets, and narrow-screen recommendation.
- [ ] **Step 3: Capture and inspect** desktop/welcome plus every app at normal and maximized sizes on laptop and 1440×900 viewports.
- [ ] **Step 4: Fix** only reproduced functional, visual, accessibility, overflow, or credit defects using a failing test where practical.
- [ ] **Step 5: Repeat** the complete verification until clean.
- [ ] **Step 6: Commit** with `fix(phase-9): complete final museum quality pass`.

### Task 3: Performance and final checkpoint

**Files:**
- Modify assets/configuration only if measurements show a concrete problem.
- Modify: project documentation with final run and attribution instructions if needed.

- [ ] **Step 1: Inspect** production asset sizes and optimize oversized media without invalidating attribution or visible quality.
- [ ] **Step 2: Verify** no unexpected console errors, missing network assets, or runtime exceptions occur during the complete browser journey.
- [ ] **Step 3: Run** final tests, lint, build, and four-project Playwright once after all optimizations.
- [ ] **Step 4: Confirm** `git status` is clean and record the final commit hashes and exact test counts.
- [ ] **Step 5: Stop for the project owner's final acceptance; do not add features after this checkpoint without a new design update.**

