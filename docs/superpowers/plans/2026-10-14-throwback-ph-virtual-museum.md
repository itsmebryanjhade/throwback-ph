# Throwback PH Virtual Museum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a desktop-first, interactive 2000s Filipino virtual museum with a guided tour, twelve sourced exhibits, a Nokia SMS inbox, and combined Yahoo Messenger/mIRC archives by November 3, 2026.

**Architecture:** A single-page Next.js App Router application renders a retro desktop shell and one active museum window. A reducer owns the interaction state, typed content modules provide all museum copy and credits, and focused client components render the tour and mini-experiences without a backend.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, CSS Modules, Vitest, React Testing Library, Playwright, Vercel

**Spec:** `docs/superpowers/specs/2026-10-14-throwback-ph-virtual-museum-design.md`

## Global Constraints

- The submission deadline is November 3, 2026; no new features are added on submission day.
- Target current desktop Chrome, Edge, and Firefox; screens below 768 px show a desktop recommendation.
- Use exactly three rooms in this order: Technology, Performance, Globalization.
- Ship exactly twelve exhibits, four per room, with a visual, concise explanation, “Why It Mattered,” alt text, and sources.
- Only one main museum room may be visible at a time; windows do not drag or overlap in the submission version.
- The Nokia SMS inbox is the signature interaction; Yahoo Messenger and mIRC share one Chat Archives exhibit.
- Sound is optional, off by default, and no information may depend on it.
- Respect `prefers-reduced-motion`; every interaction must work by keyboard and pointer.
- Record the source and license or usage basis for every external asset.
- Do not add a database, login, external API, CMS, full mobile experience, games, complex audio, or extra desktop applications.

## Review Focus

- A visitor who skips the boot sequence must reach the same usable Welcome state as one who waits for it.
- Tour navigation at the first and last exhibit must not produce an invalid room or exhibit selection.
- Closing, minimizing, and restoring the museum must never leave two main rooms visible or lose the current selection.
- Missing exhibit imagery must leave the exhibit title, explanation, takeaway, and sources readable.
- Reduced-motion and narrow-screen visitors must avoid timed motion and receive an immediately usable alternative state.

---

## File Structure

```text
app/
  globals.css                         Global tokens, reset, desktop breakpoint, reduced motion
  layout.tsx                          Metadata and root HTML shell
  page.tsx                            Museum application entry point
components/
  museum/MuseumApp.tsx                State wiring and top-level experience switching
  desktop/BootScreen.tsx              Timed/skippable startup screen
  desktop/DesktopShell.tsx            Desktop, icons, Start menu, and window composition
  desktop/DesktopIcon.tsx             Reusable semantic desktop shortcut
  desktop/Taskbar.tsx                 Start button, active-window item, clock
  desktop/WelcomeWindow.tsx           Guided welcome and Start Tour action
  museum/MuseumWindow.tsx             Active room frame and controls
  museum/RoomNavigation.tsx           Room tabs and guided Previous/Next actions
  museum/ExhibitList.tsx              Four-exhibit selector for the active room
  museum/ExhibitViewer.tsx            Visual, explanation, takeaway, and credits
  museum/TourComplete.tsx             End-of-tour summary and next actions
  experiences/NokiaInbox.tsx          Keyboard-friendly SMS interaction
  experiences/ChatArchives.tsx        Yahoo Messenger/mIRC view switcher
  shared/DesktopRecommendation.tsx    Small-screen fallback notice
content/
  museum.ts                           Typed rooms and twelve exhibits
  messages.ts                         Nokia messages and chat transcripts
  sources.ts                          Asset/source metadata registry
lib/
  museum-state.ts                     State types, initial state, reducer, tour helpers
  source-validation.ts                Pure completeness/credit validation
public/
  museum/                              Optimized local exhibit assets
tests/
  unit/content.test.ts                Content count, order, and credit coverage
  unit/museum-state.test.ts           Reducer and tour boundary behavior
  components/                         Component interaction and accessibility tests
  e2e/museum.spec.ts                  Complete visitor journeys and responsive behavior
vitest.config.ts                      Unit/component test setup
playwright.config.ts                  Desktop-browser end-to-end projects
```

### Task 1: Project Foundation and Responsive Entry

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `components/museum/MuseumApp.tsx`
- Create: `components/shared/DesktopRecommendation.tsx`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Test: `tests/components/DesktopRecommendation.test.tsx`

**Interfaces:**
- Consumes: none
- Produces: `MuseumApp(): JSX.Element`; `DesktopRecommendation(): JSX.Element`; CSS breakpoint behavior at 768 px

- [ ] **Step 1: Write the failing small-screen fallback test**

Create `tests/components/DesktopRecommendation.test.tsx` asserting that the notice contains “desktop or laptop,” is present in the document, and is separate from the main desktop container.

- [ ] **Step 2: Run the focused test and confirm the foundation is incomplete**

Run: `npm test -- DesktopRecommendation`
Expected: FAIL because the test runner or component does not exist yet.

- [ ] **Step 3: Scaffold the Next.js application and test runner**

Use current stable mutually compatible versions. Add scripts `dev`, `build`, `lint`, `test`, `test:watch`, and later-compatible `test:e2e`; configure the `@/*` path alias and jsdom setup.

- [ ] **Step 4: Implement the responsive entry components and global tokens**

Implement `MuseumApp()` and `DesktopRecommendation()` so widths below 768 px show the recommendation while supported widths render a temporary museum root. Define color, typography, focus, and spacing tokens in `app/globals.css`.

- [ ] **Step 5: Verify the test, lint, and production build**

Run: `npm test -- DesktopRecommendation && npm run lint && npm run build`
Expected: all commands succeed.

- [ ] **Step 6: Commit the foundation**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs app components/shared components/museum/MuseumApp.tsx tests vitest.config.ts
git commit -m "chore: scaffold Throwback PH museum"
```

### Task 2: Typed Museum Content and Source Validation

**Files:**
- Create: `content/museum.ts`
- Create: `content/messages.ts`
- Create: `content/sources.ts`
- Create: `lib/source-validation.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `RoomId = "technology" | "performance" | "globalization"`; `Exhibit`, `MuseumRoom`, `SourceCredit`, `SmsMessage`, and `ChatThread` types; `museumRooms: readonly MuseumRoom[]`; `getExhibit(id: string): Exhibit | undefined`; `validateMuseumContent(rooms, sources): string[]`

- [ ] **Step 1: Write failing content-contract tests**

Assert three rooms in the required order, four unique exhibits per room, twelve unique exhibit IDs, non-empty summary/takeaway/alt text, at least one source per exhibit, and no errors from `validateMuseumContent`.

- [ ] **Step 2: Run the content tests and verify failure**

Run: `npm test -- content`
Expected: FAIL because the content modules are missing.

- [ ] **Step 3: Define the content and source types plus validation function**

Implement the exact exported types and `validateMuseumContent(rooms: readonly MuseumRoom[], sources: readonly SourceCredit[]): string[]`. Report missing fields, duplicate IDs, unknown source IDs, and source records without URL and usage basis.

- [ ] **Step 4: Add the twelve approved exhibit records and interaction content**

Populate the exact exhibit titles from the spec. Add short Nokia messages, including an EDSA II entry, and two Chat Archives threads: `yahoo` and `mirc`. Use local placeholder visual paths only when paired with meaningful fallback text; do not invent historical citations.

- [ ] **Step 5: Add verified research and asset credits**

Record title, organization/creator, direct URL, usage basis, and access date for every research or image source. Copy only assets whose reuse terms are recorded into `public/museum/`.

- [ ] **Step 6: Verify content integrity**

Run: `npm test -- content`
Expected: PASS with exactly twelve valid exhibits and zero validation errors.

- [ ] **Step 7: Commit the content model**

```bash
git add content lib/source-validation.ts public/museum tests/unit/content.test.ts
git commit -m "feat: add sourced museum content model"
```

### Task 3: Museum State Controller and Tour Boundaries

**Files:**
- Create: `lib/museum-state.ts`
- Test: `tests/unit/museum-state.test.ts`

**Interfaces:**
- Consumes: `RoomId`, `museumRooms`, and exhibit IDs from Task 2
- Produces: `MuseumState`; `MuseumAction`; `initialMuseumState`; `museumReducer(state: MuseumState, action: MuseumAction): MuseumState`; `getTourPosition(state): { index: number; total: number } | null`

- [ ] **Step 1: Write failing reducer tests**

Cover boot finish and skip equivalence, Start Tour selecting the first Technology exhibit, room-icon opening, exhibit selection, first/last Previous and Next boundaries, tour completion after the twelfth exhibit, close-to-desktop, minimize/restore preserving selection, Start-menu toggling, and sound defaulting to `false`.

- [ ] **Step 2: Run the reducer tests and verify failure**

Run: `npm test -- museum-state`
Expected: FAIL because the reducer is missing.

- [ ] **Step 3: Implement the discriminated state and action types**

Model boot status, Welcome visibility, active room, selected exhibit, guided-tour status, museum visibility (`closed | open | minimized`), Start-menu state, and sound preference.

- [ ] **Step 4: Implement the pure reducer and ordered-tour helper**

Use the content array order as the single tour order. Boundary actions must remain stable rather than create invalid IDs; `NEXT` after the twelfth exhibit sets the tour-complete state.

- [ ] **Step 5: Verify reducer behavior**

Run: `npm test -- museum-state`
Expected: PASS for every state transition and boundary case.

- [ ] **Step 6: Commit the state controller**

```bash
git add lib/museum-state.ts tests/unit/museum-state.test.ts
git commit -m "feat: add museum navigation state"
```

### Task 4: Boot, Desktop Shell, Welcome, and Taskbar

**Files:**
- Create: `components/desktop/BootScreen.tsx`
- Create: `components/desktop/DesktopShell.tsx`
- Create: `components/desktop/DesktopIcon.tsx`
- Create: `components/desktop/Taskbar.tsx`
- Create: `components/desktop/WelcomeWindow.tsx`
- Create: `components/desktop/desktop.module.css`
- Modify: `components/museum/MuseumApp.tsx`
- Test: `tests/components/DesktopShell.test.tsx`

**Interfaces:**
- Consumes: `MuseumState`, `MuseumAction`, and `museumRooms` from Tasks 2–3
- Produces: `BootScreen({ onFinish, onSkip, durationMs })`; `DesktopShell({ state, dispatch })`; semantic desktop shortcuts, Welcome controls, Start menu, and taskbar restore control

- [ ] **Step 1: Write failing desktop-flow tests**

Use fake timers to assert boot completion after 2500 ms, immediate Skip behavior, reduced-motion immediate completion, the Welcome window after boot, Start Tour dispatch, all three room icons, Start-menu toggle, and taskbar restore after minimizing.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- DesktopShell`
Expected: FAIL because desktop components are missing.

- [ ] **Step 3: Implement the boot and Welcome flow**

The boot is skippable, lasts 2500 ms normally, and has no artificial delay when reduced motion is active. The Welcome window provides Start Tour and Explore Freely controls.

- [ ] **Step 4: Implement the desktop, three museum-door icons, Start menu, and taskbar**

Use semantic buttons, visible focus, a live clock that does not affect navigation state, and one active museum taskbar item. Style the page as the object using the approved Filipino XP-era palette without Microsoft trademarks.

- [ ] **Step 5: Connect `MuseumApp` to `useReducer(museumReducer, initialMuseumState)`**

Render the boot first and the desktop afterward; ensure all shell actions dispatch through the reducer rather than local duplicate state.

- [ ] **Step 6: Verify desktop behavior and build**

Run: `npm test -- DesktopShell && npm run build`
Expected: PASS and a successful production build.

- [ ] **Step 7: Commit the desktop shell**

```bash
git add components/desktop components/museum/MuseumApp.tsx tests/components/DesktopShell.test.tsx
git commit -m "feat: build guided retro desktop shell"
```

### Task 5: Museum Window and Twelve Exhibit Views

**Files:**
- Create: `components/museum/MuseumWindow.tsx`
- Create: `components/museum/RoomNavigation.tsx`
- Create: `components/museum/ExhibitList.tsx`
- Create: `components/museum/ExhibitViewer.tsx`
- Create: `components/museum/TourComplete.tsx`
- Create: `components/museum/museum.module.css`
- Modify: `components/desktop/DesktopShell.tsx`
- Test: `tests/components/MuseumWindow.test.tsx`

**Interfaces:**
- Consumes: `MuseumState`, `MuseumAction`, `MuseumRoom`, `Exhibit`, `getTourPosition`, and content arrays
- Produces: `MuseumWindow({ state, dispatch })`; one active room with room tabs, exhibit selector, exhibit body, sources, and guided controls

- [ ] **Step 1: Write failing museum-window tests**

Assert only the active room appears, all four exhibits for that room are selectable, the active exhibit renders title/summary/takeaway/alt text/source links, missing images preserve textual content, close returns to desktop, minimize hides content, and room tabs open the expected room.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- MuseumWindow`
Expected: FAIL because the museum window is missing.

- [ ] **Step 3: Implement the museum frame and navigation components**

Keep the frame mounted only when visibility is `open`. Use tab semantics for room navigation, buttons for exhibits, and disabled or context-appropriate guided controls at boundaries.

- [ ] **Step 4: Implement resilient exhibit rendering and source presentation**

Render the image or custom interface region without making content depend on it. Give “Why It Mattered” consistent visual priority and expose every credit as a descriptive external link.

- [ ] **Step 5: Implement tour completion**

Show how Technology, Performance, and Globalization connect, then offer Revisit Rooms, View Sources, and Return to Desktop actions.

- [ ] **Step 6: Verify all room and exhibit tests**

Run: `npm test -- MuseumWindow && npm test -- content`
Expected: PASS, including exactly one visible room and resilient missing-image behavior.

- [ ] **Step 7: Commit the museum galleries**

```bash
git add components/museum components/desktop/DesktopShell.tsx tests/components/MuseumWindow.test.tsx
git commit -m "feat: add three museum rooms and exhibits"
```

### Task 6: Nokia SMS Signature Interaction

**Files:**
- Create: `components/experiences/NokiaInbox.tsx`
- Create: `components/experiences/experiences.module.css`
- Modify: `components/museum/ExhibitViewer.tsx`
- Test: `tests/components/NokiaInbox.test.tsx`

**Interfaces:**
- Consumes: `SmsMessage[]` from `content/messages.ts`
- Produces: `NokiaInbox({ messages }: { messages: readonly SmsMessage[] }): JSX.Element`

- [ ] **Step 1: Write failing Nokia interaction tests**

Assert the inbox opens on the message list, Enter/Space opens the focused message, Escape/Back returns to the list, pointer selection works, the EDSA II entry is present, focus returns predictably, and the museum remains navigable around the phone.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- NokiaInbox`
Expected: FAIL because the experience is missing.

- [ ] **Step 3: Implement the inbox as a contained exhibit interaction**

Use semantic list/buttons and local view state only. Recreate the phone visually with CSS and small local assets; do not imitate a complete phone operating system.

- [ ] **Step 4: Mount the inbox only for the Nokia exhibit**

Map the Technology exhibit interaction discriminator to `NokiaInbox` in `ExhibitViewer`; all other exhibits retain the standard visual slot.

- [ ] **Step 5: Verify keyboard, pointer, and surrounding navigation**

Run: `npm test -- NokiaInbox && npm test -- MuseumWindow`
Expected: PASS with no regression to room navigation.

- [ ] **Step 6: Commit the Nokia experience**

```bash
git add components/experiences components/museum/ExhibitViewer.tsx tests/components/NokiaInbox.test.tsx
git commit -m "feat: add interactive Nokia SMS archive"
```

### Task 7: Combined Chat Archives Interaction

**Files:**
- Create: `components/experiences/ChatArchives.tsx`
- Modify: `components/experiences/experiences.module.css`
- Modify: `components/museum/ExhibitViewer.tsx`
- Test: `tests/components/ChatArchives.test.tsx`

**Interfaces:**
- Consumes: `ChatThread[]` from `content/messages.ts`
- Produces: `ChatArchives({ threads }: { threads: readonly ChatThread[] }): JSX.Element`

- [ ] **Step 1: Write failing Chat Archives tests**

Assert the initial Yahoo Messenger view, switching to mIRC by pointer and keyboard, correct selected-tab semantics, preserved readable transcripts, and no fake message-sending control.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- ChatArchives`
Expected: FAIL because the component is missing.

- [ ] **Step 3: Implement the two-view archive**

Use an accessible tablist with `yahoo` and `mirc` panels. Keep it archival and selectable, not a full messaging simulation.

- [ ] **Step 4: Mount Chat Archives in its Globalization exhibit**

Map the Chat Archives interaction discriminator to the component while retaining the exhibit explanation, takeaway, and credits beside it.

- [ ] **Step 5: Verify the combined exhibit**

Run: `npm test -- ChatArchives && npm test -- MuseumWindow`
Expected: PASS with both archive views available inside one exhibit.

- [ ] **Step 6: Commit the Chat Archives**

```bash
git add components/experiences components/museum/ExhibitViewer.tsx tests/components/ChatArchives.test.tsx
git commit -m "feat: add combined chat archives exhibit"
```

### Task 8: Accessibility, Motion, and Visual Polish

**Files:**
- Modify: `app/globals.css`
- Modify: `components/desktop/desktop.module.css`
- Modify: `components/museum/museum.module.css`
- Modify: `components/experiences/experiences.module.css`
- Modify: `components/museum/MuseumApp.tsx`
- Test: `tests/components/Accessibility.test.tsx`

**Interfaces:**
- Consumes: all rendered components from Tasks 4–7
- Produces: consistent focus treatment, reduced-motion styles, loading feedback, readable contrast, and optional sound control defaulted off

- [ ] **Step 1: Write failing accessibility and preference tests**

Assert landmark and heading structure, accessible names for icon-only controls, visible sound state “Off” at startup, no content conveyed by audio only, reduced-motion boot bypass, and no inaccessible duplicate main regions.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- Accessibility`
Expected: FAIL on the unimplemented preference or semantic requirements.

- [ ] **Step 3: Apply the final design system and interaction states**

Finish the sky-blue desktop, deep-blue taskbar, green Start control, warm-gray windows, crisp borders, restrained shadows, Tahoma/Verdana-style interface type, and Filipino period details. Add visible hover, active, and `:focus-visible` states.

- [ ] **Step 4: Implement reduced-motion, loading, and sound-preference behavior**

Disable nonessential transitions and artificial delays under `prefers-reduced-motion`. Keep sound off by default and store only session-local preference; if no approved audio asset exists, the control remains absent rather than decorative.

- [ ] **Step 5: Verify accessibility and production quality**

Run: `npm test && npm run lint && npm run build`
Expected: all unit/component tests pass with no lint or build errors.

- [ ] **Step 6: Commit the polish pass**

```bash
git add app components tests/components/Accessibility.test.tsx
git commit -m "feat: polish accessible Y2K museum experience"
```

### Task 9: Cross-Browser Journeys and Deployment Readiness

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/museum.spec.ts`
- Create: `README.md`
- Create: `docs/asset-credits.md`
- Create: `vercel.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: the complete application
- Produces: `npm run test:e2e`; documented local/deployment workflow; auditable asset-credit register; Vercel-ready build

- [ ] **Step 1: Write failing end-to-end journeys**

Cover boot wait and skip paths, the complete twelve-exhibit guided tour in order, free opening of each room, close/minimize/restore behavior, Nokia keyboard flow, Chat Archives switching, small-screen recommendation, reduced-motion startup, and an automated link/asset response check.

- [ ] **Step 2: Run Chromium end-to-end tests and verify any gaps**

Run: `npm run test:e2e -- --project=chromium`
Expected: FAIL until Playwright configuration and any uncovered integration behavior are complete.

- [ ] **Step 3: Configure desktop browser projects**

Define Chromium, Firefox, and desktop Edge-channel projects at a representative 1440×900 viewport, plus narrow-screen and reduced-motion cases. Start the production server through Playwright web-server configuration.

- [ ] **Step 4: Fix only behavior required by the approved spec**

Resolve failing journeys without adding deferred features. Update `docs/asset-credits.md` so every shipped external asset has creator/organization, URL, usage basis, and access date.

- [ ] **Step 5: Document operation and deployment**

In `README.md`, record install, development, test, production build, and Vercel deployment commands, supported browsers, desktop-first limitation, and the November 3 feature-freeze rule.

- [ ] **Step 6: Run the complete release gate**

Run: `npm test && npm run lint && npm run build && npm run test:e2e`
Expected: all checks pass in Chromium, Firefox, and Edge projects; twelve exhibits and both signature experiences complete their journeys.

- [ ] **Step 7: Perform the human review gate**

On October 31, give the deployed preview to the group and record only essential corrections. On November 1–2, apply those corrections, rerun the release gate, and verify the public Vercel URL in a private browser window.

- [ ] **Step 8: Commit the release setup**

```bash
git add package.json playwright.config.ts tests/e2e README.md docs/asset-credits.md vercel.json
git commit -m "test: add release and deployment checks"
```

## Final Submission Gate

- [ ] Confirm all three rooms and twelve final exhibits are present.
- [ ] Confirm guided and free-exploration journeys work end to end.
- [ ] Confirm Nokia and Chat Archives work with keyboard and pointer.
- [ ] Confirm every external image and research reference is credited.
- [ ] Confirm no broken links, missing assets, unreadable text, or overlapping controls.
- [ ] Confirm Chrome, Edge, Firefox, narrow-screen notice, and reduced-motion checks pass.
- [ ] Confirm the group reviewed the complete build before deployment.
- [ ] Confirm the stable Vercel URL opens without authentication.
- [ ] Submit on November 3 without adding new features.
