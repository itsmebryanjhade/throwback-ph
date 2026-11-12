# ASL: A tour of 2000–2010

ASL (Archive · Share · Learn) is a desktop-first virtual museum about Philippine popular culture from 2000 to 2010. It presents twelve exhibits through a Filipino Y2K computer-desktop experience, with guided and free-exploration modes.

Live museum: [throwback-ph.vercel.app](https://throwback-ph.vercel.app/).

## Open and run

1. Open this `throwback-ph` folder in VS Code.
2. Open the VS Code terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

The complete museum is designed for laptop and desktop screens. Visitors on screens below 768 px receive a recommendation to use a larger display.

## Commands

- `npm run dev` — local development server
- `npm test` — unit and component tests
- `npm run lint` — code-quality checks
- `npm run build` — optimized static production build
- `npm run start` — preview the production build
- `npm run test:e2e` — Playwright browser journeys

## Museum structure

- Technology: Nokia & SMS Culture, Internet Café Life, Friendster Era, Power of Text
- Performance: Reality TV Participation, OPM Band Scene, Karaoke & Mall Shows, Early YouTube Fame
- Globalization: Asianovela Craze, Anime on Philippine TV, Chat Archives, From Foreign Influence to P-pop

Nine interactive applications run in overlapping, draggable, resizable windows: Friendster PH, Nokia Messages, Net Café Manager, Reality TV Vote, OPM Media Player, PinoyTube, TV Tambayan, Chat Archives (Yahoo Messenger and mIRC), and P-pop Passport. Visitor progress is saved in the browser.

## Deployment

The GitHub repository is connected to Vercel. Commit your changes and push to `main`; Vercel automatically builds the project and updates [the live museum](https://throwback-ph.vercel.app/) after a successful build. No application environment variables, database, or external media service is required.

`.vercelignore` excludes development tools, backups, build caches, and tests from the upload. Deployment copies of large videos are compressed to 360p with their aspect ratios preserved; the anime is a three-minute museum excerpt. The full originals are backed up locally in the ignored `work/media-originals` folder.

Before submission, run:

```text
npm test
npm run lint
npm run build
npm run test:e2e
```

Do not introduce new features on November 3. Apply only submission-blocking fixes after the group review.

## Credits and limitations

The interfaces are CSS recreations inspired by early-2000s computers and phones. Exhibit media include licensed archival material and user-supplied classroom copies; their credits and usage notes are recorded in `content/media.ts`, `docs/asset-credits.md`, and inside the exhibits. Redistribution rights for the supplied classroom copies have not been independently verified.

The museum recreates selected interactions for exploration and classroom presentation. It is designed for desktop and laptop screens; a complete mobile layout is outside the submission scope.
