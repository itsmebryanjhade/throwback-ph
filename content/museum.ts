export type RoomId = "technology" | "performance" | "globalization";
export type ExhibitInteraction = "nokia" | "chat-archives";
export type VisualKind =
  | "phone"
  | "computer-shop"
  | "profile"
  | "text-rally"
  | "television"
  | "music-player"
  | "karaoke"
  | "video-page"
  | "drama-screen"
  | "anime-screen"
  | "chat"
  | "passport";

export type Exhibit = {
  id: string;
  room: RoomId;
  title: string;
  years: string;
  summary: string;
  whyItMattered: string;
  alt: string;
  visualKind: VisualKind;
  sourceIds: readonly string[];
  interaction?: ExhibitInteraction;
};

export type MuseumRoom = {
  id: RoomId;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  exhibits: readonly Exhibit[];
};

export const museumRooms: readonly MuseumRoom[] = [
  {
    id: "technology",
    title: "Technology changed the rhythm of everyday life.",
    shortTitle: "Technology",
    description: "Phones, computer shops, profiles, and forwarded messages made connection immediate—and public.",
    color: "#0f67c7",
    exhibits: [
      {
        id: "nokia-sms",
        room: "technology",
        title: "Nokia & SMS Culture",
        years: "2000–2010",
        summary: "A basic phone, prepaid load, and 160 characters were enough to organize barkada plans, send jokes, court someone, or pass news across the country.",
        whyItMattered: "Texting made digital participation affordable and distinctly Filipino: brief, inventive, social, and always moving.",
        alt: "A recreated candy-bar phone showing a Filipino text-message inbox.",
        visualKind: "phone",
        sourceIds: ["itu-philippines", "edsa-text"],
        interaction: "nokia",
      },
      {
        id: "internet-cafe",
        room: "technology",
        title: "Internet Café Life",
        years: "₱15 per hour",
        summary: "Before fast home internet became common, computer shops were classrooms, game rooms, communication hubs, and after-school tambayan rolled into one.",
        whyItMattered: "Shared access turned going online into a social ritual. Digital literacy often began beside friends, a timer, and a plastic stool.",
        alt: "A recreated computer-shop price board and row of desktop monitors.",
        visualKind: "computer-shop",
        sourceIds: ["itu-philippines"],
      },
      {
        id: "friendster-era",
        room: "technology",
        title: "Friendster Era",
        years: "Profile viewed",
        summary: "Testimonials, profile skins, carefully chosen photos, and a visible friends list made identity something Filipinos could design and perform online.",
        whyItMattered: "Friendster introduced a generation to social networking—and to the pleasure and pressure of being seen on the internet.",
        alt: "An original social-network profile recreation inspired by mid-2000s Friendster pages.",
        visualKind: "profile",
        sourceIds: ["friendster-archive"],
      },
      {
        id: "power-of-text",
        room: "technology",
        title: "Power of Text",
        years: "EDSA II · 2001",
        summary: "During EDSA II, forwarded mobile messages helped people share updates and coordinate gatherings faster than traditional word of mouth.",
        whyItMattered: "The same tool used for everyday chika could also mobilize citizens, showing that popular technology could carry political power.",
        alt: "A wall of forwarded SMS messages leading toward a public gathering.",
        visualKind: "text-rally",
        sourceIds: ["edsa-text", "itu-philippines"],
      },
    ],
  },
  {
    id: "performance",
    title: "Performance escaped the stage.",
    shortTitle: "Performance",
    description: "Voting, singing, uploading, and showing up let ordinary audiences shape who became visible.",
    color: "#d84a1b",
    exhibits: [
      {
        id: "reality-tv",
        room: "performance",
        title: "Reality TV Participation",
        years: "Text to vote",
        summary: "When Pinoy Big Brother arrived in 2005, viewers did more than watch. Through voting and fan communities, audiences helped decide who stayed and who became a star.",
        whyItMattered: "Fame felt participatory. A regular person’s story could become national entertainment, while the audience gained visible influence.",
        alt: "A recreated television voting screen with housemate silhouettes and SMS instructions.",
        visualKind: "television",
        sourceIds: ["pbb-history"],
      },
      {
        id: "opm-band-scene",
        room: "performance",
        title: "OPM Band Scene",
        years: "Burned CD · Side A",
        summary: "Bamboo, Rivermaya, Parokya ni Edgar, Hale, and many others filled radio countdowns, school fairs, bars, and homemade playlists.",
        whyItMattered: "The band scene gave young Filipinos a shared soundtrack and a language for humor, heartbreak, protest, and belonging.",
        alt: "A recreated portable music player displaying a Filipino rock playlist.",
        visualKind: "music-player",
        sourceIds: ["ncca-popular-music", "ncca-pinoy-rock"],
      },
      {
        id: "karaoke-mall-shows",
        room: "performance",
        title: "Karaoke & Mall Shows",
        years: "Your song is next",
        summary: "Performance lived in videoke rooms, school programs, barangay celebrations, shopping malls, and small stages—not only in formal theaters.",
        whyItMattered: "Popular culture was something people performed together. Participation mattered as much as professional polish.",
        alt: "A karaoke lyrics screen beside a mall-show ticket and microphone.",
        visualKind: "karaoke",
        sourceIds: ["ncca-popular-music"],
      },
      {
        id: "early-youtube",
        room: "performance",
        title: "Early YouTube Fame",
        years: "Buffering…",
        summary: "Covers, lip-sync clips, comedy, and bedroom performances found audiences beyond television. Uploading became a new kind of audition.",
        whyItMattered: "Creators no longer needed a studio to be discovered. The distance between audience and performer began to collapse.",
        alt: "A recreated early video-page interface showing a Filipino bedroom performance.",
        visualKind: "video-page",
        sourceIds: ["youtube-history"],
      },
    ],
  },
  {
    id: "globalization",
    title: "Global stories arrived—and became local.",
    shortTitle: "Globalization",
    description: "Television and the early social web connected Filipino audiences to Asian and global media, then inspired new local forms.",
    color: "#3f7c38",
    exhibits: [
      {
        id: "asianovela-craze",
        room: "globalization",
        title: "Asianovela Craze",
        years: "Next episode",
        summary: "Shows such as Meteor Garden and Full House made dubbed Asian dramas appointment viewing and influenced hairstyles, fashion, music, and ideas about romance.",
        whyItMattered: "Filipino pop culture looked beyond Hollywood and found powerful regional connections across Asia.",
        alt: "A television guide recreation featuring a primetime Asian drama slot.",
        visualKind: "drama-screen",
        sourceIds: ["korean-wave"],
      },
      {
        id: "anime-tv",
        room: "globalization",
        title: "Anime on Philippine TV",
        years: "Filipino dubbed",
        summary: "Pokémon, Digimon, Cardcaptor Sakura, and other series became part of after-school routines through Filipino-dubbed television broadcasts.",
        whyItMattered: "Translation made foreign stories intimate. Fans adopted characters and genres while giving them local voices and memories.",
        alt: "A CRT television recreation showing a colorful, original anime-inspired broadcast frame.",
        visualKind: "anime-screen",
        sourceIds: ["japan-foundation-anime"],
      },
      {
        id: "chat-archives",
        room: "globalization",
        title: "Chat Archives",
        years: "BUZZ!",
        summary: "Yahoo Messenger and mIRC rooms made presence visible through status lines, nicknames, emoticons, buzzes, and conversations with people far away.",
        whyItMattered: "Real-time chat introduced new social rules and connected local barkadas to a borderless, always-awake internet.",
        alt: "A combined archive of recreated Yahoo Messenger and mIRC conversations.",
        visualKind: "chat",
        sourceIds: ["yahoo-messenger", "mirc-history"],
        interaction: "chat-archives",
      },
      {
        id: "foreign-to-ppop",
        room: "globalization",
        title: "From Foreign Influence to P-pop",
        years: "Adapt · perform · export",
        summary: "Filipino artists absorbed global pop formats, reshaped them through local language and performance, and built work ready to travel outward again.",
        whyItMattered: "Globalization was not simple copying. It became a cycle of borrowing, transforming, and asserting Filipino identity for wider audiences.",
        alt: "A passport-like collage connecting incoming media influences to outgoing Filipino pop culture.",
        visualKind: "passport",
        sourceIds: ["p-pop", "ncca-popular-music"],
      },
    ],
  },
] as const;

export function getExhibit(id: string): Exhibit | undefined {
  return museumRooms.flatMap((room) => room.exhibits).find((exhibit) => exhibit.id === id);
}
