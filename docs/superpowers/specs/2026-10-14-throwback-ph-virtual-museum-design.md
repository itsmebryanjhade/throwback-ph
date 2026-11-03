# Throwback PH Virtual Museum Design

Date: October 14, 2026  
Submission deadline: November 3, 2026  
Owner and primary developer: Project owner
Course: MO-HUM080 Philippine Popular Culture

## Purpose

Throwback PH is an interactive virtual museum about Philippine popular culture from 2000 to 2010. The website will explain how Technology, Performance, and Globalization shaped the country's transition from analog to digital culture.

The project must satisfy two goals:

1. Deliver a complete, clear, and properly sourced class project by November 3, 2026.
2. Produce a polished experience that the owner can later present as a portfolio project.

The project will remain intentionally small enough for one designer and developer to finish within the deadline.

## Audience

The primary audience is Gen Z and Gen Alpha students who did not fully experience the 2000s. Secondary audiences include millennials, instructors, classmates, and visitors interested in Philippine popular culture.

The website is designed for laptop and desktop browsers. A small-screen notice will recommend opening it on a larger screen rather than attempting to reproduce the complete desktop experience on phones.

## Core Concept

The Filipino 2000s computer desktop becomes the museum building itself.

- Desktop icons act as museum doors.
- Application windows act as gallery spaces.
- The taskbar acts as the visitor's navigation system.
- Familiar interfaces such as Internet Explorer, Friendster, Yahoo Messenger, mIRC, and a Nokia phone become exhibit containers.

The result should feel nostalgic and interactive while remaining organized like a real museum. It should not become a collection of unrelated mini-applications.

## Experience Model

The museum uses hybrid navigation.

### Guided path

1. A short, skippable boot screen introduces Throwback PH.
2. The desktop loads with one Welcome window open.
3. The visitor selects Start Tour.
4. The visitor moves through Technology, Performance, and Globalization in that order.
5. A final screen connects the three themes and offers links to revisit rooms, view sources, or return to the desktop.

### Free exploration

The visitor can close the Welcome or museum window and open any room from its desktop icon. Open rooms appear on the taskbar. Only one main museum room is visible at a time to avoid clutter.

## Museum Rooms and Exhibits

Each room contains four exhibits. Every exhibit includes one strong visual or interface recreation, a concise explanation, a Why It Mattered takeaway, and a source or image credit.

### Technology

1. **Nokia and SMS Culture** - prepaid load, unli-text promotions, custom ringtones, and everyday communication.
2. **Internet Cafe Life** - computer shops, hourly rates, multiplayer games, and barkada culture.
3. **Friendster Era** - profiles, testimonials, and early online identity.
4. **Power of Text** - the political and cultural importance of SMS, including EDSA II.

### Performance

1. **Reality TV Participation** - Pinoy Big Brother, audience voting, and ordinary people becoming stars.
2. **OPM Band Scene** - Bamboo, Rivermaya, Parokya ni Edgar, Hale, and youth culture.
3. **Karaoke and Mall Shows** - participation through karaoke, school events, concerts, bars, and mall performances.
4. **Early YouTube Fame** - covers, lip-sync videos, and the beginning of online creator culture.

### Globalization

1. **Asianovela Craze** - Meteor Garden, Full House, fashion, hairstyles, and youth culture.
2. **Anime on Philippine Television** - Filipino-dubbed Pokemon, Digimon, and Cardcaptor Sakura.
3. **Chat Archives** - Yahoo Messenger and mIRC as one combined exhibit about online conversation and global connectivity.
4. **From Foreign Influence to P-pop** - the adaptation of global media and the later international reach of Filipino popular culture.

## Signature Interaction

The Nokia phone is the single signature interaction for the submission version. Selecting the phone opens an SMS inbox containing short cultural messages, period details, and an EDSA II entry. It must support keyboard and pointer use and must not block access to the main museum content.

Yahoo Messenger and mIRC will appear together as the Chat Archives exhibit. The submission version may use selectable conversations or tabs, but it will not simulate a complete messaging application.

## Visual Direction

The design follows the principle "the page is the object": the entire page is the 2000s desktop rather than a modern webpage decorated with retro elements.

### Visual language

- A Filipino Windows XP-era atmosphere without directly reproducing Microsoft branding.
- Sky-blue desktop, deep-blue taskbar, green Start button, warm gray window surfaces, and one bright Y2K accent.
- Tahoma- or Verdana-style system typography for the interface.
- One expressive treatment for the Throwback PH identity.
- Solid title bars, crisp controls, and shadows only for elements that visibly float.
- Filipino details such as prepaid-load advertisements, computer-shop pricing signs, Jejemon language, OPM playlists, and local slang.

The design will use the supplied Y2K Virtual Museum HTML as visual reference, not as a requirement to reproduce every application or behavior.

### Imagery

Use properly credited archival images from suitable open sources, government archives, museum collections, and Wikimedia Commons. Supplement them with custom retro interface graphics where an appropriate historical image is unavailable. Every external asset must include a recorded source and license or usage basis.

### Motion

- A two- to three-second skippable boot sequence.
- Window opening, closing, and minimizing feedback.
- Short exhibit transitions.
- Nokia message interaction.
- Visible hover, press, and keyboard-focus states.
- A reduced-motion mode through the user's operating-system preference.

Movement must support the experience rather than compensate for unfinished static design.

## Technical Architecture

### Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Scoped CSS or CSS Modules for detailed retro controls when clearer than long utility-class strings
- Static deployment on Vercel

### Application structure

```text
Application
|- Desktop shell
|  |- Boot screen
|  |- Welcome window
|  |- Desktop icons
|  |- Start menu
|  `- Taskbar
|- Museum window
|  |- Room navigation
|  |- Exhibit list
|  |- Exhibit viewer
|  `- Tour controls
|- Mini experiences
|  |- Nokia SMS inbox
|  `- Chat Archives
`- Content
   |- Technology exhibits
   |- Performance exhibits
   |- Globalization exhibits
   `- Sources and asset credits
```

### State

One client-side state controller will track:

- Whether the boot screen has finished or been skipped.
- Whether the Welcome window is open.
- The active museum room.
- The selected exhibit.
- Whether the visitor is following the guided tour.
- Whether the museum window is open or minimized.
- Whether the Start menu is open.
- Whether optional sound is enabled.

No database, login, external API, CMS, or server-side user data is required.

### Content model

Exhibits will live in typed data files. Each exhibit will have an identifier, room, title, summary, Why It Mattered text, visual reference, alt text, and source list. Interface components will render this data so the content is not duplicated across multiple components.

## Accessibility and Resilience

- All interactive elements use semantic buttons or links.
- Every control has a visible keyboard-focus state.
- Images include useful alt text.
- Text and control colors meet reasonable contrast requirements.
- Sound is off by default and no information relies on sound alone.
- Animations respect prefers-reduced-motion.
- If an asset fails to load, the exhibit retains its title, text, and source information.
- If JavaScript is slow, visible loading feedback appears without blocking the desktop indefinitely.

## Testing

The submission version must be checked on current desktop versions of Chrome, Edge, and Firefox.

Required checks:

- The boot screen can finish and can be skipped.
- Start Tour visits all three rooms in the correct order.
- Previous and Next controls work at room boundaries.
- Closing a room returns to the desktop.
- Desktop icons open the expected rooms.
- Minimize and taskbar restore work.
- Only one main room is visible at a time.
- All twelve exhibits render their content and sources.
- Nokia inbox actions work with mouse and keyboard.
- Chat Archives switches between its available views.
- The sound preference defaults to off.
- The layout remains usable at supported desktop widths.
- A small-screen visitor receives the desktop recommendation.
- Reduced-motion mode removes nonessential travel and delays.
- There are no broken links, missing credits, unreadable text, or overlapping controls.

## Submission Scope

### Required by November 3

- Boot screen
- Desktop and guided Welcome window
- Hybrid navigation
- Three rooms and twelve exhibits
- Taskbar and Start menu
- Nokia SMS interaction
- Combined Chat Archives
- Sources and image credits
- Desktop accessibility and reduced-motion behavior
- Public Vercel deployment

### Deferred until after submission

- Draggable windows
- Multiple overlapping room windows
- Advanced audio system
- Games or quizzes
- Complex animations
- Full mobile experience
- Additional desktop applications and Easter eggs

Deferred items must not delay or destabilize the submission version.

## Delivery Schedule

- **October 15:** lock the specification, copy deck, sources, and asset list.
- **October 16-19:** build the desktop shell, taskbar, icons, and Welcome flow.
- **October 20-24:** build the three rooms and populate all twelve exhibits.
- **October 25-27:** build the Nokia SMS interaction and Chat Archives.
- **October 28-29:** complete visual polish, transitions, and source credits.
- **October 30:** test supported browsers, keyboard use, and reduced motion.
- **October 31:** give the complete version to the group for review.
- **November 1:** apply essential feedback only.
- **November 2:** deploy and complete final submission checks.
- **November 3:** submit without adding new features.

## Completion Criteria

The class version is complete when:

- All three rooms and twelve exhibits contain final content.
- Guided and free-exploration modes work from beginning to end.
- The Nokia and Chat Archives interactions work reliably.
- Every external image and research reference is credited.
- The interface is legible and free of overlapping or broken controls.
- Required browser and accessibility checks pass.
- The final version is publicly available through a stable Vercel URL.
- The group has reviewed the complete version before final deployment.

Portfolio enhancements may begin only after this class version is complete and submitted.
