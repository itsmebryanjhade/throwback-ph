import type {
  Bulletin,
  FictionalFriend,
  FriendsterNotification,
  FriendsterTheme,
  Testimonial,
  UserProfile,
} from "./types";

export const FRIENDSTER_THEMES: FriendsterTheme[] = [
  {
    id: "classic-orange",
    name: "Classic Friendster Orange",
    primary: "#ea6d00",
    accent: "#ff9436",
    background: "#fff8f0",
    surface: "#ffffff",
    text: "#2c1704",
    border: "#fcd7b2",
  },
  {
    id: "cyber-neon",
    name: "Cyber Café Neon",
    primary: "#00b874",
    accent: "#00ffa3",
    background: "#0d1b2a",
    surface: "#1b263b",
    text: "#e0f2fe",
    border: "#415a77",
  },
  {
    id: "glitter-star",
    name: "Emo & Glitter Star",
    primary: "#db2777",
    accent: "#f472b6",
    background: "#18181b",
    surface: "#27272a",
    text: "#fdf2f8",
    border: "#831843",
  },
  {
    id: "sunset-pastel",
    name: "Manila Bay Sunset",
    primary: "#7c3aed",
    accent: "#f97316",
    background: "#faf5ff",
    surface: "#ffffff",
    text: "#2e1065",
    border: "#ddd6fe",
  },
  {
    id: "denim-sparkle",
    name: "Low-Rise Denim Y2K",
    primary: "#2563eb",
    accent: "#60a5fa",
    background: "#eff6ff",
    surface: "#ffffff",
    text: "#1e3a8a",
    border: "#bfdbfe",
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  displayName: "Miguel (Throwback PH)",
  status: "listening to Sponge Cola · tambay sa comp shop 🎧",
  aboutMe:
    "Mabuhay! Welcome to my Friendster page. 2000s kid loving OPM rock bands (Hale, Rivermaya, Kamikazee), weekend LAN games at the corner cyber café, and collecting testimonials from true barkada. Mag-iwan ka ng testi ha bago ka umalis! :D",
  location: "Quezon City, Philippines",
  memberSince: "March 2004",
  relationshipStatus: "Single",
  profileViews: 1428,
  themeId: "classic-orange",
  avatar: "🧑‍💻",
  portraitSrc: "/museum/phase-9/images/friendster-kiko.jpg",
  portraitPosition: "50% 32%",
};

export const FICTIONAL_PROFILES: FictionalFriend[] = [
  {
    id: "kiko-reyes",
    name: "Kiko Reyes",
    handle: "xX_dark_kiko_Xx",
    location: "Diliman, Quezon City",
    avatar: "🎸",
    portraitSrc: "/museum/phase-9/images/friendster-paolo.jpg",
    portraitPosition: "50% 28%",
    tagline: "rakista for life · Urbandub & Kamikazee",
    aboutMe:
      "Architecture major at UP Diliman. Usually found at Sarah's or jamming in my room. If you need chords for any 2000s song, just text me. No jejemon pls haha.",
    relationshipStatus: "In a relationship",
    interests: ["Pinoy Rock", "Guitar", "Drafting", "UP Fair", "San Miguel Pale"],
    isDefaultFriend: true,
  },
  {
    id: "bea-gonzales",
    name: "Bea Gonzales",
    handle: "gLamm_bEa",
    location: "Makati City",
    avatar: "🎀",
    portraitSrc: "/museum/phase-9/images/friendster-bea.png",
    portraitPosition: "50% 28%",
    tagline: "Always online via DSL · coffee & blogspot",
    aboutMe:
      "Digital artist by day, call center QA by night. Obsessed with customizing profile CSS, lomography cameras, and Japanese stationery. Leave love and testimonials!",
    relationshipStatus: "Single",
    interests: ["Lomography", "Blogging", "CSS Skins", "Frappes", "Call Center Life"],
    isDefaultFriend: true,
  },
  {
    id: "mark-bautista",
    name: "Marco Bautista",
    handle: "ChaoS_Sniper",
    location: "Davao City",
    avatar: "🕹️",
    portraitSrc: "/museum/phase-9/images/friendster-mark.jpg",
    portraitPosition: "50% 25%",
    tagline: "₱15/hr café warrior · 5v5 mid tournament later",
    aboutMe:
      "IT sophomore who lives on Mountain Dew and instant noodles. Certified Defense of the Ancients (DotA) addict. Looking for reliable 5th player for Sunday bracket.",
    relationshipStatus: "It's complicated",
    interests: ["DotA 1", "Ragnarok Online", "Counter-Strike 1.6", "Lan Tournaments"],
    isDefaultFriend: true,
  },
  {
    id: "janine-santos",
    name: "Janine Santos",
    handle: "ja_ninee<3",
    location: "Cebu City",
    avatar: "🌺",
    portraitSrc: "/museum/phase-9/images/friendster-janine.jpg",
    portraitPosition: "50% 24%",
    tagline: "textmate wanted 0917-xxx · GM: good morning all!",
    aboutMe:
      "BS Nursing student. Duty is tough but texting my barkada keeps me awake. I forward only the best quotes and ASCII text art. Add me up!",
    relationshipStatus: "Single",
    interests: ["Nursing Duty", "Prepaid Load", "SMS Art", "Cebu Beaches", "Videoke"],
    isDefaultFriend: false,
  },
  {
    id: "paolo-dizon",
    name: "Paolo Dizon",
    handle: "Pao_AnimeGuy",
    location: "Manila",
    avatar: "🍙",
    portraitSrc: "",
    portraitPosition: "50% 30%",
    tagline: "Cardcaptor Sakura fanclub president · cosplay booth",
    aboutMe:
      "Mass Comm student at UST. After-school anime watcher on Channel 2 and Channel 7. Attending every convention at SM Megatrade Hall. Let's trade VCDs!",
    relationshipStatus: "Single",
    interests: ["Afternoon Anime", "Cosplay", "VCD Trading", "J-Pop", "Quiapo Hauls"],
    isDefaultFriend: false,
  },
  {
    id: "dianne-morales",
    name: "Dianne Morales",
    handle: "DiDi_Chic",
    location: "Baguio City",
    avatar: "☕",
    portraitSrc: "",
    portraitPosition: "50% 30%",
    tagline: "Session Road acoustic nights & thrift hauls 🍂",
    aboutMe:
      "Tourism junior up north. Loving Baguio fog, secondhand cardigans from wagwagan, and indie acoustic acoustic sessions. Proud Igorota!",
    relationshipStatus: "In a relationship",
    interests: ["Thrift Shopping", "Acoustic Music", "Strawberry Taho", "Baguio Nights"],
    isDefaultFriend: true,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    authorId: "kiko-reyes",
    authorName: "Kiko Reyes",
    authorAvatar: "🎸",
    recipientId: "user",
    content:
      "Pare solid nung tugtugan last weekend! Thanks for letting me borrow your effects pedal. One of the realest dudes on Friendster. Wag mo ko kalimutan sa Top Friends list mo ha!",
    date: "August 14, 2005",
    status: "approved",
  },
  {
    id: "testi-2",
    authorId: "bea-gonzales",
    authorName: "Bea Gonzales",
    authorAvatar: "🎀",
    recipientId: "user",
    content:
      "Super bait and stylish! Ganda ng theme mo, ikaw nag-code ng CSS nyan? Stay cool and see you at Megamall this Saturday with the whole barkada! xoxo",
    date: "July 29, 2005",
    status: "approved",
  },
  {
    id: "testi-3",
    authorId: "mark-bautista",
    authorName: "Mark Bautista",
    authorAvatar: "🕹️",
    recipientId: "user",
    content:
      "Galing mag-support kanina sa comp shop, muntik na tayo matalo dun sa pustahan haha! Next time ikaw mag-pick ng hero. Approved agad to paps!",
    date: "June 11, 2005",
    status: "approved",
  },
  {
    id: "testi-pending-1",
    authorId: "dianne-morales",
    authorName: "Dianne Morales",
    authorAvatar: "☕",
    recipientId: "user",
    content:
      "Uy Miguel! Thank you sa pagsama sa Baguio trip last summer. Here is your official testi as promised! Pa-approve and please write me back a testi too pag online ka na! :*",
    date: "Yesterday at 11:24 PM",
    status: "pending",
  },
];

export const INITIAL_BULLETINS: Bulletin[] = [
  {
    id: "bull-1",
    authorName: "Kiko Reyes",
    authorHandle: "xX_dark_kiko_Xx",
    authorAvatar: "🎸",
    title: "Sino sasama sa UP Fair next Friday?",
    content:
      "Barkada, may tickets na kami for Friday night (Rock night)! Sponge Cola, Parokya, and Kamikazee lineup. Kita-kits sa Sunken Garden mga 5 PM. Bring extra shirt and payong!",
    date: "Oct 12, 2005",
  },
  {
    id: "bull-2",
    authorName: "Mark Bautista",
    authorHandle: "ChaoS_Sniper",
    authorAvatar: "🕹️",
    title: "5v5 DotA Tournament at Netopia Cyberzone",
    content:
      "Registration is ₱250 per team inclusive of 3 hours playing time. Champion gets ₱3,000 + trophy. Text me at 0918-xxx-xxxx to register your team roster.",
    date: "Oct 10, 2005",
  },
  {
    id: "bull-3",
    authorName: "Bea Gonzales",
    authorHandle: "gLamm_bEa",
    authorAvatar: "🎀",
    title: "New free Friendster CSS skins posted on my Blogspot!",
    content:
      "Just designed 3 new glitter/sparkle layouts for Friendster profiles. Includes music player embed code and transparent tables. Link in my about me section!",
    date: "Oct 08, 2005",
  },
];

export const INITIAL_NOTIFICATIONS: FriendsterNotification[] = [
  {
    id: "notif-1",
    type: "testimonial",
    message: "Dianne Morales wrote you a new testimonial. It requires your approval before appearing on your profile.",
    time: "Yesterday",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "friend_request",
    message: "Paolo Dizon wants to be your friend on Friendster.",
    time: "2 days ago",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "profile_view",
    message: "42 people viewed your profile in the past 24 hours.",
    time: "3 days ago",
    isRead: true,
  },
];

export const PRESET_TESTIMONIALS = [
  "Solid na kaibigan! Kahit saan may tambayan laging maaasahan sa comp shop at gala.",
  "Super bait and genuine! Best friendster buddy. Wag mo ko tatanggalin sa Top Friends ha!",
  "Great taste in music and themes! Keep rocking and see you sa next gig!",
  "Always fun to chat with on YM. Pa-text na lang pag online ka na ulit! :D",
];
