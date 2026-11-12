export type MessageFolder = "inbox" | "sent" | "drafts";

export type MessageCategory = "personal" | "gm" | "load" | "edsa" | "chain";

export type SmsMessage = {
  id: string;
  sender: string;
  senderNumber?: string;
  recipient: string;
  recipientNumber?: string;
  timestamp: string;
  preview: string;
  body: string;
  folder: MessageFolder;
  isRead: boolean;
  category?: MessageCategory;
  isHistorical?: boolean;
  historicalAttribution?: string;
  reconstructedContext?: string;
};

export type Contact = {
  id: string;
  name: string;
  number: string;
  avatar: string;
  relationship: string;
};

export type PhoneProfile = "general" | "silent" | "meeting";

export type Ringtone = {
  id: string;
  name: string;
  category: "monophonic" | "polyphonic" | "alert";
  tempo: number;
  notes: readonly { freq: number; duration: number }[];
};

export type PrepaidAccount = {
  balance: number;
  costPerSms: number;
  simProvider: "Smart" | "Globe" | "Sun Cellular";
};

export type EdsaSequenceStep = {
  id: string;
  dateStr: string;
  sender: string;
  body: string;
  isDirectQuote: boolean;
  historicalContext: string;
};

export type NokiaView =
  | "inbox"
  | "sent"
  | "drafts"
  | "contacts"
  | "compose"
  | "detail"
  | "settings"
  | "edsa"
  | "museum-info";

export type NokiaState = {
  activeView: NokiaView;
  selectedMessageId: string | null;
  messages: SmsMessage[];
  contacts: Contact[];
  phoneProfile: PhoneProfile;
  selectedRingtoneId: string;
  prepaid: PrepaidAccount;
  composeRecipient: string;
  composeBody: string;
  composeReplyToId: string | null;
  edsaStepIndex: number;
  keypadMode: "abc" | "ABC" | "123";
  /** Progress the Guide's missions read from. */
  stats: { reloads: number; snakeBest: number };
};

export type NokiaAction =
  | { type: "SET_VIEW"; view: NokiaView }
  | { type: "SELECT_MESSAGE"; messageId: string }
  | { type: "CLEAR_SELECTED_MESSAGE" }
  | { type: "PREPARE_COMPOSE"; recipient?: string; initialBody?: string; replyToId?: string }
  | { type: "SET_COMPOSE_RECIPIENT"; recipient: string }
  | { type: "SET_COMPOSE_BODY"; body: string }
  | { type: "APPEND_COMPOSE_TEXT"; text: string }
  | { type: "BACKSPACE_COMPOSE" }
  | { type: "CYCLE_KEYPAD_MODE" }
  | { type: "SEND_MESSAGE" }
  | { type: "SAVE_DRAFT" }
  | { type: "DELETE_MESSAGE"; messageId: string }
  | { type: "MARK_ALL_READ" }
  | { type: "SET_PHONE_PROFILE"; profile: PhoneProfile }
  | { type: "SET_RINGTONE"; ringtoneId: string }
  | { type: "RELOAD_PREPAID"; amount: number }
  | { type: "SET_EDSA_STEP"; stepIndex: number }
  | { type: "INJECT_EDSA_BROADCAST" }
  | { type: "RECORD_SNAKE_SCORE"; score: number };
