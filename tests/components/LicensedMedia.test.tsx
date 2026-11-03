import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LicensedAudio } from "@/components/shared/LicensedAudio";
import { LicensedVideo } from "@/components/shared/LicensedVideo";
import type { MuseumMediaAsset } from "@/lib/media/types";

const audioAsset: MuseumMediaAsset = {
  id: "audio",
  kind: "audio",
  title: "Acoustic track",
  creator: "Artist",
  license: "CC BY 4.0",
  sourceUrl: "https://example.com/audio",
  localSrc: "/museum/audio.mp3",
  usedBy: ["test"],
  edits: "None",
};

const videoAsset: MuseumMediaAsset = {
  ...audioAsset,
  id: "video",
  kind: "video",
  title: "Archival film",
  sourceUrl: "https://example.com/video",
  localSrc: "/museum/video.webm",
  posterSrc: "/museum/poster.jpg",
  captionsSrc: "/museum/captions.vtt",
};

describe("licensed media", () => {
  it("renders playable audio with visible attribution", () => {
    render(<LicensedAudio asset={audioAsset} />);
    expect(screen.getByLabelText("Play Acoustic track")).toHaveAttribute("controls");
    expect(screen.getByText(/Artist · CC BY 4.0/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /source/i })).toHaveAttribute(
      "href",
      audioAsset.sourceUrl,
    );
  });

  it("renders video poster, captions, and reports native playback state", () => {
    const onStateChange = vi.fn();
    const { container } = render(
      <LicensedVideo asset={videoAsset} onStateChange={onStateChange} />,
    );
    const video = screen.getByLabelText("Play Archival film");
    expect(video).toHaveAttribute("poster", videoAsset.posterSrc);
    expect(container.querySelector("track")?.getAttribute("src")).toBe(
      videoAsset.captionsSrc,
    );
    fireEvent.play(video);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: "playing" }),
    );
  });

  it("shows a readable retry state when media fails", () => {
    render(<LicensedVideo asset={videoAsset} />);
    fireEvent.error(screen.getByLabelText("Play Archival film"));
    expect(screen.getByText(/could not be played/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
