import { describe, expect, it } from "vitest";
import { getMediaAsset, museumMediaAssets } from "@/content/media";
import type { MuseumMediaAsset } from "@/lib/media/types";

const validAsset: MuseumMediaAsset = {
  id: "sample-artifact",
  kind: "image",
  title: "Sample artifact",
  creator: "ASL",
  license: "Original educational reconstruction",
  sourceUrl: "https://example.com/source",
  localSrc: "/museum/sample-artifact.webp",
  usedBy: ["shared-foundation"],
  edits: "None",
};

describe("museum media manifest", () => {
  it("requires complete credit and local delivery metadata", () => {
    expect(validAsset.localSrc.startsWith("/museum/")).toBe(true);
    expect(validAsset.creator).not.toBe("");
    expect(validAsset.license).not.toBe("");
    expect(validAsset.sourceUrl.startsWith("https://")).toBe(true);
    expect(validAsset.usedBy.length).toBeGreaterThan(0);
    expect(validAsset.edits).not.toBe("");
  });

  it("resolves known assets and returns undefined for unknown assets", () => {
    for (const asset of museumMediaAssets) {
      expect(getMediaAsset(asset.id)).toEqual(asset);
      expect(asset.localSrc.startsWith("/museum/")).toBe(true);
    }

    expect(getMediaAsset("missing-asset")).toBeUndefined();
  });

  it("registers the licensed local audio and archival films", () => {
    const audio = getMediaAsset("dizzy-spells-acoustic");
    const manila = getMediaAsset("manila-aerial-film");
    const ondoy = getMediaAsset("ondoy-project-8-film");

    expect(audio).toMatchObject({
      kind: "audio",
      localSrc: "/museum/phase-9/media/dizzy-spells-acoustic.mp3",
    });
    expect(manila).toMatchObject({
      kind: "video",
      posterSrc: "/museum/phase-9/media/manila-aerial-poster.jpg",
      captionsSrc: "/museum/phase-9/media/manila-aerial.vtt",
    });
    expect(ondoy).toMatchObject({
      kind: "video",
      posterSrc: "/museum/phase-9/media/ondoy-project-8-poster.jpg",
      captionsSrc: "/museum/phase-9/media/ondoy-project-8.vtt",
    });
  });

  it("resolves each supplied OPM, PinoyTube, and TV asset to its own local file", () => {
    const expectedAssets = {
      "hale-day-you-said-goodnight": "/museum/phase-9/media/opm/hale-the-day-you-said-goodnight.mp3",
      "kamikazee-narda": "/museum/phase-9/media/opm/kamikazee-narda.mp3",
      "sponge-cola-jeepney": "/museum/phase-9/media/opm/sponge-cola-jeepney.mp3",
      "orange-lemons-hanggang-kailan": "/museum/phase-9/media/opm/orange-and-lemons-hanggang-kailan.mp3",
      "moonstar88-migraine": "/museum/phase-9/media/opm/moonstar88-migraine.mp3",
      "pinoytube-campus-dance": "/museum/phase-9/media/pinoytube/campus-dance.mp4",
      "pinoytube-acoustic-cover": "/museum/phase-9/media/pinoytube/acoustic-bedroom-cover.mp4",
      "pinoytube-netcafe-gameplay": "/museum/phase-9/media/pinoytube/net-cafe-gameplay.mp4",
      "pinoytube-comedy-sketch": "/museum/phase-9/media/pinoytube/filipino-comedy-sketch.mp4",
      "pinoytube-street-performance": "/museum/phase-9/media/pinoytube/street-performance.mp4",
      "tv-meteor-garden": "/museum/phase-9/media/tv/meteor-garden-feature.mp4",
      "tv-tagalized-anime": "/museum/phase-9/media/tv/tagalized-anime-feature.mp4",
      "tv-videoke": "/museum/phase-9/media/tv/videoke-performance.mp4",
      "tv-mall-variety": "/museum/phase-9/media/tv/mall-variety-show.mp4",
      "tv-pacquiao-commercial": "/museum/phase-9/media/tv/datuputi-manny-pacquiao-commerial.mp4",
    } as const;

    for (const [id, localSrc] of Object.entries(expectedAssets)) {
      expect(getMediaAsset(id)).toMatchObject({ localSrc });
    }
  });
});
