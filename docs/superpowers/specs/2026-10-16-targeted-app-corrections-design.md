# Targeted App Corrections Design

## Purpose

Correct the specific visual, media, naming, and interaction problems reported in Friendster, Net Café Manager, Reality TV Vote, OPM Media Player, PinoyTube, TV Tambayan, Yahoo Messenger, and P-pop Passport. Preserve the existing museum structure and working interactions. This pass must not rebuild entire apps, introduce new systems, or perform unrelated refactoring.

## Shared Constraints

- Use only the downloaded images and media already present in `public/museum/phase-9`.
- Do not generate or search for replacement media.
- Assign fictional, gender-consistent identities without identifying the real people in the downloaded portraits.
- Remove personal identifiers and ambiguous variants from visitor-facing content, source defaults, persisted-state seeds, and directly affected tests.
- Preserve rooms, window controls, taskbar behavior, local persistence, and existing museum navigation.
- Change only files required by the corrections below.

## Corrections

### Friendster

- Map each profile to one unique downloaded portrait.
- Remove repeated portraits.
- Center portrait crops with `object-fit: cover` and per-image focal positioning where necessary.
- Replace mismatched identities with fictional names consistent with the visible portrait presentation.
- Replace the owner profile and testimonial references with a fictional identity.

### Net Café Manager

- Increase the header photograph to a clearly readable size while retaining the compact cashier header.
- Restore adequate contrast for terminal metadata and expired-session text.
- Keep the existing terminal grid and controls; adjust only spacing, contrast, and responsive sizing required for readability.

### Reality TV Vote

- Correct the five cast-sheet crop positions in their visible left-to-right order.
- Assign fictional identities matching the five visible presentations: woman, man, man, woman, man.
- Update names, nicknames, vote keywords, portrait labels, and biographies consistently.
- Center faces within both summary cards and the selected-nominee panel.

### OPM Media Player

- Make the custom seek bar control the active HTML audio element.
- Synchronize custom elapsed time with real audio playback.
- Ensure previous, next, and direct track selection load the correct playable file.
- Remove stale unavailable-track behavior by migrating the persisted app-state version.
- Retain the existing player design and playlist.

### PinoyTube

- Keep video media at its native aspect ratio in normal and maximized windows; do not stretch or crop it.
- Replace fictional mismatched titles and descriptions with concise labels derived from the supplied filenames and visible clip content.
- Provide matching local thumbnails or poster frames for the main and related-video entries using the existing supplied media.
- Keep only the active video mounted in the main player.

### TV Tambayan

- Rename channel/program presentation to match the supplied video files rather than unrelated fictional titles.
- Preserve each video's aspect ratio in normal and maximized windows.
- Load only the active channel or commercial-break video.
- Show a lightweight loading state until the active local video can play.
- Retain the CRT frame, channel controls, localization controls, and optional commercial break.

### Yahoo Messenger / Chat Archives

- Replace blurred contact portraits with the clearer downloaded individual portraits.
- Use centered, non-stretched crops and consistent fictional contact identities.
- Preserve chat, status, BUZZ, transcript, and messaging behavior.

### P-pop Passport

- Keep the exhibit because it explains cultural exchange in the Globalization room.
- Correct the existing maximized layout into a readable bento arrangement.
- Make the purpose clear through the existing route, influence, timeline, image, and stamp content.
- Preserve stamp collection and current cultural content; do not add a new subsystem.

## State and Media Handling

Existing data modules remain the source of profile names, program labels, and media mappings. Components continue resolving media through the current manifest. Persisted app versions change only where necessary to prevent old catalog data from overriding corrected defaults.

Missing optional artwork must use an intentional existing fallback. A missing image must never cause duplicated portraits, stretched media, or an empty broken-image box.

## Verification

- Add or update focused tests for portrait uniqueness, name removal, media/title mapping, OPM seeking, and relevant persisted-state migrations.
- Verify normal and maximized layouts for only the affected apps.
- Run the complete test suite, ESLint, and production build.
- Report any asset whose content cannot be matched confidently instead of inventing a historical claim.

## Out of Scope

- Rebuilding any application.
- Adding new rooms, apps, navigation systems, databases, APIs, authentication, or external media services.
- Redesigning unaffected screens.
- Searching for or generating additional media.
- Changing historical content beyond corrections required to match the supplied assets.
