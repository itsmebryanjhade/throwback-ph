export type VideoCategory =
  | "all"
  | "campus-dance"
  | "acoustic-opm"
  | "netcafe-comedy"
  | "comedy-sketch"
  | "grassroots-music";

export type VideoResolution = "240p" | "360p" | "480p";

export type PinoyTubeTab = "watch" | "browse" | "upload" | "favorites" | "museum-info";

export type PinoyTubeComment = {
  id: string;
  author: string;
  avatarIcon: string;
  text: string;
  timestamp: string;
  rating?: number;
};

export type PinoyTubeVideo = {
  id: string;
  title: string;
  author: string;
  channelName: string;
  category: VideoCategory;
  categoryLabel: string;
  durationSeconds: number;
  durationFormatted: string;
  uploadDate: string;
  views: number;
  starRating: number;
  ratingCount: number;
  userRating: number;
  isFavorite: boolean;
  resolution: VideoResolution;
  description: string;
  tags: string[];
  visualTheme: "dance" | "acoustic" | "netcafe" | "parody" | "beatbox" | "custom";
  mediaAssetId?: string;
};

export type PinoyTubeState = {
  activeTab: PinoyTubeTab;
  selectedVideoId: string;
  videos: PinoyTubeVideo[];
  playbackState: "stopped" | "playing" | "paused";
  currentTimeSeconds: number;
  isBuffering: boolean;
  bufferPercentage: number;
  volume: number;
  isMuted: boolean;
  selectedResolution: VideoResolution;
  filterCategory: VideoCategory;
  comments: Record<string, PinoyTubeComment[]>;
};

export type PinoyTubeAction =
  | { type: "SET_TAB"; tab: PinoyTubeTab }
  | { type: "SELECT_VIDEO"; videoId: string }
  | { type: "PLAY_VIDEO" }
  | { type: "PAUSE_VIDEO" }
  | { type: "TOGGLE_PLAYBACK" }
  | { type: "SEEK_TIME"; seconds: number }
  | { type: "TICK_PLAYBACK" }
  | { type: "SET_BUFFERING"; isBuffering: boolean; bufferPercentage?: number }
  | { type: "SET_RESOLUTION"; resolution: VideoResolution }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "RATE_VIDEO"; videoId: string; rating: number }
  | { type: "TOGGLE_FAVORITE"; videoId: string }
  | { type: "ADD_COMMENT"; videoId: string; text: string; author?: string; rating?: number }
  | {
      type: "UPLOAD_VIDEO";
      title: string;
      category: VideoCategory;
      description: string;
      tags: string[];
      durationSeconds?: number;
    }
  | { type: "SET_FILTER_CATEGORY"; category: VideoCategory }
  | { type: "RESET_STATE" };
