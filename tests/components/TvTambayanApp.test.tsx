import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { WindowManagerProvider } from "@/lib/window-system/WindowContext";
import { NotificationProvider } from "@/lib/notification-system/NotificationContext";
import { allAppRegistrations } from "@/lib/apps/catalog";
import { TvTambayanApp } from "@/components/apps/tvtambayan/TvTambayanApp";

function renderWithProviders() {
  return render(
    <WindowManagerProvider registrations={allAppRegistrations}>
      <NotificationProvider>
        <TvTambayanApp />
      </NotificationProvider>
    </WindowManagerProvider>,
  );
}

describe("Phase 7 — TV Tambayan Application", () => {
  it("renders TV Tambayan with brand header, CRT screen, and initial Asianovela broadcast", () => {
    renderWithProviders();

    expect(screen.getByTestId("app-shell-tv-tambayan")).toBeInTheDocument();
    expect(screen.getByText("TV Tambayan Broadcast Monitor")).toBeInTheDocument();
    expect(screen.getAllByText("Meteor Garden Feature")[0]).toBeInTheDocument();
    expect(screen.getByText(/CH 02 ASIANOVELA PRIME/i)).toBeInTheDocument();
    expect(screen.getByText("[TV 02]")).toBeInTheDocument();
    expect(screen.getByLabelText(/Play Meteor Garden Feature/i)).toHaveAttribute(
      "src",
      "/museum/phase-9/media/tv/meteor-garden-feature.mp4",
    );
    expect(screen.queryByRole("img", { name: /Asianovela romance/i })).not.toBeInTheDocument();
    expect(screen.getByText(/User-supplied local media · Classroom presentation copy/i)).toBeInTheDocument();
  });

  it("handles remote power toggle and volume controls", () => {
    renderWithProviders();

    // Toggle power off
    const powerBtn = screen.getByRole("button", { name: /Turn off television/i });
    fireEvent.click(powerBtn);

    expect(screen.getByText(/TELEVISION IS POWERED OFF/i)).toBeInTheDocument();

    // Turn back on
    const turnOnBtn = screen.getByRole("button", { name: /Turn on television/i });
    fireEvent.click(turnOnBtn);

    expect(screen.getAllByText("Meteor Garden Feature")[0]).toBeInTheDocument();

    // Volume adjustment
    const volUp = screen.getByRole("button", { name: /Volume Up/i });
    fireEvent.click(volUp);

    const muteBtn = screen.getByRole("button", { name: /Mute TV/i });
    fireEvent.click(muteBtn);
    expect(screen.getByRole("button", { name: /Unmute TV/i })).toBeInTheDocument();
  });

  it("shows a brief loading label while the local broadcast buffers", () => {
    renderWithProviders();

    const video = screen.getByLabelText(/Play Meteor Garden Feature/i);
    fireEvent.loadStart(video);
    expect(screen.getByText("Loading local broadcast…")).toBeInTheDocument();

    fireEvent.canPlay(video);
    expect(screen.queryByText("Loading local broadcast…")).not.toBeInTheDocument();
  });

  it("plays the supplied period commercial as an optional commercial break", () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole("button", { name: /Commercial Break/i }));

    expect(screen.getByLabelText(/Play Manny Pacquiao Television Commercial/i)).toHaveAttribute(
      "src",
      "/museum/phase-9/media/tv/datuputi-manny-pacquiao-commerial.mp4",
    );
    expect(screen.getByRole("button", { name: /Return to Program/i })).toBeInTheDocument();
  });

  it("switches channels using remote keypad and cycles with channel buttons", () => {
    renderWithProviders();

    // Direct channel button: Channel 07 Hapon Anime Block
    const ch07Btn = screen.getByRole("button", {
      name: /Tune to Channel 07: Hapon Anime Block/i,
    });
    fireEvent.click(ch07Btn);

    expect(screen.getAllByText("Tagalized Anime Feature")[0]).toBeInTheDocument();
    expect(screen.getByText("[CH 07]")).toBeInTheDocument();

    // Channel UP button: moves to CH 23
    const chUpBtn = screen.getByRole("button", { name: /Channel Up/i });
    fireEvent.click(chUpBtn);

    expect(screen.getAllByText("Videoke Performance")[0]).toBeInTheDocument();
    expect(screen.getByText("[KTV 23]")).toBeInTheDocument();
  });

  it("switches audio localization mode and updates displayed subtitles", () => {
    renderWithProviders();

    const taglishRadio = screen.getByLabelText(/Taglish Subtitles/i);
    fireEvent.click(taglishRadio);

    // Should update subtitle box to taglish
    expect(screen.getByText(/\[TAGLISH SUB\]/i)).toBeInTheDocument();
  });

  it("toggles favorite state on a program and updates watchlist count", () => {
    renderWithProviders();

    const favBtn = screen.getByRole("button", { name: /Remove from TV Watchlist/i });
    fireEvent.click(favBtn);

    expect(screen.getByRole("button", { name: /Add to TV Watchlist/i })).toBeInTheDocument();
  });

  it("browses program schedule guide and tunes in to a show", () => {
    renderWithProviders();

    const guideTab = screen.getByRole("tab", { name: /Program Guide/i });
    fireEvent.click(guideTab);

    expect(screen.getByText(/Daily Broadcast Schedule Guide/i)).toBeInTheDocument();

    // Tune in to Voltech Guardians
    const tuneInAnimeBtn = screen.getByRole("button", {
      name: /Tune in to Tagalized Anime Feature on Channel 07/i,
    });
    fireEvent.click(tuneInAnimeBtn);

    // Switches to TV tab with that show
    expect(screen.getAllByText("Tagalized Anime Feature")[0]).toBeInTheDocument();
  });

  it("browses cultural insights on Asianovela mania and anime localization with moderated historical claims", () => {
    renderWithProviders();

    const cultureTab = screen.getByRole("tab", { name: /Cultural Insights/i });
    fireEvent.click(cultureTab);

    expect(
      screen.getByText(/The Meteor Garden Phenomenon \(2003\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The 4:30 PM After-School Anime Ritual/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Tagalization: The Art of Filipino Dubbing/i),
    ).toBeInTheDocument();

    // Regression checks: unsupported traffic halt claims removed
    expect(screen.queryByText(/brought traffic to a halt/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /In 2003, Taiwanese drama Meteor Garden premiered on Philippine television, sparking the widespread popularity/i,
      ),
    ).toBeInTheDocument();
  });

  it("displays Museum Info with educational reconstruction notice and direct Plaridel / Japan Foundation citations", () => {
    renderWithProviders();

    const museumTab = screen.getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(museumTab);

    expect(
      screen.getByText(/The Asianovela Craze & Tagalized Television/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Educational Reconstruction Notice:/i),
    ).toBeInTheDocument();

    // Direct scholarly source for Meteor Garden & Asianovela
    expect(
      screen.getByText(/Lalaki Dao, Babae Sha: Meteor Garden and Its Gender\(ed\) Representations in Retrospect/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Marlon James S\. Sales \(Plaridel: A Philippine Journal of Communication, Media, and Society\)/i),
    ).toBeInTheDocument();

    // Direct media arts citation for Japan Foundation
    expect(
      screen.getByText(/Arts and Cultural Exchange: Japanese Media Arts and Popular Culture/i),
    ).toBeInTheDocument();

    // Generic homepages removed
    expect(
      screen.queryByText(/The Korean Wave: Evolution, Fandom, and Transnationality/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Japanese Film and Popular Culture Resources/i),
    ).not.toBeInTheDocument();

    // Avoid describing citations as "primary research"
    expect(screen.queryByText(/primary research/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Curatorial Citations & Reference Sources:/i),
    ).toBeInTheDocument();
  });

  it("tunes channels by typing numbers on the remote's number pad", () => {
    vi.useFakeTimers();
    renderWithProviders();

    // Two digits tune immediately: 2 then 3 → CH 23
    fireEvent.click(screen.getByRole("button", { name: "Remote digit 2" }));
    expect(screen.getByText("2-")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remote digit 3" }));
    expect(screen.getByText(/CH 23 KARAOKE TAMBAYAN/i)).toBeInTheDocument();

    // One digit tunes after a short pause: 7 → CH 07
    fireEvent.click(screen.getByRole("button", { name: "Remote digit 7" }));
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.getByText(/CH 07 HAPON ANIME BLOCK/i)).toBeInTheDocument();

    // A channel that doesn't exist just shows static and stays put
    fireEvent.click(screen.getByRole("button", { name: "Remote digit 9" }));
    fireEvent.click(screen.getByRole("button", { name: "Remote digit 9" }));
    expect(screen.getByText(/CH 07 HAPON ANIME BLOCK/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
