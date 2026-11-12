import type { AppId } from "@/lib/apps/types";

/**
 * Story layer for exhibits: a hook, a hands-on "Try it" moment, short facts,
 * and a then-vs-now comparison. Exhibits without a story keep the classic
 * poster layout.
 */

export type StoryToy =
  | "textspeak"
  | "coin-timer"
  | "profile-skin"
  | "forward-chain"
  | "text-vote"
  | "burn-cd"
  | "videoke"
  | "upload"
  | "dub-scene"
  | "race-home"
  | "screen-name"
  | "mix-sound";

export type ExhibitStory = {
  /** One-line, conversational opener shown above the title. */
  hook: string;
  toy: StoryToy;
  tryIt: { title: string; instructions: string };
  facts: readonly { label: string; text: string }[];
  thenNow: { then: readonly string[]; now: readonly string[] };
  relatedApp: { id: AppId; pitch: string };
};

export const exhibitStories: Record<string, ExhibitStory> = {
  "nokia-sms": {
    hook: "Naalala mo pa? Every text had 160 characters, and every peso of load counted.",
    toy: "textspeak",
    tryIt: {
      title: "Type like it's 2003",
      instructions: "Write a message, then watch it squeeze into textspeak so it fits one SMS.",
    },
    facts: [
      {
        label: "160 characters",
        text: "One SMS could hold only 160 characters. Spellings like “gud am”, “u”, and “l8r” saved space and money.",
      },
      {
        label: "Load at the sari-sari store",
        text: "Prepaid load was sold in small amounts in neighborhood stores, so almost anyone could afford to text.",
      },
      {
        label: "GM culture",
        text: "Group messages (“GMs”) sent to an entire phonebook were a daily ritual: jokes, quotes, and good-morning greetings.",
      },
    ],
    thenNow: {
      then: ["160 characters per text", "Multi-tap keypad", "Phonebook GMs"],
      now: ["Unlimited chat messages", "Touchscreen and voice notes", "Group chats and stickers"],
    },
    relatedApp: {
      id: "nokia-messages",
      pitch: "Use a full candy-bar phone: multi-tap typing, ringtones, and the EDSA II forward.",
    },
  },
  "internet-cafe": {
    hook: "Barya lang, pero isang oras ng buong mundo. A few coins rented you the whole internet.",
    toy: "coin-timer",
    tryIt: {
      title: "Rent PC #7",
      instructions: "Drop coins into the counter. At ₱15 an hour, see how much time, and how much fun, they buy.",
    },
    facts: [
      {
        label: "Pay by the hour",
        text: "Shops charged by the hour, so the price board decided how long you could stay online.",
      },
      {
        label: "Study hall too",
        text: "Computer shops also typed, printed, and burned school projects, so classmates crowded in before deadlines.",
      },
      {
        label: "After-school arena",
        text: "Online games like Ragnarok, DotA, and Counter-Strike filled the seats as soon as classes ended.",
      },
    ],
    thenNow: {
      then: ["Shared PC, ₱15 per hour", "Timer on the screen", "Friends on the next stool"],
      now: ["Mobile data in your pocket", "Online all day", "Friends in a group chat"],
    },
    relatedApp: {
      id: "net-cafe",
      pitch: "Run the counter yourself: rent terminals, watch the timers, and print projects.",
    },
  },
  "friendster-era": {
    hook: "Before likes and stories, you were judged by your profile skin and your testimonials.",
    toy: "profile-skin",
    tryIt: {
      title: "Dress up your profile",
      instructions: "Pick a profile skin, then approve the testimonials your barkada left for you.",
    },
    facts: [
      {
        label: "Testimonials needed approval",
        text: "A friend's testimonial appeared on your page only after you approved it, so every profile was curated.",
      },
      {
        label: "Make it yours",
        text: "Users decorated profiles with custom backgrounds, glitter graphics, and songs that played on load.",
      },
      {
        label: "A Pinoy favorite",
        text: "The Philippines became one of Friendster's largest audiences in the mid-2000s.",
      },
    ],
    thenNow: {
      then: ["Testimonials and top friends", "Profile skins and songs", "Who viewed your profile"],
      now: ["Comments and reactions", "Stories and reels", "Algorithmic feeds"],
    },
    relatedApp: {
      id: "friendster",
      pitch: "Build a full profile, browse barkada pages, and collect testimonials.",
    },
  },
  "power-of-text": {
    hook: "One forwarded message, then five, then hundreds: in January 2001, texts helped fill EDSA.",
    toy: "forward-chain",
    tryIt: {
      title: "Pass it on",
      instructions: "Press Forward to send the message to five friends, who each forward it to five more.",
    },
    facts: [
      {
        label: "EDSA II, January 2001",
        text: "Text messages helped people share updates and gather at EDSA during what became People Power II.",
      },
      {
        label: "Forward to all",
        text: "News spread when each person forwarded a message to their whole phonebook, no internet needed.",
      },
      {
        label: "Texting capital",
        text: "The Philippines was often called the “texting capital of the world” during the 2000s.",
      },
    ],
    thenNow: {
      then: ["Forwarded SMS, chain by chain", "Phonebook of contacts", "Verify by calling a friend"],
      now: ["Viral posts and shares", "Group chats of hundreds", "Fact-checks and live streams"],
    },
    relatedApp: {
      id: "nokia-messages",
      pitch: "Open the phone and replay the EDSA II forwarded-message sequence.",
    },
  },
  "reality-tv": {
    hook: "Sino ang ise-save mo? In 2005, your text could keep a housemate inside the Big Brother house.",
    toy: "text-vote",
    tryIt: {
      title: "Text to vote",
      instructions: "Text your vote to save a housemate. The rest of the country votes too, so watch the live standings move.",
    },
    facts: [
      {
        label: "Premiered in 2005",
        text: "Pinoy Big Brother premiered on ABS-CBN in 2005 and became an instant family talking point.",
      },
      {
        label: "Votes by text",
        text: "Viewers texted votes to save or evict housemates, so the audience helped decide who stayed.",
      },
      {
        label: "Ordinary stars",
        text: "Housemates were regular people from around the country, and their everyday stories became national entertainment.",
      },
    ],
    thenNow: {
      then: ["Text to vote", "Watch at night with the family", "Fan clubs on forums"],
      now: ["Vote in apps and online polls", "Clips on social media", "Fan accounts and live chats"],
    },
    relatedApp: {
      id: "reality-tv-vote",
      pitch: "Run a full eviction night: nominee profiles, SMS voting, and live standings.",
    },
  },
  "opm-band-scene": {
    hook: "Burned on a CD-R, labeled in marker, passed hand to hand: the band boom traveled by barkada.",
    toy: "burn-cd",
    tryIt: {
      title: "Burn a barkada CD",
      instructions: "Pick up to five songs, write the label in marker, then press Burn.",
    },
    facts: [
      {
        label: "Band boom",
        text: "Bands like Bamboo, Rivermaya, Parokya ni Edgar, and Hale filled radio countdowns, school fairs, and bars.",
      },
      {
        label: "Hand-made playlists",
        text: "Burned CDs and MP3 players let friends trade their own mixes long before streaming playlists.",
      },
      {
        label: "Gig culture",
        text: "Campus concerts and bar gigs gave fans a place to sing every word back to their favorite bands.",
      },
    ],
    thenNow: {
      then: ["Burned CDs and MP3s", "Radio countdowns", "Gigs at school fairs"],
      now: ["Streaming playlists", "Algorithmic charts", "Livestreamed concerts"],
    },
    relatedApp: {
      id: "opm-media-player",
      pitch: "Play the OPM mix with a retro visualizer, playlists, and liner notes.",
    },
  },
  "karaoke-mall-shows": {
    hook: "Hawak mo na ang mic. The whole party is waiting for one number: your score.",
    toy: "videoke",
    tryIt: {
      title: "Videoke night",
      instructions: "Find a song in the songbook, punch its code into the remote, then press Sing and wait for your score.",
    },
    facts: [
      {
        label: "The famous score",
        text: "Videoke machines rated every performance at the end, and a high score earned instant bragging rights.",
      },
      {
        label: "Pass the mic",
        text: "Birthdays, fiestas, and Christmas parties often turned into an evening of passing the microphone around.",
      },
      {
        label: "Mall stages",
        text: "Malls hosted weekend shows, singing contests, and guest appearances that drew crowds of shoppers.",
      },
    ],
    thenNow: {
      then: ["Songbook with number codes", "Machine score at the end", "Sunday mall shows"],
      now: ["Karaoke apps and lyric videos", "Duets on social media", "Livestreamed performances"],
    },
    relatedApp: {
      id: "tv-tambayan",
      pitch: "Flip the TV to the videoke and mall-show clips.",
    },
  },
  "early-youtube": {
    hook: "No studio, no network: just a webcam, a song, and the Upload button.",
    toy: "upload",
    tryIt: {
      title: "Upload your first video",
      instructions: "Choose what you filmed, give it a title, and upload it over DSL. Then watch the views come in.",
    },
    facts: [
      {
        label: "Launched in 2005",
        text: "YouTube launched in 2005, and it quickly became a stage for anyone with a camera.",
      },
      {
        label: "Bedroom performers",
        text: "Many early uploads were covers, dance clips, and comedy filmed on webcams or digicams at home.",
      },
      {
        label: "Discovered online",
        text: "Some Filipino performers, like Charice, reached international audiences after their videos spread online.",
      },
    ],
    thenNow: {
      then: ["Upload over DSL, wait for ages", "Webcam or digicam video", "View counts and comments"],
      now: ["Upload straight from your phone", "HD vertical video", "Algorithm-driven reach"],
    },
    relatedApp: {
      id: "pinoytube",
      pitch: "Browse the PinoyTube portal: buffering videos, ratings, and comments.",
    },
  },
  "asianovela-craze": {
    hook: "Every night at primetime, the whole house stopped for one dubbed episode. Kilig level: maximum.",
    toy: "dub-scene",
    tryIt: {
      title: "Dub the scene",
      instructions: "Choose a Filipino dubbing style, then play the scene line by line and watch the kilig meter.",
    },
    facts: [
      {
        label: "Meteor Garden, 2003",
        text: "The Taiwanese drama Meteor Garden aired in the Philippines dubbed in Filipino in 2003 and became a nightly event.",
      },
      {
        label: "Then came Korea",
        text: "Korean dramas such as Full House followed in the mid-2000s, opening the door to the Korean wave.",
      },
      {
        label: "Style copied",
        text: "Fans copied the hairstyles, fashion, and theme songs of their favorite drama stars.",
      },
    ],
    thenNow: {
      then: ["Dubbed in Filipino on free TV", "One episode a night", "Copy the F4 hairstyle"],
      now: ["Subtitled streaming", "Binge a whole season", "Fan edits and K-drama merch"],
    },
    relatedApp: {
      id: "tv-tambayan",
      pitch: "Channel-surf the primetime Asianovela slot with localization notes.",
    },
  },
  "anime-tv": {
    hook: "Uwian na! The bell rings at 4:30. Can you make it home before the opening theme ends?",
    toy: "race-home",
    tryIt: {
      title: "Race home for the 5 PM anime",
      instructions: "Make three after-school choices. Every stop costs minutes, and the opening theme waits for no one.",
    },
    facts: [
      {
        label: "Dubbed in Filipino",
        text: "Many anime aired dubbed in Filipino in after-school and weekend time slots on free TV.",
      },
      {
        label: "Schoolyard talk",
        text: "Series like Pokémon, Digimon, and Cardcaptor Sakura became the next day's recess conversation.",
      },
      {
        label: "Local voices",
        text: "Filipino voice actors gave characters familiar expressions, so foreign heroes sounded like neighbors.",
      },
    ],
    thenNow: {
      then: ["Dubbed on free TV after school", "One episode a day", "Trade cards and stickers"],
      now: ["Simulcasts with subtitles", "Whole seasons on demand", "Cosplay and online fandoms"],
    },
    relatedApp: {
      id: "tv-tambayan",
      pitch: "Tune in to the after-school anime block on TV Tambayan.",
    },
  },
  "chat-archives": {
    hook: "BUZZ!!! Your crush just came online. First, you need the perfect screen name.",
    toy: "screen-name",
    tryIt: {
      title: "Make your screen name",
      instructions: "Type your first name, pick a 2000s-style handle, set your status, then BUZZ! a friend.",
    },
    facts: [
      {
        label: "BUZZ!",
        text: "Yahoo! Messenger let you BUZZ! a friend, which shook their chat window to get attention.",
      },
      {
        label: "a/s/l?",
        text: "In mIRC channels, “asl?” (age/sex/location) was the classic way to start talking to a stranger.",
      },
      {
        label: "Across the sea",
        text: "Instant messaging helped many families keep in touch with relatives working abroad.",
      },
    ],
    thenNow: {
      then: ["Buddy list and status messages", "BUZZ! to get attention", "asl? in chat rooms"],
      now: ["Group chats and stories", "Read receipts and reactions", "Profiles with real names"],
    },
    relatedApp: {
      id: "chat-archives",
      pitch: "Read full Yahoo! Messenger and mIRC conversations, buzzes included.",
    },
  },
  "foreign-to-ppop": {
    hook: "A little K-pop, some R&B, a lot of Taglish: Filipino pop learned from the world, then made it its own.",
    toy: "mix-sound",
    tryIt: {
      title: "Mix your sound",
      instructions: "Pick the influences arriving from abroad, add a Filipino twist, then stamp the passport.",
    },
    facts: [
      {
        label: "Borrow and remix",
        text: "Filipino artists blended global pop, R&B, and dance styles with Filipino and Taglish lyrics.",
      },
      {
        label: "Dance groups everywhere",
        text: "TV dance groups, school competitions, and mall shows turned choreography into a national pastime.",
      },
      {
        label: "Export mode",
        text: "Later, P-pop groups such as SB19 carried Filipino pop to audiences around the world.",
      },
    ],
    thenNow: {
      then: ["Influences arrive via TV and radio", "Covers and dance crews", "Fame at home"],
      now: ["Original P-pop groups", "Fandoms online worldwide", "Global tours and streams"],
    },
    relatedApp: {
      id: "ppop-passport",
      pitch: "Collect passport stamps along the routes from global influence to P-pop.",
    },
  },
};

export function getExhibitStory(exhibitId: string): ExhibitStory | undefined {
  return exhibitStories[exhibitId];
}
