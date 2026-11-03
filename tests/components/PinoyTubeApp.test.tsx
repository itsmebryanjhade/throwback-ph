import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { WindowManagerProvider } from "@/lib/window-system/WindowContext";
import { NotificationProvider } from "@/lib/notification-system/NotificationContext";
import { allAppRegistrations } from "@/lib/apps/catalog";
import { PinoyTubeApp } from "@/components/apps/pinoytube/PinoyTubeApp";

function renderWithProviders() {
  return render(
    <WindowManagerProvider registrations={allAppRegistrations}>
      <NotificationProvider>
        <PinoyTubeApp />
      </NotificationProvider>
    </WindowManagerProvider>,
  );
}

describe("Phase 7 — PinoyTube Application", () => {
  it("renders PinoyTube video portal with brand header, player, and initial video details", () => {
    renderWithProviders();

    expect(screen.getByTestId("app-shell-pinoytube")).toBeInTheDocument();
    expect(screen.getByText("PinoyTube Broadcast")).toBeInTheDocument();
    expect(
      screen.getAllByText("Campus Dance Practice")[0],
    ).toBeInTheDocument();
    expect(screen.getByText(/@dancemaster_qc/)).toBeInTheDocument();
    expect(screen.getByText(/142,580/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Play Campus Dance Practice/i)).toHaveAttribute(
      "src",
      "/museum/phase-9/media/pinoytube/campus-dance.mp4",
    );
    expect(screen.getByTestId("pinoytube-video-stage")).toHaveAttribute(
      "data-video-fit",
      "contain-16-9",
    );
    expect(screen.getByText(/User-supplied local media · Classroom presentation copy/i)).toBeInTheDocument();
    const acousticRecommendation = screen.getByRole("button", {
      name: "Play related video: Acoustic Bedroom Cover",
    });
    const thumbnail = acousticRecommendation.querySelector("video");
    expect(thumbnail).toHaveAttribute("preload", "metadata");
    Object.defineProperty(thumbnail, "duration", { configurable: true, value: 30 });
    fireEvent.loadedMetadata(thumbnail!);
    expect(thumbnail).toHaveProperty("currentTime", 0.1);
  });

  it("handles playback transport controls and simulation buffering", () => {
    vi.useFakeTimers();
    renderWithProviders();

    // Toggle pause/play
    const playBtn = screen.getByRole("button", { name: /Pause video/i });
    fireEvent.click(playBtn);
    expect(screen.getByRole("button", { name: /Play video/i })).toBeInTheDocument();

    // Simulate buffer
    const bufferBtn = screen.getByRole("button", { name: /Simulate Buffer/i });
    fireEvent.click(bufferBtn);

    expect(screen.getAllByText(/Buffering/i).length).toBeGreaterThanOrEqual(1);

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    vi.useRealTimers();
  });

  it("rates a video with stars and updates rating statistics", () => {
    renderWithProviders();

    const star5 = screen.getByRole("button", { name: /Rate 5 stars/i });
    fireEvent.click(star5);

    // Vote count increments
    expect(screen.getByText(/313 votes/i)).toBeInTheDocument();
  });

  it("toggles favorite state on the active video", () => {
    renderWithProviders();

    const favBtn = screen.getByRole("button", { name: /Add to Favorites/i });
    fireEvent.click(favBtn);

    expect(screen.getByRole("button", { name: /Remove from Favorites/i })).toBeInTheDocument();
  });

  it("posts a comment using preset selection", () => {
    renderWithProviders();

    const presetSelect = screen.getByLabelText(/Quick Presets/i);
    fireEvent.change(presetSelect, {
      target: { value: "Astig pre! Rated 5 stars!" },
    });

    const submitBtn = screen.getByRole("button", { name: /Post Comment/i });
    fireEvent.click(submitBtn);

    // Matches both option and posted comment paragraph
    const matches = screen.getAllByText("Astig pre! Rated 5 stars!");
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("browses categories, switches video, and explores favorites", () => {
    renderWithProviders();

    // Click Browse tab
    const browseTab = screen.getByRole("tab", { name: /Browse Categories/i });
    fireEvent.click(browseTab);

    // Should see category chips
    expect(screen.getByRole("button", { name: "Campus Dance Craze" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Acoustic OPM Covers" })).toBeInTheDocument();

    // Click acoustic cover
    const acousticCard = screen.getByRole("button", {
      name: /Watch Acoustic Bedroom Cover/i,
    });
    fireEvent.click(acousticCard);

    // Should switch to Watch tab and show Harana title
    expect(
      screen.getAllByText("Acoustic Bedroom Cover")[0],
    ).toBeInTheDocument();
  });

  it("simulates video upload and publishes to the watch player with metadata-only notice", () => {
    vi.useFakeTimers();
    renderWithProviders();

    const uploadTab = screen.getByRole("tab", { name: /Upload Video/i });
    fireEvent.click(uploadTab);

    // Regression check: upload disclaimer must clearly state metadata-only simulation
    expect(screen.getByRole("note")).toHaveTextContent(
      /metadata-only local simulation: no real video is selected, uploaded, transmitted, or converted to FLV/i,
    );

    const titleInput = screen.getByLabelText(/Video Title:/i);
    fireEvent.change(titleInput, { target: { value: "Manila Bay Sunset Timelapse" } });

    const submitBtn = screen.getByRole("button", { name: /Upload to PinoyTube/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Encoding & Processing Video.../i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    // Should now be on watch tab with new video and simulated metadata comment
    expect(screen.getByText("Manila Bay Sunset Timelapse")).toBeInTheDocument();
    expect(
      screen.getByText(/Video metadata recorded in local educational simulation/i),
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("displays Museum Info with educational reconstruction notice, softened claims, and no primary research label", () => {
    renderWithProviders();

    const museumTab = screen.getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(museumTab);

    expect(
      screen.getByText(/Grassroots Video & Bedroom Stardom/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Educational Reconstruction Notice:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Creator Upload Studio is a metadata-only local simulation/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/YouTube at 15: My personal journey and the road ahead/i),
    ).toBeInTheDocument();

    // Regression checks for softened wording
    expect(screen.queryByText(/millions watched/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/international stages/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/primary research/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Online audiences circulated grainy dance covers/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Curatorial Citations & Reference Sources:/i),
    ).toBeInTheDocument();
  });
});
