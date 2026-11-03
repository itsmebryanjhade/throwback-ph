export type ChannelId = "ch-02" | "ch-07" | "ch-23" | "ch-41";

export type LocalizationMode = "tagalog-dub" | "taglish-sub" | "orig-sub";

export type TvTambayanTab = "tv" | "guide" | "culture" | "favorites" | "museum-info";

export type TimeSlot = "morning" | "afternoon-anime" | "primetime-drama" | "late-night";

export type ProgramItem = {
  id: string;
  channelId: ChannelId;
  title: string;
  originalTitle?: string;
  genre: string;
  timeSlot: TimeSlot;
  broadcastTime: string;
  synopsis: string;
  culturalNote: string;
  voiceCast?: string;
  isFavorite: boolean;
  sampleDialogue: {
    tagalogDub: string;
    taglishSub: string;
    origSub: string;
  };
};

export type TvChannel = {
  id: ChannelId;
  channelNumber: string;
  name: string;
  tagline: string;
  genre: string;
  currentProgramId: string;
  themeColor: string;
  stationBug: string;
  mediaAssetId: string;
  programs: ProgramItem[];
};

export type TvTambayanState = {
  activeTab: TvTambayanTab;
  currentChannelId: ChannelId;
  isPoweredOn: boolean;
  volume: number;
  isMuted: boolean;
  localizationMode: LocalizationMode;
  channels: TvChannel[];
  selectedProgramId?: string;
  showOsd: boolean;
};

export type TvTambayanAction =
  | { type: "SET_TAB"; tab: TvTambayanTab }
  | { type: "CHANGE_CHANNEL"; channelId: ChannelId }
  | { type: "CHANNEL_UP" }
  | { type: "CHANNEL_DOWN" }
  | { type: "TOGGLE_POWER" }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_LOCALIZATION_MODE"; mode: LocalizationMode }
  | { type: "TOGGLE_FAVORITE_SHOW"; programId: string }
  | { type: "SELECT_PROGRAM"; programId: string }
  | { type: "HIDE_OSD" }
  | { type: "RESET_STATE" };
