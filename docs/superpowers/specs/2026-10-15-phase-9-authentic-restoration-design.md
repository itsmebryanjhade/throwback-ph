# Throwback PH Phase 9 — Authentic Museum Restoration

**Date:** October 15, 2026  
**Status:** Approved conversational design; awaiting written-spec review  
**Project:** Throwback PH Virtual Museum

## Purpose

Complete the museum with a focused restoration pass that replaces generic AI-styled interfaces, artificial placeholder media, and unreadable maximized layouts with believable early-2000s Filipino digital artifacts. The result should be nostalgic, playful, academically responsible, and strong enough for a student portfolio without attempting to reproduce nine full commercial applications.

## Intended Outcome

Visitors should feel that they are opening preserved applications and media objects from a Filipino home computer between 2000 and 2010. Each application should offer one convincing activity, several meaningful interactions, authentic visual or media feedback, and concise museum interpretation.

The restoration preserves the existing desktop metaphor, multi-window system, historical research, and working application state. It changes presentation, media, readability, responsive behavior, persistence, and final quality—not the museum's core room structure.

## Success Criteria

- The museum remains recognizably original while feeling grounded in early-2000s Philippine digital culture.
- Net Café Manager, Reality TV Vote, and P-pop Passport no longer resemble generic dark dashboards.
- PinoyTube and TV Tambayan use real, locally bundled licensed video footage instead of stick figures or abstract CSS scenes.
- OPM Media Player plays at least one real, locally bundled, properly licensed acoustic recording.
- Fictional people use original reconstruction portraits rather than emoji avatars.
- Every app remains useful and enjoyable without pretending to be a complete production service.
- Default body text is readable on laptops and large displays; tiny text is limited to timestamps and secondary metadata.
- Maximized windows recompose their content instead of stretching cards or leaving large empty areas.
- Meaningful visitor choices and window state survive refreshes.
- All media includes visible creator, source, and license credits.
- Accessibility, browser tests, production build, and visual checks pass before completion.

## Design Principles

### Authentic artifact before themed dashboard

Each app should resemble a specific object or software environment: a cashier terminal, broadcast voting console, passport scrapbook, media player, video portal, CRT television, social profile, mobile handset, or chat client. Shared modern dashboard cards, glass effects, excessive gradients, pills, and decorative metrics are removed unless they genuinely belong to the artifact.

### Atmosphere leads, interpretation supports

The visitor should first understand what to do and enjoy doing it. Museum interpretation remains available inside every app but moves into compact, app-specific curator panels rather than dominating the primary experience with repeated warnings.

### Small but convincing interaction loops

Each app provides one immediately understandable activity and approximately three to six meaningful actions. Controls must change state or produce visible feedback. Features that exist only to increase apparent complexity are removed.

### Original reconstruction with responsible sourcing

The interface may reference historical brands as subjects, but it does not copy proprietary interfaces pixel for pixel. Public-domain or Creative Commons assets and original generated reconstruction assets are permitted. Arbitrary copyrighted downloads, unstable embeds, copied celebrity likenesses, copyrighted songs, and copyrighted television clips are not permitted.

## Shared Visual and Responsive Foundation

- Preserve the Windows-2000-inspired desktop, overlapping windows, taskbar, Start control, system tray, and room folders.
- Increase normal body text to approximately 14–16px. Reserve approximately 12px for timestamps, captions, and secondary metadata.
- Replace emoji UI symbols with a coherent set of period-appropriate raster or library icons.
- Retain chunky title bars, beveled controls, and practical focus states.
- Give every app a distinct artifact identity while keeping window controls and OS behavior consistent.
- Convert long reconstruction warnings into concise curator cards with links to full credits and context.
- Define compact, standard, and maximized compositions for each app.
- Use controlled maximum line lengths and content widths when a window is maximized.
- Let media and primary work areas grow in maximized mode; do not enlarge every card uniformly.
- Stack secondary panels in smaller windows without hiding primary actions.
- Maintain recoverable minimum window sizes and the existing narrow-screen desktop recommendation.

## Application Restorations

### Net Café Manager

Replace the cyberpunk admin dashboard with a believable Windows XP-era Philippine computer-shop cashier program. Use a terminal floor map, session ledger, print queue, time-extension controls, and cash counter. A licensed computer-shop photograph or original reconstruction image provides environmental context. The primary loop is selecting a terminal, starting or extending a session, adding a service, and checking out.

### Reality TV Vote

Replace neon dashboard cards with a 2000s television voting companion. Use large original fictional contestant portraits, broadcast lower-thirds, an SMS voting panel, eviction-night standings, and restrained broadcast graphics. The primary loop is selecting a contestant, casting a simulated vote, checking results, and reviewing vote history. All tariffs, shortcodes, contestants, and outcomes remain clearly fictional.

### P-pop Passport

Replace the dark dashboard with an open passport and cultural scrapbook. Use paper texture, stamped pages, route maps, taped photographs, ticket-like ephemera, and collectible marks. The primary loop is choosing a cultural route, inspecting its evidence and interpretation, collecting a stamp, and reviewing passport progress. Curatorial interpretations remain explicitly distinguished from sourced facts.

### OPM Media Player

Keep the strongest Winamp-era qualities while improving readability and spatial composition. Bundle at least one properly licensed acoustic recording with functional play, pause, seek, volume, mute, next/previous behavior, playlist, and favorites. Use credited cover imagery or original reconstruction artwork. Any remaining fictional tracks must use original recordings or be clearly unavailable—not simulated oscillator tones presented as songs.

### PinoyTube

Replace stick-figure and abstract animation scenes with locally bundled, licensed footage. Preserve 4:3 framing, period video controls, buffering simulation, quality modes, ratings, comments, favorites, browse, and metadata-only upload simulation. Resolution modes may alter presentation and buffering behavior without falsely claiming multiple encoded files when only one source exists.

### TV Tambayan

Replace abstract CSS scenes with locally bundled, licensed footage shown inside the CRT. Each fictional channel receives a distinct clip or clearly credited reusable footage treatment. Preserve channel switching, static transitions, volume, mute, schedule, favorites, subtitle or dubbing demonstrations, and cultural notes. Captions must remain available when dialogue or narration carries meaning.

### Friendster PH

Preserve the effective profile structure and orange-era social-web character. Replace emoji avatars with original fictional portraits and add believable scrapbook photos. Improve profile editing, theme selection, testimonials, bulletins, and friends without copying proprietary branding assets. Maximized mode should expand profile content, not merely stretch columns.

### Nokia Messages

Preserve the successful messaging and T9 interactions. Present them through a photographed or textured candy-bar handset reconstruction with a larger display and keypad. Standard mode prioritizes the handset; maximized mode becomes an exhibit desk with message folders or interpretation beside the handset.

### Chat Archives

Preserve Yahoo-inspired and mIRC-inspired modes, BUZZ feedback, chat entry, contacts, channels, transcripts, and cultural notes. Replace emoji avatars and toolbar symbols with original portraits and period-appropriate icons. Increase message readability and use maximized space for a believable multi-pane desktop-client layout.

## Media Strategy

### Allowed media

- Public-domain assets
- Creative Commons assets whose license permits the intended redistribution and adaptation
- Original generated fictional portraits, interface illustrations, covers, and textures
- Original recordings created for the museum

### Required records

Every bundled media item records:

- Asset title
- Creator or originating institution
- License and required attribution language
- Direct source URL
- Local filename
- Exhibit or component using it
- Any edits, crops, color treatments, or audio changes

Credits must be available from the relevant app and from a consolidated museum credits surface.

### Local delivery

Accepted media is downloaded and bundled with the static application. The museum must not depend on third-party streaming embeds. Images use appropriate dimensions and formats; audio and video are compressed to practical portfolio sizes without making the experience appear broken or excessively slow.

### Fallbacks

- Missing image: labeled period-style placeholder with the artifact title, never emoji or stick figures.
- Failed audio: readable error state that preserves track information and credits.
- Failed video: poster image, explanatory caption, and retry control.
- Reduced motion: static transitions and no shaking, flashing, or animated visualizer dependence.

## Interaction Scope

The main loops are:

1. Rent and manage a computer-shop terminal.
2. Vote for and follow a fictional television contestant.
3. Collect and inspect cultural passport stamps.
4. Play and organize acoustic music.
5. Watch, rate, and comment on period-style videos.
6. Channel-surf through localized television.
7. Customize a Friendster-style profile.
8. Compose, save, reply to, and forward Nokia-style messages.
9. Chat, send BUZZ feedback, and explore archived conversations.

The apps are educational simulations, not full networked services. Authentication, real uploads, cloud messaging, user accounts, remote databases, live voting, and third-party APIs remain out of scope.

## Persistence

Use a shared, versioned local-storage adapter while keeping domain state inside each app.

Persist:

- Profile edits, themes, friends, testimonials, and bulletins
- Nokia drafts, sent items, settings, and completed historical sequence
- Net café sessions, service history, and shop state where useful
- Votes, favorites, playlists, ratings, comments, watchlists, stamps, and chat choices
- Per-app completion state
- Media volume and mute preferences
- Open, minimized, maximized, focused, positioned, and sized windows
- Recent applications and last active room

Invalid records reset only the affected app where possible. Each app receives a reset control. Restore-layout and reset-all controls require clear confirmation and never touch unrelated browser data.

## Accessibility

- Keyboard access for desktop shortcuts, Start menu, taskbar, tabs, window controls, media controls, and primary app loops
- Visible focus indicators consistent with the retro visual language
- Meaningful names for icon-only controls
- Correct tab, dialog, list, status, progress, slider, and media semantics
- Text alternatives for photographs and generated reconstruction images
- Captions or transcripts for meaningful audio and video
- No interaction dependent only on color, sound, hover, or animation
- Reduced-motion behavior for BUZZ, buffering, channel changes, window motion, and visualizers
- Readable contrast and zoom resilience
- Practical target sizes beneath the compact period styling

## Implementation Checkpoints

Phase 9 is implemented through reviewable checkpoints:

1. Shared typography, icon, curator-card, and responsive/maximized-window foundation
2. Priority redesigns: Net Café Manager, Reality TV Vote, and P-pop Passport
3. Authentic media apps: OPM Media Player, PinoyTube, and TV Tambayan
4. Remaining polish: Friendster PH, Nokia Messages, Chat Archives, desktop, rooms, and welcome flow
5. Shared persistence, reset controls, accessibility, and failure states
6. Final regression, media-credit audit, visual QA, performance check, and completion checkpoint

The project owner reviews each checkpoint before the next begins. A checkpoint may refine details within this approved direction but must not introduce a new product subsystem without a design update.

## Testing and Verification

### Unit tests

- Persistence serialization, validation, migration, selective reset, and storage failure handling
- App reducers and completion rules
- Media playlist, playback-state, channel, vote, session, and stamp behavior
- Window geometry and responsive composition rules where represented in state

### Component tests

- Primary interaction loop for every app
- Reset behavior and local-state restoration
- Media error and fallback states
- Accessible labels, keyboard paths, status announcements, focus restoration, and reduced motion
- Standard and maximized composition classes or layout behaviors

### Browser journeys

- Open, overlap, resize, maximize, restore, minimize, and close multiple apps
- Refresh and recover window and app state
- Complete the primary loop in every app
- Exercise real audio and video controls
- Verify normal laptop, large desktop, and narrow-screen recommendation states
- Verify all credits links and locally served assets
- Verify app-specific reset, layout reset, and reset-all flows

### Visual QA

Capture and inspect each app at normal and maximized sizes. Check typography, density, hierarchy, cropping, scrolling, icon consistency, media sizing, empty space, focus visibility, and whether the screen convincingly represents its intended artifact. Fix visible issues before final completion.

## Delivery Boundaries

Phase 9 does not add accounts, cloud synchronization, real messaging, real uploads, analytics, databases, copyrighted commercial recordings, copyrighted television excerpts, or unreliable third-party embeds. The finished museum remains a statically deployable Next.js application whose media and persistence work locally in the visitor's browser.

