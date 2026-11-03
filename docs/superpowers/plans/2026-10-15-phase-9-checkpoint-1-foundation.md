# Phase 9 Checkpoint 1 — Shared Restoration Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish readable typography, authentic shared controls, compact curator notices, and adaptive standard/maximized app layouts.

**Architecture:** Add small shared presentation primitives without centralizing app-specific styling. Expose window presentation state through stable attributes so each CSS module can recompose its own content.

**Tech Stack:** React, TypeScript, CSS Modules, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Preserve current window lifecycle and geometry behavior.
- Body copy must be 14–16px; only secondary metadata may be approximately 12px.
- No emoji, handcrafted SVG, CSS-art asset, or inert control may be introduced.
- Standard and maximized layouts must remain usable without horizontal scrolling.

## Review Focus

- 1440×900 maximize recomposes app content.
- Minimum-size windows keep primary controls reachable.
- 200% zoom retains readable order and scroll access.
- Curator notices do not dominate primary tasks.
- Keyboard focus remains visible over every shared surface.

---

### Task 1: Shared window presentation contract

**Files:**
- Modify: `components/desktop/WindowFrame.tsx`
- Modify: `components/desktop/window-frame.module.css`
- Test: `tests/components/WindowManager.test.tsx`

**Interfaces:**
- Produces: `data-window-mode="standard|maximized"` and `data-window-active="true|false"` on the window root.

- [ ] **Step 1: Write failing tests** asserting the two data attributes in standard, inactive, and maximized states.
- [ ] **Step 2: Run** `npx vitest run tests/components/WindowManager.test.tsx`; expect the new assertions to fail.
- [ ] **Step 3: Implement** the attributes and shared large-screen content rules without changing reducer behavior.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): expose adaptive window presentation state`.

### Task 2: Shared readable artifact primitives

**Files:**
- Create: `components/shared/CuratorCard.tsx`
- Create: `components/shared/ArtifactIcon.tsx`
- Create: `components/shared/artifact-ui.module.css`
- Create: `lib/media/types.ts`
- Create: `content/media.ts`
- Create: `tests/unit/media-manifest.test.ts`
- Modify: `app/globals.css`
- Modify: `components/apps/app-shell.module.css`
- Test: `tests/components/Accessibility.test.tsx`

**Interfaces:**
- Produces: `CuratorCard({ title, summary, children, tone? })`.
- Produces: `ArtifactIcon({ src, alt, size? })` using an image asset and deterministic fallback text.
- Produces: `MediaCredit`, `MuseumMediaAsset`, and `getMediaAsset(id: string): MuseumMediaAsset | undefined` for all later asset-backed work.

- [ ] **Step 1: Write failing tests** for semantic headings, image alternative text, fallback behavior, readable base font, visible focus selectors, and required media-credit fields/local paths.
- [ ] **Step 2: Run** `npx vitest run tests/components/Accessibility.test.tsx`; expect FAIL.
- [ ] **Step 3: Implement** the two primitives and shared typography/focus variables.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Run** `npm test && npm run lint && npm run build`; expect all PASS.
- [ ] **Step 6: Commit** with `feat(phase-9): add readable artifact UI foundation`.

### Task 3: Browser visual checkpoint

**Files:**
- Modify only files from Tasks 1–2 if visible defects are found.
- Test: `tests/e2e/museum.spec.ts`

**Interfaces:**
- Consumes: shared window attributes and artifact primitives.

- [ ] **Step 1: Add browser assertions** for a standard window, maximized window, keyboard focus, and no horizontal document overflow at laptop and 1440×900 sizes.
- [ ] **Step 2: Run** `npx playwright test --project=chrome --project=reduced-motion`; expect PASS after fixes.
- [ ] **Step 3: Capture and inspect** desktop plus one representative app at normal and maximized sizes.
- [ ] **Step 4: Run** the full test, lint, build, and four-project Playwright suite.
- [ ] **Step 5: Commit** any QA fixes as `fix(phase-9): polish shared adaptive foundation`, confirm a clean tree, and stop for approval.

