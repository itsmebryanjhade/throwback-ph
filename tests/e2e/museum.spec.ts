import { expect, test } from "@playwright/test";

async function openWelcome(page: import("@playwright/test").Page) {
  await page.goto("/");
  const skip = page.getByRole("button", { name: "Skip intro" });
  try {
    await skip.click({ timeout: 2000 });
  } catch {
    // Boot sequence already finished or transitioned
  }
  await expect(page.getByRole("dialog", { name: /Welcome to Throwback PH/i })).toBeVisible({ timeout: 10000 });
}

async function expectNoDocumentOverflow(page: import("@playwright/test").Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("shared desktop windows remain readable and adaptive", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop windows are intentionally unavailable on narrow screens.");
  await page.setViewportSize({ width: 1366, height: 768 });
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();
  await page.getByRole("button", { name: /Open Net Café Manager/i }).click();

  const appWindow = page.getByRole("dialog", { name: "Net Café Manager" });
  await expect(appWindow).toHaveAttribute("data-window-mode", "standard");
  await expectNoDocumentOverflow(page);

  const maximize = appWindow.getByRole("button", { name: "Maximize Net Café Manager" });
  await maximize.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(maximize).toBeFocused();
  await expect(maximize).toHaveCSS("outline-style", "solid");
  await maximize.click();
  await expect(appWindow).toHaveAttribute("data-window-mode", "maximized");

  await page.setViewportSize({ width: 1440, height: 900 });
  await expectNoDocumentOverflow(page);
});

test("visitor completes the guided twelve-exhibit tour", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop tour is intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Start Tour" }).click();
  await expect(page.getByRole("heading", { name: "Nokia & SMS Culture" })).toBeVisible();
  for (let index = 0; index < 11; index += 1) await page.getByRole("button", { name: "Next exhibit" }).click();
  await expect(page.getByRole("heading", { name: "From Foreign Influence to P-pop" })).toBeVisible();
  await page.getByRole("button", { name: "Finish tour" }).click();
  await expect(page.getByRole("heading", { name: "The decade changed together." })).toBeVisible();
});

test("free exploration preserves a minimized room and exposes signature interactions", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop tour is intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();
  await page.getByRole("button", { name: "Open Technology" }).click();
  await page.getByRole("button", { name: /Forwarded: EDSA update/ }).click();
  await expect(page.getByText(/people are gathering at EDSA/i)).toBeVisible();
  await page.getByRole("button", { name: "Minimize museum" }).click();
  await page.getByRole("button", { name: "Restore Throwback PH" }).click();
  await expect(page.getByText(/people are gathering at EDSA/i)).toBeVisible();

  await page.getByRole("tab", { name: "Globalization" }).click();
  await page.getByRole("button", { name: "View exhibit: Chat Archives" }).click();
  await page.getByRole("tab", { name: "mIRC" }).click();
  await expect(page.getByText(/joined #pinoytambayan/i)).toBeVisible();
});

test("small screens receive the desktop recommendation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "narrow-screen", "Narrow-screen behavior has its own project.");
  await page.goto("/");
  await expect(page.getByText(/desktop or laptop/i)).toBeVisible();
  await expect(page.getByTestId("museum-desktop")).toBeHidden();
});

test("visitor opens Friendster PH, switches skin, posts bulletin, and receives OS toast notification", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch Friendster PH from desktop icon
  await page.getByRole("button", { name: /Open Friendster PH/i }).click();
  const friendsterWindow = page.getByRole("dialog", { name: "Friendster PH" });
  await expect(friendsterWindow).toBeVisible();

  // Switch skin
  await friendsterWindow.getByRole("button", { name: /Cyber Café Neon/i }).click();
  await expect(page.getByRole("heading", { name: "Profile Skin Changed" })).toBeVisible();

  // Bulletins tab
  await friendsterWindow.getByRole("tab", { name: /Bulletins/i }).click();
  await friendsterWindow.getByRole("button", { name: "✎ Post Bulletin" }).click();
  await friendsterWindow.getByRole("textbox", { name: "Subject / Title" }).fill("E2E Test Bulletin");
  await friendsterWindow.getByRole("textbox", { name: "Message" }).fill("Testing Friendster bulletin posting on Playwright.");
  await friendsterWindow.getByRole("button", { name: "Publish Bulletin" }).click();

  await expect(friendsterWindow.getByText("E2E Test Bulletin")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bulletin Posted" })).toBeVisible();
});

test("visitor opens Nokia Messages, composes an SMS, triggers toast, and explores EDSA II sequence", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch Nokia Messages from desktop icon
  await page.getByRole("button", { name: /Open Nokia Messages/i }).click();
  const nokiaWindow = page.getByRole("dialog", { name: "Nokia Messages" });
  await expect(nokiaWindow).toBeVisible();

  // Check prepaid balance badge
  await expect(nokiaWindow.getByText(/Load: ₱35.00/i)).toBeVisible();

  // Switch to Write tab and use quick reply preset
  await nokiaWindow.getByRole("tab", { name: /Write/i }).click();
  await nokiaWindow.getByLabel(/To \/ Recipient/i).fill("Kiko Reyes");
  await nokiaWindow.getByRole("button", { name: /\+ “Wer u na\? D2 na me\.”/i }).click();
  await nokiaWindow.getByRole("button", { name: /Send SMS to Kiko Reyes/i }).click();

  // Toast confirmation
  await expect(page.getByRole("heading", { name: "SMS Sent" })).toBeVisible();
  await expect(nokiaWindow.getByText(/Load: ₱34.00/i)).toBeVisible();

  // Explore EDSA II timeline
  await nokiaWindow.getByRole("tab", { name: /EDSA II/i }).click();
  await expect(nokiaWindow.getByText(/The World’s First “Coup de Text”/i)).toBeVisible();
  await nokiaWindow.getByRole("button", { name: "Next timeline step" }).click();
  await expect(nokiaWindow.getByText("★ Widely Reported SMS Wording")).toBeVisible();
  await expect(nokiaWindow.getByText("Go 2 EDSA Wear blk.").first()).toBeVisible();
});

test("visitor opens Net Café Manager, rents a PC, advances simulated time, and views museum context", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch Net Café Manager from desktop icon
  await page.getByRole("button", { name: /Open Net Café Manager/i }).click();
  const netcafeWindow = page.getByRole("dialog", { name: "Net Café Manager" });
  await expect(netcafeWindow).toBeVisible();

  // Verify header and cashier till
  await expect(netcafeWindow.getByText(/Net Café Manager v3.2/i)).toBeVisible();
  await expect(netcafeWindow.getByText(/Cash Register:/i)).toBeVisible();

  // Rent available PC 02
  await netcafeWindow.getByRole("button", { name: /Start Session on PC 02 - Net Champion/i }).click();
  await netcafeWindow.getByLabel(/Customer Name \/ Gamer Tag/i).fill("Dota_Master_PH");
  await netcafeWindow.getByRole("button", { name: /Confirm Rental & Start Session on PC 02 - Net Champion/i }).click();

  // Toast confirmation
  await expect(page.getByRole("heading", { name: "Session Started" })).toBeVisible();
  await expect(netcafeWindow.getByText(/User: Dota_Master_PH/i)).toBeVisible();

  // Return to Terminals tab and test deterministic time simulation
  await netcafeWindow.getByRole("tab", { name: /Terminals/i }).click();
  await netcafeWindow.getByRole("button", { name: /Advance simulated time by 15 minutes/i }).click();

  // View Museum Info tab
  await netcafeWindow.getByRole("tab", { name: /Museum Info/i }).click();
  await expect(netcafeWindow.getByText("Computer Shops & Cybercafé Culture in the Philippines")).toBeVisible();
  await expect(netcafeWindow.getByText(/Sachet-priced access/i)).toBeVisible();
  await netcafeWindow.getByRole("button", { name: "Maximize Net Café Manager" }).click();
  await expect(netcafeWindow).toHaveAttribute("data-window-mode", "maximized");
  await expectNoDocumentOverflow(page);
});

test("visitor opens Reality TV Vote, casts simulated SMS vote, inspects standings, and triggers crowd surge", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch Reality TV Vote from desktop icon
  await page.getByRole("button", { name: /Open Reality TV Vote/i }).click();
  const tvWindow = page.getByRole("dialog", { name: "Reality TV Vote" });
  await expect(tvWindow).toBeVisible();

  // Verify eviction banner and starting load
  await expect(tvWindow.getByText(/WEEK 7 EVICTION NIGHT IS LIVE!/i)).toBeVisible();
  await expect(tvWindow.getByText("₱45.00").first()).toBeVisible();

  // Cast 1 vote
  await tvWindow.getByRole("button", { name: /Cast 1 vote for Bea Valderama/i }).click();
  await expect(page.getByRole("heading", { name: "Vote Cast" })).toBeVisible();
  await expect(tvWindow.getByText("₱42.50").first()).toBeVisible();

  // Live standings tab & crowd surge
  await tvWindow.getByRole("tab", { name: /Live Standings/i }).click();
  await tvWindow.getByRole("button", { name: /Simulate incoming crowd surge votes/i }).click();
  await expect(page.getByRole("heading", { name: "Crowd Surge Simulated" })).toBeVisible();
  await tvWindow.getByRole("button", { name: "Maximize Reality TV Vote" }).click();
  await expect(tvWindow).toHaveAttribute("data-window-mode", "maximized");
  await expectNoDocumentOverflow(page);
});

test("visitor opens OPM Media Player, plays track, switches visualizer, inspects playlist, and reads liner notes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch OPM Media Player from desktop icon
  await page.getByRole("button", { name: /Open OPM Media Player/i }).click();
  const opmWindow = page.getByRole("dialog", { name: "OPM Media Player" });
  await expect(opmWindow).toBeVisible();

  // Verify LCD screen and initial stopped state
  await expect(opmWindow.getByTestId("lcd-track-title")).toBeVisible();
  await expect(opmWindow.getByTestId("visualizer-bars")).toBeVisible();
  await expect(opmWindow.getByLabel("Play Dizzy Spells")).toHaveAttribute(
    "src",
    "/museum/phase-9/media/dizzy-spells-acoustic.mp3",
  );
  await expect(opmWindow.getByRole("link", { name: /Source & license/i })).toBeVisible();

  // Play track
  await opmWindow.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Now Playing" })).toBeVisible();

  // Toggle visualizer mode
  await opmWindow.getByRole("button", { name: /Toggle: Wave Mode/i }).click();
  await expect(opmWindow.getByTestId("visualizer-wave")).toBeVisible();

  // Switch to Playlist tab
  await opmWindow.getByRole("tab", { name: /Playlist/i }).click();
  await expect(opmWindow.getByText("Dizzy Spells")).toBeVisible();

  // Switch to Liner Notes tab
  await opmWindow.getByRole("tab", { name: /Liner Notes/i }).click();
  await expect(opmWindow.getByText(/NU 107 & The College Radio Wave/i)).toBeVisible();
});

test("visitor opens PinoyTube, rates video, browses categories, and views grassroots museum context", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch PinoyTube from desktop icon
  await page.getByRole("button", { name: /Open PinoyTube/i }).click();
  const tubeWindow = page.getByRole("dialog", { name: "PinoyTube" });
  await expect(tubeWindow).toBeVisible();

  // Verify header and initial video
  await expect(tubeWindow.getByText(/PinoyTube Broadcast/i)).toBeVisible();
  await expect(tubeWindow.getByRole("heading", { name: "Campus Dance Practice" })).toBeVisible();
  await expect(tubeWindow.getByLabel(/Play 8D Digital/i)).toHaveAttribute(
    "src",
    "/museum/phase-9/media/manila-aerial.webm",
  );
  await expect(tubeWindow.getByText(/Archival context reel:/i)).toBeVisible();

  // Rate video
  await tubeWindow.getByRole("button", { name: /Rate 5 stars/i }).click();
  await expect(page.getByRole("heading", { name: "Video Rated" })).toBeVisible();

  // Browse categories and switch video
  await tubeWindow.getByRole("tab", { name: /Browse Categories/i }).click();
  await tubeWindow.getByRole("button", { name: /Watch Acoustic Bedroom Cover/i }).click();
  await expect(tubeWindow.getByRole("heading", { name: "Acoustic Bedroom Cover" })).toBeVisible();

  // Upload Studio simulation disclaimer
  await tubeWindow.getByRole("tab", { name: /Upload Video/i }).click();
  await expect(tubeWindow.getByRole("note")).toContainText(
    "metadata-only local simulation: no real video is selected, uploaded, transmitted, or converted to FLV",
  );

  // Museum Info
  await tubeWindow.getByRole("tab", { name: /Museum Info/i }).click();
  await expect(tubeWindow.getByText(/Grassroots Video & Bedroom Stardom/i)).toBeVisible();
  await expect(tubeWindow.getByText(/YouTube at 15: My personal journey and the road ahead/i)).toBeVisible();
});

test("visitor opens TV Tambayan, switches channels with remote, changes localization mode, and views Asianovela museum info", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch TV Tambayan from desktop icon
  await page.getByRole("button", { name: /Open TV Tambayan/i }).click();
  const tvWindow = page.getByRole("dialog", { name: "TV Tambayan" });
  await expect(tvWindow).toBeVisible();

  // Verify CRT screen and Asianovela broadcast
  await expect(tvWindow.getByRole("heading", { name: "Meteor Garden Feature" })).toBeVisible();
  await expect(tvWindow.getByText("[TV 02]")).toBeVisible();
  await expect(tvWindow.getByLabel(/Play 8D Digital/i)).toHaveAttribute(
    "src",
    "/museum/phase-9/media/manila-aerial.webm",
  );
  await expect(tvWindow.getByText(/Archival context reel:/i)).toBeVisible();

  // Switch channel to CH 07 Hapon Anime Block using remote
  await tvWindow.getByRole("button", { name: /Tune to Channel 07: Hapon Anime Block/i }).click();
  await expect(page.getByRole("heading", { name: "Channel Tuned" })).toBeVisible();
  await expect(tvWindow.getByRole("heading", { name: "Tagalized Anime Feature" })).toBeVisible();
  await expect(tvWindow.getByText("[CH 07]")).toBeVisible();

  // Change audio localization mode
  await tvWindow.getByLabel(/Taglish Subtitles/i).click();
  await expect(page.getByRole("heading", { name: "Audio \/ Subtitle Changed" })).toBeVisible();

  // Program Guide
  await tvWindow.getByRole("tab", { name: /Program Guide/i }).click();
  await expect(tvWindow.getByText(/Daily Broadcast Schedule Guide/i)).toBeVisible();

  // Museum Info
  await tvWindow.getByRole("tab", { name: /Museum Info/i }).click();
  await expect(tvWindow.getByText(/The Asianovela Craze & Tagalized Television/i)).toBeVisible();
  await expect(
    tvWindow.getByText(/Lalaki Dao, Babae Sha: Meteor Garden and Its Gender\(ed\) Representations in Retrospect/i),
  ).toBeVisible();
  await expect(
    tvWindow.getByText(/Arts and Cultural Exchange: Japanese Media Arts and Popular Culture/i),
  ).toBeVisible();
});

test("visitor opens Chat Archives, sends Yahoo message, triggers BUZZ!, switches to mIRC, and views Museum Info", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch Chat Archives from desktop icon
  await page.getByRole("button", { name: /Open Chat Archives/i }).click();
  const chatWindow = page.getByRole("dialog", { name: /Chat Archives/i });
  await expect(chatWindow).toBeVisible();

  // Verify Yahoo Messenger header and active contact
  await expect(chatWindow.getByText(/Chat Archives: Instant Messaging Portal/i)).toBeVisible();
  await expect(chatWindow.getByText("xX_angel_Xx").first()).toBeVisible();

  // Send a custom chat message
  const input = chatWindow.getByLabel(/Type a message/i);
  await input.fill("Comp shop tayo mamaya!");
  await chatWindow.getByRole("button", { name: "Send" }).click();
  await expect(chatWindow.getByText("Comp shop tayo mamaya!")).toBeVisible();

  // Trigger BUZZ!
  await chatWindow.getByRole("button", { name: /⚡ BUZZ!/i }).click();
  await expect(page.getByRole("heading", { name: /⚡ Yahoo! BUZZ Sent/i })).toBeVisible();

  // Switch to mIRC client
  await chatWindow.getByRole("button", { name: /🔵 mIRC Client/i }).click();
  await expect(
    chatWindow.getByRole("listbox", { name: "IRC Channels" }).getByRole("option", { name: /#pinoytambayan/i }),
  ).toBeVisible();

  // Museum Info
  await chatWindow.getByRole("tab", { name: /🏛️ Museum Info/i }).click();
  await expect(chatWindow.getByText(/Instant Presence & Global Barkadas/i)).toBeVisible();
  await expect(chatWindow.getByText(/Yahoo! Messenger Help and Feature Archive/i)).toBeVisible();
});

test("visitor opens P-pop Passport, inspects identity, stamps visa, completes exploration trail, and views Museum Info", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();

  // Launch P-pop Passport from desktop icon
  await page.getByRole("button", { name: /Open P-pop Passport/i }).click();
  const passportWindow = page.getByRole("dialog", { name: /P-pop Passport/i });
  await expect(passportWindow).toBeVisible();

  // Verify booklet and traveler identity
  await expect(passportWindow.getByText(/REPUBLIKA NG PILIPINAS/i)).toBeVisible();
  await expect(passportWindow.getByText("Street Dance & B-Boy Crews").first()).toBeVisible();

  // Select Asianovela Mandopop Wave and stamp passport
  await passportWindow.getByText("Asianovela Mandopop Wave").first().click();
  await passportWindow.getByRole("button", { name: /🔖 Stamp This Landmark in My Passport/i }).click();
  await expect(page.getByRole("heading", { name: /🔖 Visa Stamp Claimed/i })).toBeVisible();

  // Exploration Trails tab
  await passportWindow.getByRole("tab", { name: /🧭 Exploration Trails/i }).click();
  await expect(passportWindow.getByText("The Dance & Choreography Trail")).toBeVisible();

  // Museum Info
  await passportWindow.getByRole("tab", { name: /🏛️ Museum Info/i }).click();
  await expect(passportWindow.getByText(/Transnational Rhythms & Local Identity/i)).toBeVisible();
  await expect(passportWindow.getByText(/Cultural Center of the Philippines/i)).toBeVisible();
  await passportWindow.getByRole("button", { name: /Maximize P-pop Passport/i }).click();
  await expect(passportWindow).toHaveAttribute("data-window-mode", "maximized");
  await expectNoDocumentOverflow(page);
});

test("saved app progress survives refresh and reset remains selective", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "narrow-screen", "Desktop apps are intentionally unavailable on narrow screens.");
  await openWelcome(page);
  await page.getByRole("button", { name: "Explore Freely" }).click();
  await page.evaluate(() => localStorage.setItem("unrelated-site-setting", "keep-me"));

  await page.getByRole("button", { name: /Open Friendster PH/i }).click();
  await page.getByRole("dialog", { name: "Friendster PH" })
    .getByRole("button", { name: /Cyber Café Neon/i })
    .click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("throwback-ph:app:friendster")))
    .toContain("cyber-neon");

  await page.reload();
  await expect(page.getByRole("dialog", { name: "Friendster PH" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("throwback-ph:app:friendster")))
    .toContain("cyber-neon");

  await page.getByRole("button", { name: "Start", exact: true }).click();
  const resetItem = page.getByRole("menuitem", { name: "Reset Friendster PH progress", exact: true });
  await resetItem.click();
  const confirmation = page.getByRole("alertdialog", { name: "Reset Friendster PH?" });
  await expect(confirmation.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(confirmation).toBeHidden();
  await expect(resetItem).toBeFocused();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("throwback-ph:app:friendster")))
    .toContain("cyber-neon");

  await resetItem.click();
  await page.getByRole("alertdialog", { name: "Reset Friendster PH?" })
    .getByRole("button", { name: "Reset Friendster PH", exact: true })
    .click();
  await expect(page.evaluate(() => localStorage.getItem("unrelated-site-setting"))).resolves.toBe("keep-me");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("throwback-ph:app:friendster")))
    .toContain("classic-orange");
});





