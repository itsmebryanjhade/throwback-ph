# Phase 9 Checkpoint 3 — Authentic Media Apps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give OPM Media Player, PinoyTube, and TV Tambayan locally bundled, licensed, functional audio and video.

**Architecture:** A typed media manifest is the single source of licensing and local-file metadata. Reusable native-media wrappers expose load, play, pause, seek, volume, mute, caption, and error states while app reducers retain domain interactions.

**Tech Stack:** TypeScript, React, native `<audio>`/`<video>`, local static assets, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-15-phase-9-authentic-restoration-design.md`

## Global Constraints

- Every asset must be public domain, compatible Creative Commons, or original.
- No third-party streaming embeds or copyrighted commercial recordings/clips.
- Media files, poster images, captions, and credits are served locally.
- Failed media must preserve title, explanation, credits, and retry/fallback UI.

## Review Focus

- Autoplay rejection leaves an obvious play control.
- Failed or missing files show the documented fallback.
- Seeking and duration tolerate metadata not yet loaded.
- Muted/volume state is announced and later persistable.
- Reduced motion disables nonessential visualizers and transitions.

---

### Task 1: Licensed media manifest and player primitives

**Files:**
- Modify: `lib/media/types.ts`
- Modify: `content/media.ts`
- Create: `components/shared/LicensedAudio.tsx`
- Create: `components/shared/LicensedVideo.tsx`
- Create: `components/shared/media.module.css`
- Modify: `tests/unit/media-manifest.test.ts`
- Create: `tests/components/LicensedMedia.test.tsx`
- Create: `public/museum/phase-9/media/README.md`

**Interfaces:**
- Produces: `MediaCredit` and `MuseumMediaAsset` types with `id`, `kind`, `title`, `creator`, `license`, `sourceUrl`, `localSrc`, `usedBy`, `edits`, `posterSrc?`, and `captionsSrc?`.
- Produces: `getMediaAsset(id: string): MuseumMediaAsset | undefined`.
- Produces: audio/video components with `asset`, `onStateChange?`, and accessible fallback props.

- [ ] **Step 1: Write failing manifest and component tests** for required credit fields, local paths, native controls/state, captions, and load errors.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Source and verify licenses** for the minimum approved audio/video/image set; store direct source evidence in the README.
- [ ] **Step 4: Implement** the manifest and wrappers, then bundle optimized assets.
- [ ] **Step 5: Run focused tests** and expect PASS.
- [ ] **Step 6: Commit** with `feat(phase-9): add licensed local media foundation`.

### Task 2: OPM real acoustic playback

**Files:**
- Modify: `lib/apps/opm/types.ts`
- Modify: `lib/apps/opm/data.ts`
- Modify: `components/apps/opm/OpmMediaPlayerApp.tsx`
- Modify: `components/apps/opm/PlayerControls.tsx`
- Modify: `components/apps/opm/PlaylistPanel.tsx`
- Modify: `components/apps/opm/VisualizerDisplay.tsx`
- Modify: `components/apps/opm/opm.module.css`
- Remove or leave unused with migration note: `lib/apps/opm/audio-synth.ts`
- Test: `tests/components/OpmMediaPlayerApp.test.tsx`
- Test: `tests/unit/opm-state.test.ts`

**Interfaces:**
- Adds: `mediaAssetId: string` and availability metadata to playable tracks.
- Consumes: `LicensedAudio` and media manifest.

- [ ] **Step 1: Write failing tests** for a licensed acoustic track, native duration/seek/volume/mute, playlist switching, credits, and media failure.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Implement** real playback and readable standard/maximized player compositions.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): add authentic opm acoustic playback`.

### Task 3: PinoyTube real video playback

**Files:**
- Modify: `lib/apps/pinoytube/types.ts`
- Modify: `lib/apps/pinoytube/data.ts`
- Modify: `components/apps/pinoytube/PinoyTubeApp.tsx`
- Modify: `components/apps/pinoytube/VideoPlayerPanel.tsx`
- Modify: `components/apps/pinoytube/VideoBrowserPanel.tsx`
- Modify: `components/apps/pinoytube/pinoytube.module.css`
- Test: `tests/components/PinoyTubeApp.test.tsx`
- Test: `tests/unit/pinoytube-state.test.ts`

**Interfaces:**
- Adds: `mediaAssetId: string` and `posterAssetId: string` to video entries.
- Consumes: `LicensedVideo`; preserves rating, comment, favorite, browse, buffering, and metadata-upload actions.

- [ ] **Step 1: Write failing tests** proving no stick-figure renderer remains and real video supports play/pause/seek/mute, captions, buffering overlay, comments, ratings, and fallback.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Implement** licensed 4:3 video presentation and honest quality-mode copy.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): replace pinoytube animation with licensed video`.

### Task 4: TV Tambayan channel footage

**Files:**
- Modify: `lib/apps/tvtambayan/types.ts`
- Modify: `lib/apps/tvtambayan/data.ts`
- Modify: `components/apps/tvtambayan/TvTambayanApp.tsx`
- Modify: `components/apps/tvtambayan/CrtScreenPanel.tsx`
- Modify: `components/apps/tvtambayan/tvtambayan.module.css`
- Test: `tests/components/TvTambayanApp.test.tsx`
- Test: `tests/unit/tvtambayan-state.test.ts`

**Interfaces:**
- Adds: `mediaAssetId`, `posterAssetId`, and caption/localization metadata to channels.
- Preserves: power, channel, volume, mute, watchlist, schedule, and localization actions.

- [ ] **Step 1: Write failing tests** proving abstract scene art is removed and channel footage, static transition, captions, localization, volume, mute, and fallback work.
- [ ] **Step 2: Run focused tests** and verify failure.
- [ ] **Step 3: Implement** licensed footage inside the CRT and readable maximized composition.
- [ ] **Step 4: Run focused tests** and expect PASS.
- [ ] **Step 5: Commit** with `feat(phase-9): add authentic tv tambayan channel media`.

### Task 5: Media visual checkpoint

- [ ] **Step 1: Add Playwright journeys** for audio playback, video playback, channel switching, mute, seeking, and fallback injection.
- [ ] **Step 2: Inspect** the three apps at standard and maximized sizes with sound muted during automated checks.
- [ ] **Step 3: Run** tests, lint, build, and four-project Playwright; verify bundled media paths in the production output.
- [ ] **Step 4: Commit** QA fixes as `fix(phase-9): polish authentic media experiences`, confirm a clean tree, and stop for approval.

