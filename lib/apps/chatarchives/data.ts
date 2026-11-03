import type {
  ChatArchivesState,
  CuratedTranscript,
  MircChannel,
  YahooContact,
} from "./types";

export const YAHOO_CONTACTS: YahooContact[] = [
  {
    id: "contact-angel",
    username: "xX_angel_Xx",
    displayName: "Angelica C. (Morayta)",
    avatar: "🎀",
    portraitSrc: "/museum/phase-9/images/friendster-janine.jpg",
    status: "available",
    customStatus: "♪ listening to: Nobela by Join The Club ♪",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "contact-skater",
    username: "manila_skater",
    displayName: "Mark / SkaterBoy",
    avatar: "🛹",
    portraitSrc: "/museum/phase-9/images/friendster-mark.jpg",
    status: "busy",
    customStatus: "DOTA 5v5 sa comp shop! DND",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "contact-kuya",
    username: "kuya_miguel",
    displayName: "Kuya Miguel (OFW Dubai)",
    avatar: "✈️",
    portraitSrc: "/museum/phase-9/images/friendster-paolo.jpg",
    status: "available",
    customStatus: "Online habang break sa clinic | Ingat kayo sa Manila",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "contact-rocker",
    username: "pinoy_rocker",
    displayName: "Dexter / Rocker",
    avatar: "🎸",
    portraitSrc: "/museum/phase-9/images/friendster-kiko.jpg",
    status: "brb",
    customStatus: "Bumili lang fishball sa kanto... BRB!",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "contact-crush",
    username: "school_crush",
    displayName: "Bea / Batch 2005",
    avatar: "🌸",
    portraitSrc: "/museum/phase-9/images/friendster-bea.png",
    status: "invisible",
    customStatus: "reviewing for midterms...",
    unreadCount: 0,
    isOnline: false,
  },
];

export const INITIAL_YAHOO_MESSAGES = {
  "contact-angel": [
    {
      id: "m-ym-1",
      sender: "miguel_08",
      text: "uy online ka pala!",
      timestamp: "6:42 PM",
      isMe: true,
    },
    {
      id: "m-ym-2",
      sender: "xX_angel_Xx",
      text: "oo haha galing comp shop katatapos lang ng research paper",
      timestamp: "6:43 PM",
    },
    {
      id: "m-ym-3",
      sender: "miguel_08",
      text: "send mo testimonial ko sa Friendster ha!",
      timestamp: "6:44 PM",
      isMe: true,
    },
    {
      id: "m-ym-4",
      sender: "System",
      text: "xX_angel_Xx sent a BUZZ!",
      timestamp: "6:44 PM",
      isSystem: true,
      isBuzz: true,
    },
    {
      id: "m-ym-5",
      sender: "xX_angel_Xx",
      text: "sige maya pag-uwi ko sa bahay haha, 5 mins na lang oras ko dito sa shop!",
      timestamp: "6:45 PM",
    },
  ],
  "contact-skater": [
    {
      id: "m-ym-s1",
      sender: "manila_skater",
      text: "pre tara comp shop mamaya! May pustahan sa Dota 5v5",
      timestamp: "5:15 PM",
    },
  ],
  "contact-kuya": [
    {
      id: "m-ym-k1",
      sender: "kuya_miguel",
      text: "Kamusta kayo diyan ni Mama? Nagpadala na ako ng balikbayan box kahapon.",
      timestamp: "3:30 PM",
    },
    {
      id: "m-ym-k2",
      sender: "miguel_08",
      text: "Salamat Kuya! Okay naman kami dito, nag-aaral mabuti.",
      timestamp: "3:32 PM",
      isMe: true,
    },
  ],
  "contact-rocker": [
    {
      id: "m-ym-r1",
      sender: "pinoy_rocker",
      text: "pare narinig mo na bagong kanta ng Kamikazee? Astig nung bassline!",
      timestamp: "4:05 PM",
    },
  ],
  "contact-crush": [],
};

export const MIRC_CHANNELS: MircChannel[] = [
  {
    id: "chan-tambayan",
    name: "#pinoytambayan",
    topic: "Welcome to #pinoytambayan | Bawal mag-flood | ASL pls! | OP: @Admin_Pinoy",
    userCount: 42,
    unreadCount: 0,
    users: [
      { nick: "Admin_Pinoy", role: "@" },
      { nick: "Mod_AteV", role: "@" },
      { nick: "DJ_Mike", role: "+" },
      { nick: "cebu_girl", role: "+" },
      { nick: "manilaKid", role: "" },
      { nick: "davao_boy", role: "" },
      { nick: "baguio_gamer", role: "" },
      { nick: "quezon_kid", role: "" },
      { nick: "miguel_ph", role: "" },
    ],
  },
  {
    id: "chan-opm",
    name: "#opm-garage",
    topic: "OPM Rock, demo tapes, and Club Dredd memories | Share guitar tabs & gig skeds",
    userCount: 28,
    unreadCount: 0,
    users: [
      { nick: "RockOps", role: "@" },
      { nick: "Bassist_Mark", role: "+" },
      { nick: "Drummer_Boy", role: "" },
      { nick: "Vocal_Chix", role: "" },
      { nick: "miguel_ph", role: "" },
    ],
  },
  {
    id: "chan-ragnarok",
    name: "#ragnarok-ph",
    topic: "Chaos / Loki Server | Buying Elunium & Whisper Card @ Prontera South | No scam pls",
    userCount: 56,
    unreadCount: 0,
    users: [
      { nick: "GuildMaster_RO", role: "@" },
      { nick: "Knight_Lord", role: "+" },
      { nick: "Priest_Healer", role: "+" },
      { nick: "Hunter_Ph", role: "" },
      { nick: "Assassin_Cross", role: "" },
      { nick: "miguel_ph", role: "" },
    ],
  },
  {
    id: "chan-manila",
    name: "#manila-nights",
    topic: "Late-night cyber hangout for college students and call-center barkadas | No caps lock",
    userCount: 35,
    unreadCount: 0,
    users: [
      { nick: "NightOwl_Op", role: "@" },
      { nick: "StarCity_Fan", role: "" },
      { nick: "Katipunan_Guy", role: "" },
      { nick: "miguel_ph", role: "" },
    ],
  },
];

export const INITIAL_MIRC_MESSAGES = {
  "chan-tambayan": [
    {
      id: "m-mirc-1",
      sender: "***",
      text: "miguel_ph has joined #pinoytambayan",
      timestamp: "7:00 PM",
      isSystem: true,
    },
    {
      id: "m-mirc-2",
      sender: "manilaKid",
      text: "asl? welcome sa channel mga bagong pasok!",
      timestamp: "7:01 PM",
    },
    {
      id: "m-mirc-3",
      sender: "cebu_girl",
      text: "hello all, bawal mag-flood ha baka ma-kick ni @Admin_Pinoy :)",
      timestamp: "7:02 PM",
    },
    {
      id: "m-mirc-4",
      sender: "davao_boy",
      text: "kumusta weather diyan sa Luzon? dito sa amin maulan",
      timestamp: "7:03 PM",
    },
  ],
  "chan-opm": [
    {
      id: "m-mirc-o1",
      sender: "***",
      text: "miguel_ph has joined #opm-garage",
      timestamp: "6:50 PM",
      isSystem: true,
    },
    {
      id: "m-mirc-o2",
      sender: "RockOps",
      text: "Sino pupunta sa Mayric's gig sa Friday? Acoustic set daw!",
      timestamp: "6:51 PM",
    },
  ],
  "chan-ragnarok": [
    {
      id: "m-mirc-r1",
      sender: "***",
      text: "miguel_ph has joined #ragnarok-ph",
      timestamp: "7:10 PM",
      isSystem: true,
    },
    {
      id: "m-mirc-r2",
      sender: "Knight_Lord",
      text: "LF party sa Payon Cave level 3, need healer priest ASAP!",
      timestamp: "7:11 PM",
    },
  ],
  "chan-manila": [
    {
      id: "m-mirc-m1",
      sender: "***",
      text: "miguel_ph has joined #manila-nights",
      timestamp: "7:15 PM",
      isSystem: true,
    },
    {
      id: "m-mirc-m2",
      sender: "NightOwl_Op",
      text: "Good evening Metro Manila! BPO graveyard shift check in!",
      timestamp: "7:16 PM",
    },
  ],
};

export const YAHOO_PRESETS = [
  "BUZZ! Sagot ka naman!",
  "Send mo testimonial ko sa Friendster!",
  "Comp shop tayo mamaya pagkatapos ng klase?",
  "Anong tugtog mo ngayon sa Winamp?",
  "BRB merienda muna pandesal at kape.",
  "Offline na muna ako, tapos na oras ko sa rent!",
];

export const MIRC_PRESETS = [
  "19/m/manila - hello #pinoytambayan!",
  "/me waves hello to everyone in the channel",
  "asl please?",
  "Sino naglalaro ng Ragnarok sa Chaos server?",
  "bawal mag-flood mga pards haha :D",
  "brb AFK kain muna dinner",
];

export const EMOTICONS = [
  { code: ":)", label: "Happy", symbol: "😊" },
  { code: ":D", label: "Big Grin", symbol: "😀" },
  { code: ";)", label: "Wink", symbol: "😉" },
  { code: ":(", label: "Sad", symbol: "🙁" },
  { code: ":P", label: "Tongue Out", symbol: "😛" },
  { code: ">:D<", label: "Big Hug", symbol: "🤗" },
  { code: "(:|", label: "Yawn / Sleepy", symbol: "🥱" },
  { code: ":-*", label: "Kiss", symbol: "😘" },
  { code: ":O", label: "Surprised", symbol: "😮" },
  { code: "B-)", label: "Cool Glasses", symbol: "😎" },
];

export const CURATED_TRANSCRIPTS: CuratedTranscript[] = [
  {
    id: "transcript-asl",
    service: "mirc",
    title: "The ASL Protocol: Early Internet Introductions (2001)",
    year: "2001",
    participants: ["manilaKid", "davao_boy", "cebu_girl", "miguel_ph"],
    culturalContext:
      "In early IRC channels, 'ASL' (Age / Sex / Location) became a familiar informal shorthand in text-only chat rooms before social media photos were common. Recreated here as period-inspired social memory, pseudonymous screen names allowed youth from across different regions to socialize in text channels.",
    lines: [
      { speaker: "manilaKid", text: "asl all?", time: "08:15 PM" },
      { speaker: "cebu_girl", text: "18/f/cebu city here :)", time: "08:15 PM" },
      { speaker: "davao_boy", text: "20/m/davao, comp shop lang", time: "08:16 PM" },
      { speaker: "miguel_ph", text: "19/m/quezon city, college student", time: "08:16 PM" },
      {
        speaker: "manilaKid",
        text: "astig, buong bansa online ngayon!",
        time: "08:17 PM",
        note: "Highlights how IRC collapsed regional archipelago distance into instantaneous text rooms.",
      },
    ],
  },
  {
    id: "transcript-buzz",
    service: "yahoo",
    title: "The BUZZ! Vibration and Barkada Urgency (2005)",
    year: "2005",
    participants: ["xX_angel_Xx", "miguel_08"],
    culturalContext:
      "Yahoo! Messenger popularized the 'BUZZ!' alert in mid-2000s desktop releases. Triggering it produced a distinct audible rumble and window shake—recreated here to reflect period recollections of demanding immediate attention or playfully teasing friends during internet café sessions.",
    lines: [
      { speaker: "miguel_08", text: "psst... online ka pa?", time: "09:30 PM" },
      { speaker: "System", text: "*** miguel_08 sent a BUZZ! ***", time: "09:31 PM" },
      { speaker: "System", text: "*** miguel_08 sent a BUZZ! ***", time: "09:31 PM" },
      { speaker: "xX_angel_Xx", text: "aray ko naman! nag-freeze computer ko sa buzz mo!", time: "09:32 PM" },
      { speaker: "miguel_08", text: "haha sorry tagal mo sumagot eh, send mo na kasi Friendster testimonial ko!", time: "09:32 PM" },
    ],
  },
  {
    id: "transcript-ofw",
    service: "yahoo",
    title: "Bridging the Ocean: Dial-Up to OFW Families (2004)",
    year: "2004",
    participants: ["Kuya_Miguel_OFW", "miguel_08"],
    culturalContext:
      "Before mobile smartphone video apps became widespread, webcams and instant messaging services like Yahoo Messenger offered accessible alternatives for overseas workers staying in touch with relatives. In community recollections, internet café visits were frequently arranged around time-zone differences and overseas work schedules.",
    lines: [
      { speaker: "Kuya_Miguel_OFW", text: "Hello bunso, gising pa ba si Mama?", time: "11:00 PM" },
      { speaker: "miguel_08", text: "Opo kuya, katabi ko siya ngayon dito sa computer shop.", time: "11:01 PM" },
      { speaker: "Kuya_Miguel_OFW", text: "Pakisabi nakatanggap ko na sulat niya. Kumain na ba kayo?", time: "11:02 PM" },
      { speaker: "miguel_08", text: "Opo, nagpadala ka ba ng webcam kuya para makita ka namin next week?", time: "11:03 PM" },
      { speaker: "Kuya_Miguel_OFW", text: "Oo, kasama sa box. Ingat kayo diyan palagi.", time: "11:04 PM" },
    ],
  },
];

export const CHAT_CULTURAL_INSIGHTS = [
  {
    id: "insight-asl",
    title: "The ASL Protocol and Early Internet Anonymity",
    subtitle: "Conversational Shorthands in Pseudonymous Online Spaces",
    content:
      "Before social networks emphasized photo avatars and verified profiles, early internet chat relied heavily on text-driven handles. The shorthand 'ASL' (Age / Sex / Location) emerged in mIRC and web chat channels as a widespread informal icebreaker. Rather than a formal or universal protocol across every café, it served as a practical conversational entry point while preserving anonymity.",
  },
  {
    id: "insight-buzz-culture",
    title: "The Physics of Friendship: The Yahoo Messenger BUZZ!",
    subtitle: "Vibrating Screens, Sound Effects, and Real-Time Presence",
    content:
      "Documented in mid-2000s releases of Yahoo! Messenger (such as version 7.x), the BUZZ! button shook the recipient's entire chat window and triggered an audible alert. In Philippine youth cyberculture, buzzing is remembered as a playful, urgent nudge—an alarm to hurry up Friendster testimonials, an alert during shared online gaming sessions, or an affectionate digital poke among high school barkadas.",
  },
  {
    id: "insight-ofw-lifeline",
    title: "Bridging the Diaspora: Dial-Up to the Global Barkada",
    subtitle: "How Free Instant Messaging Kept Transnational Families Connected",
    content:
      "For Filipino families with relatives working overseas in the Middle East, East Asia, Europe, and North America, international telephone calls were often cost-prohibitive. Neighborhood computer shops with dial-up and broadband access offered an accessible alternative, allowing families to share real-time typed text, voice clips, and low-resolution webcam video across time zones.",
  },
  {
    id: "insight-irc-channels",
    title: "The IRC Channel Hierarchy: Ops, Voices, and Scripts",
    subtitle: "Grassroots Community Moderation in Late 90s Manila",
    content:
      "In channels like #pinoytambayan and #opm-garage, community order was maintained by Channel Operators ('@Ops') who wielded the power to kick and ban disruptive users. Filipino IRC enthusiasts customized their mIRC scripts with colorful ASCII banners, automated greet messages, and lag meters, creating an enduring subculture of youth net citizenship.",
  },
];

export const INITIAL_CHAT_ARCHIVES_STATE: ChatArchivesState = {
  activeTab: "chat",
  serviceMode: "yahoo",
  myNick: "miguel_08",
  myPresence: "available",
  myCustomStatus: "online sa comp shop :)",
  contacts: YAHOO_CONTACTS,
  activeContactId: "contact-angel",
  yahooMessages: INITIAL_YAHOO_MESSAGES,
  channels: MIRC_CHANNELS,
  activeChannelId: "chan-tambayan",
  mircMessages: INITIAL_MIRC_MESSAGES,
  isBuzzing: false,
  emoticonPickerOpen: false,
  curatedTranscripts: CURATED_TRANSCRIPTS,
  selectedTranscriptId: "transcript-buzz",
};
