import type { RoomId } from "@/content/museum";
import type { WindowBounds, WindowSize } from "@/lib/window-system/types";

export type AppId =
  | "friendster"
  | "nokia-messages"
  | "net-cafe"
  | "reality-tv-vote"
  | "opm-media-player"
  | "pinoytube"
  | "tv-tambayan"
  | "chat-archives"
  | "ppop-passport";

export type FolderId =
  | "folder-technology"
  | "folder-performance"
  | "folder-globalization";

export type AppMetadata = {
  id: AppId;
  title: string;
  room: RoomId;
  icon: string;
  symbol: string;
  tagline: string;
  isFlagship: boolean;
  defaultBounds: WindowBounds;
  minSize: WindowSize;
  description: string;
  museumContext: {
    years: string;
    summary: string;
    whyItMattered: string;
    sources: string[];
  };
  phaseTarget: number;
};

export type RoomFolderMetadata = {
  id: FolderId;
  roomId: RoomId;
  title: string;
  icon: string;
  color: string;
  description: string;
  appIds: readonly AppId[];
  defaultBounds: WindowBounds;
  minSize: WindowSize;
};
