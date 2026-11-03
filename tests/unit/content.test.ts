import { describe, expect, it } from "vitest";
import { museumRooms } from "@/content/museum";
import { sourceCredits } from "@/content/sources";
import { validateMuseumContent } from "@/lib/source-validation";

describe("museum content contract", () => {
  it("keeps the approved room order and twelve unique exhibits", () => {
    expect(museumRooms.map((room) => room.id)).toEqual([
      "technology",
      "performance",
      "globalization",
    ]);
    expect(museumRooms.map((room) => room.exhibits.length)).toEqual([4, 4, 4]);

    const ids = museumRooms.flatMap((room) => room.exhibits.map((exhibit) => exhibit.id));
    expect(ids).toHaveLength(12);
    expect(new Set(ids).size).toBe(12);
  });

  it("keeps every exhibit readable and traceable when its visual is unavailable", () => {
    for (const room of museumRooms) {
      for (const exhibit of room.exhibits) {
        expect(exhibit.title.trim()).not.toBe("");
        expect(exhibit.summary.trim()).not.toBe("");
        expect(exhibit.whyItMattered.trim()).not.toBe("");
        expect(exhibit.alt.trim()).not.toBe("");
        expect(exhibit.sourceIds.length).toBeGreaterThan(0);
      }
    }
  });

  it("has no duplicate, missing, or incomplete source records", () => {
    expect(validateMuseumContent(museumRooms, sourceCredits)).toEqual([]);
  });
});
