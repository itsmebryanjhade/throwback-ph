# Phase 9 Checkpoint 4 — Remaining App and Desktop Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the artifact restoration across Friendster PH, Nokia Messages, Chat Archives, desktop, rooms, and welcome flow.

**Architecture:** Preserve the strongest existing interactions while replacing emoji assets, improving density, and defining intentional standard/maximized compositions. Reuse the media manifest for every new portrait, photograph, texture, and icon.

**Tech Stack:** React, TypeScript, CSS Modules, local image assets, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Preserve app reducer behavior and existing historical-integrity notices.
- New portraits must be fictional reconstructions; new photographs/icons require manifest credits.
- Do not copy proprietary logos or interfaces pixel for pixel.
- Keep the desktop immediately understandable and prevent icon/taskbar overlap.

## Review Focus

- Broken image paths have labeled fallbacks.
- Long profile/chat/message text wraps without clipping.
- Standard windows retain the primary activity above the fold.
- Maximized windows use additional panes or context intentionally.
- Desktop icons remain reachable at supported laptop sizes.

---

### Task 1: Friendster portrait and scrapbook polish

**Files:**
- Modify: `lib/apps/friendster/types.ts`
- Modify: `lib/apps/friendster/data.ts`
- Modify: `components/apps/friendster/FriendsterApp.tsx`
- Modify: `components/apps/friendster/friendster.module.css`
- Test: `tests/components/FriendsterApp.test.tsx`

- [ ] **Step 1: Write failing tests** for fictional portrait assets, scrapbook images, profile editing, themes, testimonials, bulletins, fallbacks, and maximized composition.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Implement** the asset-backed social profile restoration.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): polish friendster profile artifact`.

### Task 2: Nokia handset exhibit polish

**Files:**
- Modify: `components/apps/nokia/NokiaMessagesApp.tsx`
- Modify: `components/apps/nokia/NokiaScreen.tsx`
- Modify: `components/apps/nokia/NokiaKeypad.tsx`
- Modify: `components/apps/nokia/nokia.module.css`
- Test: `tests/components/NokiaMessagesApp.test.tsx`

- [ ] **Step 1: Write failing tests** for textured handset presentation, readable display/keypad, standard/maximized layouts, T9, folders, and EDSA sequence.
- [ ] **Step 2: Run the focused test** and verify failure.
- [ ] **Step 3: Implement** the handset/exhibit-desk composition without changing message behavior.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): polish nokia handset exhibit`.

### Task 3: Chat Archives client polish

**Files:**
- Modify: `lib/apps/chatarchives/types.ts`
- Modify: `lib/apps/chatarchives/data.ts`
- Modify: `components/apps/chatarchives/ChatArchivesApp.tsx`
- Modify: `components/apps/chatarchives/YahooMessengerView.tsx`
- Modify: `components/apps/chatarchives/MircView.tsx`
- Modify: `components/apps/chatarchives/chatarchives.module.css`
- Test: `tests/components/ChatArchivesApp.test.tsx`

- [ ] **Step 1: Write failing tests** for fictional portrait/icon assets, readable chat, BUZZ/reduced motion, mIRC mode, fallbacks, and maximized multi-pane composition.
- [ ] **Step 2: Run the focused test** and verify failure.
- [ ] **Step 3: Implement** the period client restoration.
- [ ] **Step 4: Run the focused test** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): polish chat archives clients`.

### Task 4: Desktop, room, and welcome cohesion

**Files:**
- Modify: `components/desktop/DesktopIcon.tsx`
- Modify: `components/desktop/DesktopShell.tsx`
- Modify: `components/desktop/WelcomeWindow.tsx`
- Modify: `components/desktop/desktop.module.css`
- Modify: `components/apps/RoomFolderWindow.tsx`
- Modify: `components/apps/app-shell.module.css`
- Test: `tests/components/DesktopShell.test.tsx`
- Test: `tests/components/RoomFoldersAndApps.test.tsx`

- [ ] **Step 1: Write failing tests** for image-backed icons, fallback labels, readable welcome copy, room launch cards, and no taskbar overlap.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Implement** cohesive desktop and folder polish using the shared artifact primitives.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): unify museum desktop artifact styling`.

### Task 5: Remaining-polish visual checkpoint

- [ ] **Step 1: Add or update Playwright journeys** for the five polished surfaces.
- [ ] **Step 2: Capture and inspect** standard and maximized states plus the desktop at laptop and 1440×900 sizes.
- [ ] **Step 3: Run** tests, lint, build, and four-project Playwright.
- [ ] **Step 4: Commit** QA fixes as `fix(phase-9): finish museum-wide visual polish`, confirm a clean tree, and stop for approval.

