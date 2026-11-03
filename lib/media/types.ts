export type MuseumMediaKind = "image" | "audio" | "video";

export type MediaCredit = {
  title: string;
  creator: string;
  license: string;
  sourceUrl: string;
  localSrc: string;
  usedBy: readonly string[];
  edits: string;
};

export type MuseumMediaAsset = MediaCredit & {
  id: string;
  kind: MuseumMediaKind;
  posterSrc?: string;
  captionsSrc?: string;
};
