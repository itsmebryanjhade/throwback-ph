export type ChatServiceMode = "yahoo" | "mirc";

export type ChatArchivesTab = "chat" | "transcripts" | "cultural-notes" | "museum-info";

export type UserPresenceStatus =
  | "available"
  | "busy"
  | "brb"
  | "invisible"
  | "offline";

export type YahooContact = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  portraitSrc: string;
  status: UserPresenceStatus;
  customStatus: string;
  unreadCount: number;
  isOnline: boolean;
};

export type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isBuzz?: boolean;
  isSystem?: boolean;
  isMe?: boolean;
};

export type MircUser = {
  nick: string;
  role?: "@" | "+" | "";
};

export type MircChannel = {
  id: string;
  name: string;
  topic: string;
  userCount: number;
  users: MircUser[];
  unreadCount: number;
};

export type CuratedTranscriptLine = {
  speaker: string;
  text: string;
  time?: string;
  note?: string;
};

export type CuratedTranscript = {
  id: string;
  service: ChatServiceMode;
  title: string;
  year: string;
  participants: string[];
  culturalContext: string;
  lines: CuratedTranscriptLine[];
};

export type ChatArchivesState = {
  activeTab: ChatArchivesTab;
  serviceMode: ChatServiceMode;
  myNick: string;
  myPresence: UserPresenceStatus;
  myCustomStatus: string;
  contacts: YahooContact[];
  activeContactId: string;
  yahooMessages: Record<string, ChatMessage[]>;
  channels: MircChannel[];
  activeChannelId: string;
  mircMessages: Record<string, ChatMessage[]>;
  isBuzzing: boolean;
  emoticonPickerOpen: boolean;
  curatedTranscripts: CuratedTranscript[];
  selectedTranscriptId: string;
};

export type ChatArchivesAction =
  | { type: "SET_TAB"; tab: ChatArchivesTab }
  | { type: "SET_SERVICE_MODE"; mode: ChatServiceMode }
  | { type: "SET_PRESENCE"; status: UserPresenceStatus; customStatus?: string }
  | { type: "SET_CUSTOM_STATUS"; customStatus: string }
  | { type: "SELECT_CONTACT"; contactId: string }
  | { type: "SELECT_CHANNEL"; channelId: string }
  | { type: "SEND_YAHOO_MESSAGE"; contactId: string; text: string }
  | { type: "SEND_MIRC_MESSAGE"; channelId: string; text: string }
  | { type: "TRIGGER_BUZZ"; contactId: string }
  | { type: "CLEAR_BUZZ" }
  | { type: "TOGGLE_EMOTICON_PICKER" }
  | { type: "SELECT_TRANSCRIPT"; transcriptId: string };
