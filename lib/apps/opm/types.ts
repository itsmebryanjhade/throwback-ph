export type PlaybackState = "playing" | "paused" | "stopped";

export type VisualizerMode = "bars" | "wave";

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  durationSeconds: number;
  genre: "Alternative Rock" | "Acoustic Pop" | "Pop Punk" | "Rap Rock" | "Indie Ballad" | "Pop Rock";
  bitrate: string;
  isFavorite: boolean;
  linerNotes: string;
  lyricsExcerpt: string;
  musicalKey: string;
  availability: "licensed" | "unavailable";
  mediaAssetId?: string;
  coverSrc?: string;
};

export type OpmPlayerTab = "player" | "playlist" | "linernotes" | "museum-info";

export type OpmState = {
  activeTab: OpmPlayerTab;
  tracks: Track[];
  currentTrackId: string;
  playbackState: PlaybackState;
  currentTimeSeconds: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  playlistTrackIds: string[];
  visualizerMode: VisualizerMode;
};

export type OpmAction =
  | { type: "SET_TAB"; tab: OpmPlayerTab }
  | { type: "PLAY_TRACK"; trackId?: string }
  | { type: "PAUSE_TRACK" }
  | { type: "STOP_TRACK" }
  | { type: "NEXT_TRACK" }
  | { type: "PREV_TRACK" }
  | { type: "SEEK_TIME"; seconds: number }
  | { type: "TICK_PLAYBACK" }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "TOGGLE_REPEAT" }
  | { type: "TOGGLE_FAVORITE"; trackId: string }
  | { type: "ADD_TO_PLAYLIST"; trackId: string }
  | { type: "REMOVE_FROM_PLAYLIST"; trackId: string }
  | { type: "SET_VISUALIZER_MODE"; mode: VisualizerMode };
