import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

describe("Phase 6 — OPM Media Player Application", () => {
  it("opens OPM Media Player from desktop, displays LCD screen, and shows visualizer", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open OPM Media Player from desktop icon
    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));

    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });
    expect(windowDialog).toBeInTheDocument();

    // Check LCD screen marquee & time
    expect(within(windowDialog).getByTestId("lcd-track-title")).toHaveTextContent(
      /Josh Woodward - Dizzy Spells/i
    );
    expect(within(windowDialog).getByTestId("lcd-time-display")).toHaveTextContent("00:00");

    // Check visualizer is present
    expect(within(windowDialog).getByTestId("visualizer-bars")).toBeInTheDocument();

    // Check taskbar button
    expect(screen.getByRole("button", { name: "OPM Media Player" })).toBeInTheDocument();
  });

  it("handles playback transport controls (Play, Pause, Stop, Next, Toggle Favorite)", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });

    // Play track
    const playBtn = within(windowDialog).getByRole("button", { name: "Play" });
    fireEvent.click(playBtn);

    // Toast appears
    expect(screen.getByRole("heading", { name: "Now Playing" })).toBeInTheDocument();

    // Pause track
    const pauseBtn = within(windowDialog).getByRole("button", { name: "Pause" });
    fireEvent.click(pauseBtn);

    // Next track
    const nextBtn = within(windowDialog).getByRole("button", { name: "Next Track" });
    fireEvent.click(nextBtn);

    expect(within(windowDialog).getByTestId("lcd-track-title")).toHaveTextContent(
      /Hale - The Day You Said Goodnight/i
    );
    expect(
      within(windowDialog)
        .getByRole("img", { name: /Hale album cover/i })
        .getAttribute("src"),
    ).toContain(
      "%2Fmuseum%2Fphase-9%2Fmedia%2Fopm%2Fcover%2Fhale-cover.jpg",
    );

    // Toggle favorite
    const favBtn = within(windowDialog).getByRole("button", { name: /favorite/i });
    fireEvent.click(favBtn);

    expect(screen.getByRole("heading", { name: /Favorites/i })).toBeInTheDocument();
  });

  it("switches visualizer mode between Spectrum Bars and Waveform", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });

    expect(within(windowDialog).getByTestId("visualizer-bars")).toBeInTheDocument();

    const toggleModeBtn = within(windowDialog).getByRole("button", {
      name: /Toggle: Wave Mode/i,
    });
    fireEvent.click(toggleModeBtn);

    expect(within(windowDialog).getByTestId("visualizer-wave")).toBeInTheDocument();
  });

  it("interacts with Playlist panel and filters by genre", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });

    // Switch to Playlist tab
    const playlistTab = within(windowDialog).getByRole("tab", { name: /Playlist/i });
    fireEvent.click(playlistTab);

    // Check tracks in table
    expect(within(windowDialog).getByText("Dizzy Spells")).toBeInTheDocument();
    expect(within(windowDialog).getByText("The Day You Said Goodnight")).toBeInTheDocument();
    expect(within(windowDialog).getByText("Narda")).toBeInTheDocument();

    // Filter by genre
    const genreSelect = within(windowDialog).getByLabelText(/Genre:/i);
    fireEvent.change(genreSelect, { target: { value: "Acoustic Pop" } });

    expect(within(windowDialog).getByText("Dizzy Spells")).toBeInTheDocument();
    expect(within(windowDialog).queryByText("Narda")).not.toBeInTheDocument();
  });

  it("plays the supplied local listening copies as tracks change", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });
    expect(within(windowDialog).getByLabelText("Play Dizzy Spells")).toHaveAttribute(
      "src",
      "/museum/phase-9/media/dizzy-spells-acoustic.mp3",
    );
    expect(within(windowDialog).getByText(/Josh Woodward · Creative Commons/)).toBeInTheDocument();

    fireEvent.click(within(windowDialog).getByRole("button", { name: "Next Track" }));
    expect(within(windowDialog).getByLabelText("Play The Day You Said Goodnight")).toHaveAttribute(
      "src",
      "/museum/phase-9/media/opm/hale-the-day-you-said-goodnight.mp3",
    );
    expect(within(windowDialog).queryByText(/listening copy unavailable/i)).not.toBeInTheDocument();
  });

  it("seeks the real audio element from the custom progress bar", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });
    const audio = within(windowDialog).getByLabelText("Play Dizzy Spells") as HTMLAudioElement;
    fireEvent.change(within(windowDialog).getByLabelText("Seek track position"), { target: { value: "45" } });
    expect(audio.currentTime).toBe(45);
    expect(within(windowDialog).getByTestId("lcd-time-display")).toHaveTextContent("00:45");
  });

  it("displays Liner Notes and Museum Info with real NCCA sources", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    const windowDialog = screen.getByRole("dialog", { name: "OPM Media Player" });

    // 1. Liner Notes tab
    const notesTab = within(windowDialog).getByRole("tab", { name: /Liner Notes/i });
    fireEvent.click(notesTab);

    expect(within(windowDialog).getByText(/NU 107 & The College Radio Wave/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Nero Burning ROM, MP3s & Burned CD-Rs/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/The Campus Gig Circuit/i)).toBeInTheDocument();
    // Verify door fee is qualified as period-inspired recollection
    expect(
      within(windowDialog).getByText(/period-remembered as modest door charges of around ₱50 to ₱100/i)
    ).toBeInTheDocument();
    expect(
      within(windowDialog).getByText(
        /Referenced door charges reflect period-inspired recollections rather than standardized nationwide historical tariffs/i
      )
    ).toBeInTheDocument();

    // 2. Museum Info tab
    const museumTab = within(windowDialog).getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(museumTab);

    expect(
      within(windowDialog).getByText(/2000–2008 · Pinoy Rock, Acoustic Pop & Digital Subcultures/i)
    ).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();
    expect(
      within(windowDialog).getByText(
        /Any referenced door charges or gig recollections reflect period-inspired memories rather than standardized historical tariffs/i
      )
    ).toBeInTheDocument();

    const nccaRockLink = within(windowDialog).getByRole("link", {
      name: /Confessions of a Rock Journalist/i,
    });
    expect(nccaRockLink).toHaveAttribute(
      "href",
      "https://ncca.gov.ph/about-culture-and-arts/in-focus/confessions-of-a-rock-journalist-or-some-disjointed-ramblings-on-pinoy-rock-n-roll/"
    );
  });
});
