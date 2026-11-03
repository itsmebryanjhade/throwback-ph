# Targeted App Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the reported portrait, readability, media metadata, playback, and maximized-layout defects without rebuilding the museum apps.

**Architecture:** Keep each app's existing reducer, window shell, and navigation. Correct data at the existing app data modules, fix rendering at the smallest owning component/CSS module, and invalidate persisted defaults only where stale state would preserve bad mappings.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-10-16-targeted-app-corrections-design.md`

## Global Constraints

- Use only downloaded assets already in `public/museum/phase-9`.
- Do not generate or search for media.
- Remove personal identifiers and ambiguous variants from project-owned source and UI content.
- Preserve rooms, window controls, taskbar behavior, persistence, and working interactions.
- No unrelated refactoring or new subsystem.

## Review Focus

- Previously persisted app state must not restore old names or media mappings.
- Every portrait must resolve to one intentional crop without duplicate profile imagery.
- Video must preserve its intrinsic aspect ratio at normal and maximized window sizes.
- Seeking must update both React state and the actual audio element.
- Missing optional artwork must render an intentional fallback, never a broken image.

---

### Task 1: Correct identities and portrait rendering

**Files:**
- Modify: `lib/apps/friendster/data.ts`
- Modify: `components/apps/friendster/FriendsterApp.tsx`
- Modify: `components/apps/friendster/friendster.module.css`
- Modify: `lib/apps/realitytv/data.ts`
- Modify: `components/apps/realitytv/realitytv.module.css`
- Modify: `lib/apps/chatarchives/data.ts`
- Modify: `components/apps/chatarchives/chatarchives.module.css`
- Modify: `tests/components/FriendsterApp.test.tsx`
- Modify: `tests/components/RealityTvVoteApp.test.tsx`
- Modify: `tests/components/ChatArchivesApp.test.tsx`

**Interfaces:**
- Consumes: existing `portraitSrc`, `portraitPosition`, profile, nominee, and chat-contact records.
- Produces: unique individual portrait mappings and consistent fictional identities; no public API changes.

- [ ] Write failing tests asserting unique Friendster portraits, left-to-right Reality TV identity consistency, sharp individual Yahoo portraits, and use of fictional personas in project-owned app data.
- [ ] Run the focused tests and confirm failures identify current duplicate/contact-sheet mappings and name references.
- [ ] Replace mappings and names in the three data modules; render individual Friendster assets directly with `object-fit: cover` and per-profile `object-position`.
- [ ] Correct Reality TV contact-sheet crop geometry and centered face presentation.
- [ ] Update Chat Archives contacts to use clear individual portraits and replace ambiguous owner-related names.
- [ ] Bump only affected persistence versions whose stored state contains the replaced records.
- [ ] Run focused tests and commit the identity/portrait correction.

### Task 2: Repair requested readability and P-pop layout

**Files:**
- Modify: `components/apps/netcafe/netcafe.module.css`
- Modify: `components/apps/netcafe/NetCafeApp.tsx` only if markup is required for the larger header image
- Modify: `components/apps/ppoppassport/ppoppassport.module.css`
- Modify: `components/apps/ppoppassport/PassportBookletPanel.tsx` only if the existing panels cannot form the bento with CSS alone
- Modify: `tests/components/NetCafeApp.test.tsx`
- Modify: `tests/components/PpopPassportApp.test.tsx`

**Interfaces:**
- Consumes: current terminal grid, header image, passport panels, influence routes, timeline, and stamps.
- Produces: readable terminal states and a responsive bento composition without changing reducers.

- [ ] Add focused rendering tests for readable status classes, enlarged café image semantics, and presence of the existing P-pop route/timeline/stamp content in the bento view.
- [ ] Run focused tests and confirm the missing presentation hooks fail.
- [ ] Increase the café header image, repair low-contrast terminal text, and constrain the maximized terminal grid.
- [ ] Recompose existing P-pop content into a centered responsive bento grid using current panels; add one concise purpose sentence and no new features.
- [ ] Run focused tests and commit the layout correction.

### Task 3: Correct audio/video behavior and metadata

**Files:**
- Modify: `components/apps/opm/OpmMediaPlayerApp.tsx`
- Modify: `components/apps/opm/PlayerControls.tsx`
- Modify: `lib/apps/pinoytube/data.ts`
- Modify: `components/apps/pinoytube/VideoPlayerPanel.tsx`
- Modify: `components/apps/pinoytube/pinoytube.module.css`
- Modify: `lib/apps/tvtambayan/data.ts`
- Modify: `components/apps/tvtambayan/CrtScreenPanel.tsx`
- Modify: `components/apps/tvtambayan/tvtambayan.module.css`
- Modify: `content/media.ts` for supplied-media titles/posters only
- Modify: `tests/components/OpmMediaPlayerApp.test.tsx`
- Modify: `tests/components/PinoyTubeApp.test.tsx`
- Modify: `tests/components/TvTambayanApp.test.tsx`
- Modify: `tests/unit/media-manifest.test.ts`

**Interfaces:**
- Consumes: `LicensedAudio`, `LicensedVideo`, `mediaAssetId`, and current playback reducers.
- Produces: `handleSeek(seconds: number)` that updates `audioRef.current.currentTime` and reducer state; accurate file-derived catalog labels; aspect-ratio-safe media rendering.

- [ ] Add failing tests proving custom OPM seeking changes the real audio position, every displayed track is playable, PinoyTube/TV labels match supplied filenames, and media elements use aspect-ratio-safe classes.
- [ ] Run focused tests and confirm the current seek-only-state and stale metadata failures.
- [ ] Implement real OPM seeking and synchronize loaded metadata/time updates without adding a second player.
- [ ] Replace PinoyTube and TV fictional mismatched titles/descriptions with concise supplied-file labels and matching media entries.
- [ ] Add local poster mappings only when an existing downloaded image is suitable; otherwise use the video's own first frame and a non-broken fallback.
- [ ] Apply `object-fit: contain`, bounded player dimensions, and active-media-only mounting; add a lightweight TV loading state.
- [ ] Bump only affected persistence versions and run focused tests.
- [ ] Commit the media correction.

### Task 4: Validate only the affected experience

**Files:**
- Modify: no production files unless a failing verification receives its own regression test first.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: verified targeted correction checkpoint.

- [ ] Run a case-insensitive repository search confirming the owner's name is absent from project-owned source and tests.
- [ ] Run all Vitest tests and require zero failures.
- [ ] Run ESLint and require zero errors or warnings.
- [ ] Run the production build and require exit code 0.
- [ ] Inspect the eight affected apps at their standard size and inspect Friendster, PinoyTube, TV Tambayan, and P-pop maximized.
- [ ] Verify one real OPM seek, one PinoyTube clip, one TV channel switch, and the TV commercial break in the browser.
- [ ] Commit any regression-tested verification fixes, then report changed files and any asset limitations.
