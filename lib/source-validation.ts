import type { MuseumRoom } from "@/content/museum";
import type { SourceCredit } from "@/content/sources";

export function validateMuseumContent(
  rooms: readonly MuseumRoom[],
  sources: readonly SourceCredit[],
): string[] {
  const errors: string[] = [];
  const exhibitIds = new Set<string>();
  const sourceIds = new Set<string>();

  for (const source of sources) {
    if (sourceIds.has(source.id)) errors.push(`Duplicate source: ${source.id}`);
    sourceIds.add(source.id);
    if (!source.title || !source.creator || !source.url || !source.usageBasis || !source.accessed) {
      errors.push(`Incomplete source: ${source.id}`);
    }
  }

  for (const room of rooms) {
    for (const exhibit of room.exhibits) {
      if (exhibitIds.has(exhibit.id)) errors.push(`Duplicate exhibit: ${exhibit.id}`);
      exhibitIds.add(exhibit.id);
      if (!exhibit.title || !exhibit.summary || !exhibit.whyItMattered || !exhibit.alt) {
        errors.push(`Incomplete exhibit: ${exhibit.id}`);
      }
      if (exhibit.room !== room.id) errors.push(`Room mismatch: ${exhibit.id}`);
      for (const sourceId of exhibit.sourceIds) {
        if (!sourceIds.has(sourceId)) errors.push(`Unknown source ${sourceId}: ${exhibit.id}`);
      }
    }
  }

  return errors;
}
