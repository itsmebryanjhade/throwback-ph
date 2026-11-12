import type {
  Contact,
  EdsaSequenceStep,
  NokiaState,
  Ringtone,
  SmsMessage,
} from "./types";

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: "ate",
    name: "Ate Michelle",
    number: "0917-555-0142",
    avatar: "👩",
    relationship: "Family",
  },
  {
    id: "nanay",
    name: "Nanay",
    number: "0919-444-2391",
    avatar: "👵",
    relationship: "Family",
  },
  {
    id: "kiko",
    name: "Kiko Reyes (Barkada)",
    number: "0918-333-8821",
    avatar: "🎸",
    relationship: "Barkada",
  },
  {
    id: "bea",
    name: "Bea Gonzales",
    number: "0917-888-4412",
    avatar: "🎀",
    relationship: "Barkada",
  },
  {
    id: "mark-clan",
    name: "Clan Master Mark",
    number: "0920-111-9988",
    avatar: "⚡",
    relationship: "Text Clan",
  },
  {
    id: "aling-nena",
    name: "Aling Nena Load Center",
    number: "0918-222-3300",
    avatar: "🏪",
    relationship: "Sari-Sari Store",
  },
];

export const INITIAL_MESSAGES: SmsMessage[] = [
  {
    id: "msg-load",
    sender: "Ate Michelle",
    senderNumber: "0917-555-0142",
    recipient: "Me",
    timestamp: "4:12 PM",
    preview: "Pabili load 30…",
    body: "Pabili load 30. Text mo ko pag nasa kanto ka na para masundo kita.",
    folder: "inbox",
    isRead: true,
    category: "load",
  },
  {
    id: "msg-gm",
    sender: "Nanay",
    senderNumber: "0919-444-2391",
    recipient: "Me",
    timestamp: "6:03 AM",
    preview: "Gud morning! Smile ka today…",
    body: "Gud morning! Smile ka today and don't forget to eat breakfast. God bless ur day. GM lang, no reply needed :)",
    folder: "inbox",
    isRead: false,
    category: "gm",
  },
  {
    id: "msg-barkada",
    sender: "Kiko Reyes (Barkada)",
    senderNumber: "0918-333-8821",
    recipient: "Me",
    timestamp: "5:48 PM",
    preview: "Comp shop tayo 7pm…",
    body: "Comp shop tayo 7pm sa Netopia. Dala ka barya, baka puno na naman sa kabila. Tara Dota or Ragnarok!",
    folder: "inbox",
    isRead: false,
    category: "personal",
  },
  {
    id: "msg-clan",
    sender: "Clan Master Mark",
    senderNumber: "0920-111-9988",
    recipient: "Me",
    timestamp: "8:30 PM",
    preview: "WELCOME 2 TEXT CLAN X-TREME…",
    body: "WELCOME 2 TEXT CLAN X-TREME! Rule #1: Bawal jejemon. Rule #2: Send GM every weekend. Pass this to 5 friends 4 free load haha joke!",
    folder: "inbox",
    isRead: true,
    category: "chain",
  },
  {
    id: "msg-edsa-alert",
    sender: "Forwarded Broadcast",
    senderNumber: "URGENT",
    recipient: "Me",
    timestamp: "Jan 16, 2001 · 8:15 PM",
    preview: "Go 2 EDSA Wear blk…",
    body: "Go 2 EDSA Wear blk.",
    folder: "inbox",
    isRead: true,
    category: "edsa",
    isHistorical: true,
    historicalAttribution:
      "Widely Reported SMS Wording — Widely cited as part of the SMS mobilization during EDSA II on January 16, 2001. Punctuation and spacing vary across published accounts.",
    reconstructedContext:
      "Later forwarded chains added instructions such as “Forward to all contacts,” “Verify the news,” and peer safety advice.",
  },
  {
    id: "msg-sent-1",
    sender: "Me",
    recipient: "Kiko Reyes (Barkada)",
    recipientNumber: "0918-333-8821",
    timestamp: "Yesterday · 6:15 PM",
    preview: "On the way na ko…",
    body: "On the way na ko comp shop. Reserve mo ko pc 4 tabi mo!",
    folder: "sent",
    isRead: true,
    category: "personal",
  },
  {
    id: "msg-draft-1",
    sender: "Me",
    recipient: "Bea Gonzales",
    recipientNumber: "0917-888-4412",
    timestamp: "Draft",
    preview: "Uy napanood mo ba yung…",
    body: "Uy napanood mo ba yung bagong music video ng Rivermaya sa MYX kanina?",
    folder: "drafts",
    isRead: true,
    category: "personal",
  },
];

export const PRESET_QUICK_REPLIES = [
  "Wer u na? D2 na me.",
  "Kain tayo / tambay comp shop?",
  "Pabili po load 30 globe/smart.",
  "Ingat ka lagi! Gud am/pm.",
  "Copy, kita-kits later!",
  "Pass load 5 pls, emergency lang po.",
] as const;

export const RINGTONES: Ringtone[] = [
  {
    id: "metro-waltz",
    name: "Metro Monophonic Waltz",
    category: "monophonic",
    tempo: 140,
    notes: [
      { freq: 392.0, duration: 0.25 }, // G4
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 587.33, duration: 0.25 }, // D5
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 440.0, duration: 0.25 }, // A4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 659.25, duration: 0.25 }, // E5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 392.0, duration: 0.5 }, // G4
      { freq: 523.25, duration: 0.75 }, // C5
    ],
  },
  {
    id: "pinoy-rock-chords",
    name: "Pinoy Rock Riff",
    category: "polyphonic",
    tempo: 140,
    notes: [
      { freq: 440.0, duration: 0.2 },
      { freq: 523.25, duration: 0.2 },
      { freq: 659.25, duration: 0.2 },
      { freq: 587.33, duration: 0.4 },
      { freq: 523.25, duration: 0.2 },
      { freq: 440.0, duration: 0.6 },
    ],
  },
  {
    id: "text-tone-standard",
    name: "Standard SMS Alert (Beep-Beep)",
    category: "alert",
    tempo: 180,
    notes: [
      { freq: 880.0, duration: 0.1 },
      { freq: 0, duration: 0.05 },
      { freq: 880.0, duration: 0.1 },
      { freq: 0, duration: 0.2 },
      { freq: 880.0, duration: 0.1 },
      { freq: 0, duration: 0.05 },
      { freq: 880.0, duration: 0.1 },
    ],
  },
  {
    id: "morse-code-sms",
    name: "Special SMS Morse Code",
    category: "alert",
    tempo: 150,
    notes: [
      // S: ...
      { freq: 987.77, duration: 0.08 },
      { freq: 987.77, duration: 0.08 },
      { freq: 987.77, duration: 0.08 },
      { freq: 0, duration: 0.15 },
      // M: --
      { freq: 987.77, duration: 0.24 },
      { freq: 987.77, duration: 0.24 },
      { freq: 0, duration: 0.15 },
      // S: ...
      { freq: 987.77, duration: 0.08 },
      { freq: 987.77, duration: 0.08 },
      { freq: 987.77, duration: 0.08 },
    ],
  },
  {
    id: "kalimba-lullaby",
    name: "Kalimba Island Lullaby",
    category: "monophonic",
    tempo: 120,
    notes: [
      { freq: 523.25, duration: 0.25 },
      { freq: 659.25, duration: 0.25 },
      { freq: 783.99, duration: 0.25 },
      { freq: 1046.5, duration: 0.5 },
      { freq: 783.99, duration: 0.25 },
      { freq: 659.25, duration: 0.5 },
    ],
  },
];

export const EDSA_SEQUENCE_STEPS: EdsaSequenceStep[] = [
  {
    id: "edsa-step-1",
    dateStr: "Jan 16, 2001 · 8:00 PM",
    sender: "Senate Impeachment Trial News",
    body: "11 senators vote against opening the second sealed envelope containing critical trial evidence. Prosecutors walk out in protest.",
    isDirectQuote: false,
    historicalContext:
      "The sudden vote to suppress the envelope triggered intense public reaction. As news spread rapidly across Metro Manila, citizens turned to text messaging to share updates.",
  },
  {
    id: "edsa-step-2",
    dateStr: "Jan 16, 2001 · 8:15 PM",
    sender: "Forwarded SMS Network",
    body: "Go 2 EDSA Wear blk.",
    isDirectQuote: true,
    historicalContext:
      "Widely Reported SMS Wording: Forwarded widely from phone to phone. Punctuation and spacing vary across published accounts, while the wording is widely cited as part of the SMS mobilization during EDSA II. Thousands gathered rapidly at the EDSA Shrine, and crowds grew to more than a million over the following days.",
  },
  {
    id: "edsa-step-3",
    dateStr: "Jan 17, 2001 · 10:30 AM",
    sender: "Kiko Reyes (Barkada)",
    body: "Nasa EDSA Shrine na kami ni Kuya. May free water dito at candles. Verify the news, stay safe, and tell your family where you are.",
    isDirectQuote: false,
    historicalContext:
      "Reconstructed educational context: Friends and families forwarded updates to coordinate logistics, share supplies, and maintain peer safety in the crowds, helping coordinate peaceful civic participation.",
  },
  {
    id: "edsa-step-4",
    dateStr: "Jan 20, 2001 · 12:00 PM",
    sender: "Historical Significance",
    body: "Chief Justice Hilario Davide Jr. swears in Gloria Macapagal-Arroyo as the 14th President of the Philippines. EDSA II succeeds through peaceful, mobile-coordinated citizen mobilization.",
    isDirectQuote: false,
    historicalContext:
      "Observers and sociologists described EDSA II as a landmark demonstration of mobile civic coordination, showing how rapid SMS forwarding could help mobilize peaceful citizen assemblies.",
  },
];

export const INITIAL_NOKIA_STATE: NokiaState = {
  activeView: "inbox",
  selectedMessageId: null,
  messages: INITIAL_MESSAGES,
  contacts: INITIAL_CONTACTS,
  phoneProfile: "general",
  selectedRingtoneId: "metro-waltz",
  prepaid: {
    balance: 35.0,
    costPerSms: 1.0,
    simProvider: "Smart",
  },
  composeRecipient: "",
  composeBody: "",
  composeReplyToId: null,
  edsaStepIndex: 0,
  keypadMode: "abc",
  stats: { reloads: 0, snakeBest: 0 },
};
