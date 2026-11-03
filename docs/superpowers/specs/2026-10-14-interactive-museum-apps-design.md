# Throwback PH Interactive Museum Apps — Design Specification

**Date:** October 14, 2026  
**Status:** Approved conversational design; awaiting written-spec review  
**Project:** Throwback PH Virtual Museum

## Purpose

Transform Throwback PH from a desktop-themed sequence of exhibit pages into a working museum operating system. The three rooms remain the curatorial structure, while nine usable applications become the interactive artifacts. The result must feel playful and exploratory without losing the historical interpretation, sources, and academic purpose of a digital museum.

The experience remains desktop-first, browser-based, locally saved, and suitable for a student portfolio. It does not require accounts, a database, external APIs, or copyrighted media.

## Success Criteria

- Visitors can immediately open any of nine apps from the desktop or its room folder.
- Several apps can remain open in overlapping windows.
- Each open app has an individual taskbar button and complete window controls.
- Friendster PH, Nokia Messages, and Net Café Manager provide the deepest interaction loops.
- The six supporting apps still behave like functional applications rather than decorated exhibit cards.
- Every app integrates dates, interpretation, significance, sources, and credits.
- Meaningful visitor choices and window state survive refreshes in the same browser.
- The interface remains recognizable as an original early-2000s Filipino desktop, not an exact brand reproduction.

## Experience Model

The desktop provides two complementary ways to explore:

1. **Immediate app access.** All nine apps are available from the beginning. Nothing must be unlocked before it can be used.
2. **Curated room access.** Technology, Performance, and Globalization folders explain their themes and organize three related apps each.

Opening a room displays a curated directory containing an introduction, app thumbnails, completion indicators, and launch controls. Opening an app creates an independent desktop window. Previously opened apps also appear in the Start menu's recent-app area.

Progress represents exploration and completion only; it never restricts access.

## Museum Application Catalog

### Technology Room

#### Friendster PH — flagship

- Edit a visitor profile name, status, and About Me text.
- Select an original Y2K-inspired profile theme.
- Browse fictional Filipino profiles.
- Add and remove friends.
- Write or select testimonials and accept received testimonials.
- Create a bulletin post and review notifications.
- Open an integrated Museum Info section about profile culture and early social networking.

#### Nokia Messages — flagship

- Browse inbox, sent items, drafts, contacts, and conversation threads.
- Compose with a simplified T9-style input mode.
- Reply with custom or preset text, forward a message, and save a draft.
- Change a fictional ringtone and phone profile.
- Trigger an EDSA II sequence showing how forwarded text messages supported mass coordination.
- Open an integrated Museum Info section about SMS culture and the Philippines as a texting society.

#### Net Café Manager — flagship

- Select an available fictional computer terminal.
- Purchase a session using period-inspired peso pricing.
- Launch simulated café activities and consume fictional session time.
- Display low-time warnings and allow time extensions.
- Simulate printing, inspect session history, and end/check out a session.
- Open an integrated Museum Info section about affordable shared internet access and computer-shop culture.

### Performance Room

#### Reality TV Vote

- Browse fictional nominee profiles.
- Submit a simulated SMS vote.
- View live-looking fictional results and personal vote history.
- Explore how mobile participation changed Philippine television.

#### OPM Media Player

- Browse and play silent or original period-inspired fictional tracks.
- Use playback controls and a visualizer.
- Create a playlist and mark favorites.
- Read liner notes connecting the interface to the 2000s OPM band scene.
- No copyrighted music or artist recordings are bundled.

#### PinoyTube

- Browse fictional early-web video listings.
- Experience a simulated buffering and playback sequence.
- Rate, favorite, and leave a preset comment on videos.
- Display fictional view counts and explain early Filipino online fame.

### Globalization Room

#### TV Tambayan

- Switch among fictional Asianovela, anime, karaoke, and mall-show channels.
- Browse a program schedule and save favorites.
- Change subtitle or Filipino-dub preferences where appropriate.
- Reveal cultural notes about imported media and Filipino localization.

#### Chat Archives

- Switch between original Yahoo Messenger-inspired and mIRC-inspired interfaces.
- Browse contacts and channels, change presence, and send preset or custom messages.
- Use BUZZ-style feedback and period-inspired emoticons.
- Discover curated conversation fragments and their historical explanations.

#### P-pop Passport

- Explore a visual map of regional and global cultural influences.
- Move through eras and collect stamps.
- Connect influences to localized Filipino performance and identity.
- Track completed routes and the transition toward later P-pop.

All names, messages, profiles, nominees, tracks, videos, and programs are fictional reconstructions unless a cited source explicitly identifies a historical fact.

## Interaction Depth

The flagship apps target approximately seven to ten meaningful actions and a repeatable interaction loop. Supporting apps target approximately four to seven meaningful actions. These are design guides rather than quotas: controls must produce understandable changes and must not exist merely to increase the count.

Every app must:

1. Look usable immediately after opening.
2. Let the visitor make choices or enter information.
3. Produce visible feedback or results.
4. Allow the visitor to revise or revisit those results.
5. Preserve meaningful progress locally.
6. Integrate museum interpretation within its own interface.

## Window Manager

Each application registers an identifier, title, icon, room, default position, default size, minimum size, and persistence version. The shared window manager owns runtime window state.

Supported behavior:

- Multiple overlapping windows
- Dragging from title bars
- Resizing from edges and corners
- Minimize, maximize, restore, and close
- Individual taskbar buttons for all running apps
- Click-to-focus and predictable z-order
- Cascaded initial positions
- Boundary protection so title bars and controls remain recoverable
- Maximization within the desktop area above the taskbar
- Restoration to the previous non-maximized size and position
- Restore-default-layout control

The implementation intentionally omits desktop file management, operating-system settings, snap layouts, virtual desktops, background processes, and a general-purpose filesystem.

## Visual Direction

The interface uses an original visual system inspired by early-2000s Filipino home computers:

- Blue taskbar, green Start control, task buttons, system tray, and live clock
- Colorful, recognizable app icons and concise labels
- Chunky title bars, beveled controls, compact menus, and familiar window buttons
- Distinct visual character for each app within a coherent OS shell
- Room colors used as restrained organizational accents
- Purposeful opening, minimizing, restoring, message, notification, and buffering motion
- Filipino period details such as prepaid load, peso pricing, computer-shop language, usernames, statuses, and text conventions
- Modern readability, contrast, focus visibility, and practical target sizes beneath the retro surface

The product will not copy original branded interfaces pixel for pixel. Brand names may appear as historical subjects, while graphics, profiles, messages, and UI compositions remain original educational recreations.

## Museum Interpretation

Each app contains an integrated Museum Info area appropriate to its interface. It includes:

- Exhibit title and relevant years
- A concise description
- “Why it mattered” interpretation
- Connections to the room theme
- Sources and asset credits
- A clear reconstruction notice when applicable

Museum Info must feel like part of the app rather than a generic modal pasted across all nine experiences.

## Local Persistence

Browser local storage preserves:

- Per-app choices, authored text, discoveries, favorites, playlists, votes, messages, and stamps
- Per-app completion state
- Open, minimized, and maximized windows
- Window position, size, and stacking order
- Last active room and application
- Recently opened applications

Persisted records use explicit schema versions. Invalid, incompatible, or corrupted data resets only the affected record when possible. A visitor can reset one app, restore the default window layout, or reset all museum data. Reset actions require clear confirmation and never affect unrelated browser data.

## Accessibility and Responsive Scope

- Full keyboard access for app launching, taskbar switching, window controls, and app interaction
- Visible focus states and meaningful accessible names
- Screen-reader-friendly window titles and control labels
- Reduced-motion support
- Readable contrast and enforced minimum window dimensions
- Recovery controls for windows that become unreachable after viewport changes
- Desktop and laptop screens receive the full museum OS
- Screens below the supported width continue to receive an honest desktop recommendation rather than a squeezed or incomplete simulation

## Architecture

The feature is divided into four independently understandable layers:

1. **Museum content:** room metadata, interpretation, sources, and app catalog.
2. **Window system:** window lifecycle, geometry, focus, stacking, taskbar integration, and layout persistence.
3. **App runtime:** a registry that maps app identifiers to metadata, components, default state, and persistence versions.
4. **Museum apps:** nine isolated applications that own their domain-specific interactions and expose completion information.

App-specific state does not enter the global window reducer. The window system stores only lifecycle and geometry. Each app owns and validates its saved content through a shared persistence adapter. This prevents one complex global state object from coupling all nine applications.

## Failure Handling

- Invalid window geometry is clamped to the current desktop.
- Unknown app identifiers are ignored and removed from the restored session.
- A failed app-state migration resets that app and preserves other museum progress.
- Unsupported storage or quota errors fall back to the current in-memory session with a non-blocking notice.
- Missing optional visual or sound assets fall back to meaningful text; controls with no working behavior are not shown.

## Testing Strategy

### Unit tests

- Window reducer lifecycle, focus, stacking, geometry, maximize/restore, and boundary behavior
- Local-storage serialization, validation, migrations, and selective reset
- Individual app state transitions and completion rules

### Component tests

- Dragging and resizing through the supported pointer/keyboard controls
- Taskbar buttons and window controls
- Main interaction loop and Museum Info access for every app
- Accessible labels, focus restoration, and reduced-motion behavior

### Browser journeys

- Open several apps, overlap them, change focus, minimize, restore, maximize, resize, and close
- Refresh and recover window layouts and app progress
- Explore all three room folders and launch all nine apps
- Complete the three flagship interaction loops
- Reset one app and then reset all museum data
- Verify the narrow-screen recommendation and desktop browser compatibility

## Delivery Boundaries

This design does not add authentication, cloud synchronization, multiplayer behavior, real messaging, real social profiles, streaming media, analytics, databases, or external application APIs. The museum must remain deployable as a static Next.js application.

Implementation will proceed phase by phase. Each implementation phase must be demonstrated to the project owner and explicitly approved before the next phase begins.
