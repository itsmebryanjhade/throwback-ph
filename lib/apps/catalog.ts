import type { RoomId } from "@/content/museum";
import type { WindowRegistration } from "@/lib/window-system/types";
import type { AppId, AppMetadata, FolderId, RoomFolderMetadata } from "./types";

export const APP_CATALOG: Record<AppId, AppMetadata> = {
  friendster: {
    id: "friendster",
    title: "Friendster PH",
    room: "technology",
    icon: "👤",
    symbol: "FRND",
    tagline: "Design your profile, collect testimonials, and connect with barkada.",
    isFlagship: true,
    defaultBounds: { x: 70, y: 40, width: 780, height: 560 },
    minSize: { width: 520, height: 400 },
    description:
      "A recreation of early social networking in the Philippines featuring customizable profile themes, testimonials, and network browsing.",
    museumContext: {
      years: "2002–2008",
      summary:
        "Testimonials, profile skins, and public friends lists made online identity a visible Filipino social performance.",
      whyItMattered:
        "Friendster introduced millions of Filipinos to early social networking before modern algorithmic feeds.",
      sources: ["friendster-archive"],
    },
    phaseTarget: 3,
  },
  "nokia-messages": {
    id: "nokia-messages",
    title: "Nokia Messages",
    room: "technology",
    icon: "📱",
    symbol: "SMS",
    tagline: "Multi-tap texting, forwarded jokes, GM announcements, and mobile history.",
    isFlagship: true,
    defaultBounds: { x: 130, y: 50, width: 680, height: 560 },
    minSize: { width: 480, height: 420 },
    description:
      "Candy-bar phone simulator with inbox, outbox, multi-tap typing, ringtone picker, and historical EDSA II forwarded SMS simulation.",
    museumContext: {
      years: "2000–2010",
      summary:
        "A basic phone, prepaid load cards, and 160 characters fueled the texting capital of the world.",
      whyItMattered:
        "Texting made everyday communication affordable and powered historical mobilizations like EDSA II.",
      sources: ["itu-philippines", "edsa-text", "cidob-text-revolution"],
    },
    phaseTarget: 4,
  },
  "net-cafe": {
    id: "net-cafe",
    title: "Net Café Manager",
    room: "technology",
    icon: "🖥️",
    symbol: "CAFE",
    tagline: "Rent a terminal, manage prepaid time, and relive computer-shop barkada rituals.",
    isFlagship: true,
    defaultBounds: { x: 170, y: 60, width: 760, height: 540 },
    minSize: { width: 500, height: 380 },
    description:
      "Terminal session simulator featuring hourly rates, time countdowns, desktop apps, and printing simulation.",
    museumContext: {
      years: "1998–2010+",
      summary:
        "Computer shops were classrooms, multiplayer arenas, chat hubs, and neighborhood tambayans.",
      whyItMattered:
        "Shared access democratized internet literacy across the country long before ubiquitous home broadband.",
      sources: ["itu-philippines"],
    },
    phaseTarget: 5,
  },
  "reality-tv-vote": {
    id: "reality-tv-vote",
    title: "Reality TV Vote",
    room: "performance",
    icon: "📺",
    symbol: "VOTE",
    tagline: "Simulate SMS voting, browse nominee profiles, and see participatory television.",
    isFlagship: false,
    defaultBounds: { x: 110, y: 50, width: 700, height: 520 },
    minSize: { width: 480, height: 380 },
    description:
      "Television voting console showing how viewers shaped reality-show outcomes via mobile participation.",
    museumContext: {
      years: "2005–2010",
      summary:
        "Shows like Pinoy Big Brother let television audiences determine who stayed and who became national stars.",
      whyItMattered:
        "Mobile voting turned viewers from passive consumers into active arbiters of celebrity.",
      sources: ["pbb-history"],
    },
    phaseTarget: 6,
  },
  "opm-media-player": {
    id: "opm-media-player",
    title: "OPM Media Player",
    room: "performance",
    icon: "📻",
    symbol: "OPM",
    tagline: "Retro digital media player celebrating 2000s Pinoy band culture and homemade playlists.",
    isFlagship: false,
    defaultBounds: { x: 210, y: 70, width: 640, height: 480 },
    minSize: { width: 460, height: 360 },
    description:
      "Authentic digital audio player with simulated visualizer, playlist curation, and curatorial liner notes on the 2000s band scene.",
    museumContext: {
      years: "2000–2009",
      summary:
        "Bands like Rivermaya, Parokya ni Edgar, Bamboo, and Hale soundtracked youth culture.",
      whyItMattered:
        "The mid-2000s band boom gave young Filipinos anthems for friendship, heartbreak, and resilience.",
      sources: ["ncca-popular-music", "ncca-pinoy-rock"],
    },
    phaseTarget: 6,
  },
  pinoytube: {
    id: "pinoytube",
    title: "PinoyTube",
    room: "performance",
    icon: "▶️",
    symbol: "TUBE",
    tagline: "Early web video portal with buffering playback, comments, and grassroots Filipino creators.",
    isFlagship: false,
    defaultBounds: { x: 150, y: 40, width: 760, height: 540 },
    minSize: { width: 500, height: 400 },
    description:
      "Early web video portal recreation demonstrating buffering sequences, community ratings, and bedroom creator fame.",
    museumContext: {
      years: "2005–2010",
      summary:
        "Bedroom dance covers, acoustic sessions, and comedy sketches launched grassroots online fame.",
      whyItMattered:
        "Creators collapsed the barrier between audience and performer without studio gatekeepers.",
      sources: ["youtube-history"],
    },
    phaseTarget: 7,
  },
  "tv-tambayan": {
    id: "tv-tambayan",
    title: "TV Tambayan",
    room: "globalization",
    icon: "📡",
    symbol: "TV",
    tagline: "Browse Asianovela, anime, and variety channels with Filipino localization notes.",
    isFlagship: false,
    defaultBounds: { x: 120, y: 60, width: 740, height: 530 },
    minSize: { width: 500, height: 380 },
    description:
      "Broadcast schedule and channel switcher illustrating Asianovela imports and afternoon anime blocks dubbed in Filipino.",
    museumContext: {
      years: "2001–2008",
      summary:
        "Meteor Garden and afternoon anime blocks reshaped Philippine primetime habits.",
      whyItMattered:
        "Filipino dubbing and localization made foreign storytelling an intimate, shared cultural staple.",
      sources: ["korean-wave", "japan-foundation-anime"],
    },
    phaseTarget: 7,
  },
  "chat-archives": {
    id: "chat-archives",
    title: "Chat Archives",
    room: "globalization",
    icon: "💬",
    symbol: "CHAT",
    tagline: "Switch between Yahoo Messenger and mIRC interfaces to read barkada conversations.",
    isFlagship: false,
    defaultBounds: { x: 190, y: 50, width: 700, height: 520 },
    minSize: { width: 480, height: 380 },
    description:
      "Dual-interface instant chat archive featuring Yahoo Messenger and mIRC rooms with BUZZ! feedback, statuses, and historical transcripts.",
    museumContext: {
      years: "2000–2008",
      summary:
        "Nicknames, emoticons, buzzes, and mIRC IRC channels established real-time online identity.",
      whyItMattered:
        "Instant messaging connected Filipinos locally and to OFWs abroad in real time.",
      sources: ["yahoo-messenger", "mirc-history"],
    },
    phaseTarget: 8,
  },
  "ppop-passport": {
    id: "ppop-passport",
    title: "P-pop Passport",
    room: "globalization",
    icon: "🛂",
    symbol: "PASS",
    tagline: "Interactive cultural map tracing the evolution from foreign influences to modern P-pop.",
    isFlagship: false,
    defaultBounds: { x: 140, y: 50, width: 750, height: 520 },
    minSize: { width: 500, height: 380 },
    description:
      "Visual timeline and passport stamp collection tracing regional pop influences and localized Filipino musical performance.",
    museumContext: {
      years: "2000–2010+",
      summary:
        "Filipino musicians and performers absorbed regional genres and forged an original pop identity.",
      whyItMattered:
        "Demonstrates that globalization was an active cycle of adaptation, reinterpretation, and export.",
      sources: ["p-pop", "ncca-popular-music"],
    },
    phaseTarget: 8,
  },
};

export const ROOM_FOLDERS: Record<FolderId, RoomFolderMetadata> = {
  "folder-technology": {
    id: "folder-technology",
    roomId: "technology",
    title: "Technology Folder",
    icon: "📁",
    color: "#0f67c7",
    description:
      "Phones, computer shops, profiles, and forwarded messages made connection immediate—and public.",
    appIds: ["friendster", "nokia-messages", "net-cafe"],
    defaultBounds: { x: 90, y: 40, width: 680, height: 480 },
    minSize: { width: 460, height: 360 },
  },
  "folder-performance": {
    id: "folder-performance",
    roomId: "performance",
    title: "Performance Folder",
    icon: "📁",
    color: "#d84a1b",
    description:
      "Voting, singing, uploading, and showing up let ordinary audiences shape who became visible.",
    appIds: ["reality-tv-vote", "opm-media-player", "pinoytube"],
    defaultBounds: { x: 130, y: 60, width: 680, height: 480 },
    minSize: { width: 460, height: 360 },
  },
  "folder-globalization": {
    id: "folder-globalization",
    roomId: "globalization",
    title: "Globalization Folder",
    icon: "📁",
    color: "#3f7c38",
    description:
      "Television and the early social web connected Filipino audiences to Asian and global media, then inspired new local forms.",
    appIds: ["tv-tambayan", "chat-archives", "ppop-passport"],
    defaultBounds: { x: 170, y: 80, width: 680, height: 480 },
    minSize: { width: 460, height: 360 },
  },
};

export const APP_LIST: AppMetadata[] = Object.values(APP_CATALOG);
export const ROOM_FOLDER_LIST: RoomFolderMetadata[] = Object.values(ROOM_FOLDERS);

export function getApp(id: string): AppMetadata | undefined {
  return APP_CATALOG[id as AppId];
}

export function getRoomFolder(roomId: RoomId): RoomFolderMetadata | undefined {
  return ROOM_FOLDER_LIST.find((folder) => folder.roomId === roomId);
}

export function getRoomFolderById(id: string): RoomFolderMetadata | undefined {
  return ROOM_FOLDERS[id as FolderId];
}

export function getAppsForRoom(roomId: RoomId): AppMetadata[] {
  return APP_LIST.filter((app) => app.room === roomId);
}

// Convert all apps and room folders into WindowRegistrations for WindowManager
export const allAppRegistrations: WindowRegistration[] = [
  {
    id: "welcome",
    title: "Welcome to Throwback PH",
    icon: "🇵🇭",
    defaultBounds: { x: 160, y: 60, width: 720, height: 430 },
    minSize: { width: 480, height: 350 },
  },
  {
    id: "museum",
    title: "Throwback PH",
    icon: "🏛️",
    defaultBounds: { x: 100, y: 30, width: 880, height: 570 },
    minSize: { width: 500, height: 380 },
  },
  ...ROOM_FOLDER_LIST.map((folder) => ({
    id: folder.id,
    title: folder.title,
    icon: folder.icon,
    defaultBounds: folder.defaultBounds,
    minSize: folder.minSize,
  })),
  ...APP_LIST.map((app) => ({
    id: app.id,
    title: app.title,
    icon: app.icon,
    defaultBounds: app.defaultBounds,
    minSize: app.minSize,
  })),
];
