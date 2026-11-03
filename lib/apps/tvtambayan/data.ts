import type { LocalizationMode, TvChannel, TvTambayanState } from "./types";

export const LOCALIZATION_MODE_LABELS: Record<
  LocalizationMode,
  { label: string; desc: string }
> = {
  "tagalog-dub": {
    label: "Tagalized Dub (Filipino Voice Acting)",
    desc: "Authentic localization where Filipino voice actors adapted emotional cadences, humor, and colloquial slang for local primetime audiences.",
  },
  "taglish-sub": {
    label: "Taglish Subtitles",
    desc: "Colloquial subtitles blending conversational Tagalog and English, typical of mid-2000s youth chat and urban television framing.",
  },
  "orig-sub": {
    label: "Original Asian Audio + English Subtitles",
    desc: "Preserves the original Taiwanese/Japanese/Korean broadcast soundtrack with standard English subtitle translations.",
  },
};

export const INITIAL_CHANNELS: TvChannel[] = [
  {
    id: "ch-02",
    channelNumber: "02",
    name: "Asianovela Prime",
    tagline: "Ang Tahanan ng mga Paboritong Asianovela",
    genre: "Taiwanese & Korean Romance Drama",
    currentProgramId: "prog-meteor-heart",
    themeColor: "#e11d48",
    stationBug: "[TV 02]",
    mediaAssetId: "tv-meteor-garden",
    programs: [
      {
        id: "prog-meteor-heart",
        channelId: "ch-02",
        title: "Meteor Garden Feature",
        originalTitle: "User-supplied Meteor Garden feature clip",
        genre: "Primetime Idol Asianovela",
        timeSlot: "primetime-drama",
        broadcastTime: "5:30 PM – 6:15 PM",
        synopsis:
          "A user-supplied feature clip presented as period context for the Asianovela boom in Philippine television.",
        culturalNote:
          "Modeled after the widespread 2003 Philippine popularity ignited by Meteor Garden, where late-afternoon viewers tuned in to follow Taiwanese idol narratives dubbed in dramatic conversational Filipino.",
        voiceCast: "Tagalog Dub Cast: Voice Director Tito Jun & Heroine Voice Ate Clarisse",
        isFavorite: true,
        sampleDialogue: {
          tagalogDub:
            "Shana: 'Akala mo ba matatakot ako sa inyo?! Kahit mayayaman pa kayo, hindi ko isusuko ang pangarap ko!'",
          taglishSub:
            "Shana: 'Do you really think I'm scared of you guys? Kahit gaano pa kayo kayaman, I will never give up on my dreams!'",
          origSub:
            "[Original Mandarin] Shana: 'Do you think you can intimidate me? No matter how wealthy your family is, I will never back down!'",
        },
      },
      {
        id: "prog-palasyo-puso",
        channelId: "ch-02",
        title: "Palasyo ng Puso (The Royal Kitchen)",
        originalTitle: "Dae Goong Bi (Korean Period Drama)",
        genre: "Historical Period Asianovela",
        timeSlot: "primetime-drama",
        broadcastTime: "6:15 PM – 7:00 PM",
        synopsis:
          "An orphaned palace kitchen apprentice rises through culinary mastery and herbal medicine, navigating court intrigues to become the first female royal physician.",
        culturalNote:
          "Reflects the early Koreanovela historical wave (like Jewel in the Palace) that captivated Philippine multigenerational households with themes of familial piety and culinary resilience.",
        voiceCast: "Tagalog Dub Cast: Veteran Voice Actress Tita Marilou",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub:
            "Jang-Mi: 'Mahal na Hari, ang tunay na lunas sa karamdaman ay hindi lamang gamot, kundi ang pag-aaruga sa puso ng bawat mamamayan.'",
          taglishSub:
            "Jang-Mi: 'Your Majesty, the real cure isn't just about medicine, kundi the care we offer to everyone's heart.'",
          origSub:
            "[Original Korean] Jang-Mi: 'Your Highness, true medicine does not reside merely in herbs, but in caring for the spirit of our people.'",
        },
      },
      {
        id: "prog-morning-news-02",
        channelId: "ch-02",
        title: "Gising Pilipinas Umaga Balita",
        genre: "Morning News & Weather",
        timeSlot: "morning",
        broadcastTime: "6:00 AM – 7:30 AM",
        synopsis:
          "Daily weather bulletin across Luzon, Visayas, and Mindanao, traffic reports on EDSA and C-5, and provincial news roundups.",
        culturalNote:
          "Morning broadcasts accompanied Filipino families as students prepared their uniforms and commuters caught early jeepneys.",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub: "Anchor: 'Magandang umaga, Pilipinas! Maaliwalas ang panahon sa kalakhang Maynila ngayong Martes.'",
          taglishSub: "Anchor: 'Good morning, Philippines! Weather looks sunny across Metro Manila today!'",
          origSub: "Anchor: 'Good morning, Philippines! Fair weather is forecasted for Metro Manila today.'",
        },
      },
      {
        id: "prog-midnight-cinema-02",
        channelId: "ch-02",
        title: "Midnight Mystery Theater",
        genre: "Late-Night Suspense",
        timeSlot: "late-night",
        broadcastTime: "11:30 PM – 1:00 AM",
        synopsis: "Classic suspense thriller and ghost stories told under late-night candlelit studio sets.",
        culturalNote: "Late-night television catered to night-shift BPO employees and insomnia-prone youth.",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub: "Host: 'Huwag lilingon sa dilim... Baka may nakamasid na hindi mo nakikita.'",
          taglishSub: "Host: 'Don't turn around in the dark... Someone might be watching you without you knowing.'",
          origSub: "Host: 'Do not look back into the shadows... for you may not be alone.'",
        },
      },
    ],
  },
  {
    id: "ch-07",
    channelNumber: "07",
    name: "Hapon Anime Block",
    tagline: "Ang Sandigan ng mga Batang 90s at 2000s",
    genre: "Afternoon Tagalized Anime",
    currentProgramId: "prog-voltech-guardians",
    themeColor: "#2563eb",
    stationBug: "[CH 07]",
    mediaAssetId: "tv-tagalized-anime",
    programs: [
      {
        id: "prog-voltech-guardians",
        channelId: "ch-07",
        title: "Tagalized Anime Feature",
        originalTitle: "User-supplied anime feature clip",
        genre: "Afternoon Mecha & Super Robot",
        timeSlot: "afternoon-anime",
        broadcastTime: "4:30 PM – 5:00 PM",
        synopsis:
          "Three high school students discover ancient robotic beasts hidden underneath the Sierra Madre mountains, uniting to defend Earth from galactic cyber-invaders.",
        culturalNote:
          "Evokes the familiar 4:30 PM routine where school-age Filipino youth watched afternoon Japanese animation blocks over merienda on free television.",
        voiceCast: "Voice of Leader Ken: Dubber Raymond / Sound FX: Studio 7 Manila",
        isFavorite: true,
        sampleDialogue: {
          tagalogDub:
            "Ken: 'Voltech Saber, mag-apoy ka! Para sa kalayaan ng sanlibutan, tapusin ang laban na ito!'",
          taglishSub:
            "Ken: 'Voltech Saber, ignite now! Para sa freedom of mankind, let's finish this fight!'",
          origSub:
            "[Original Japanese] Ken: 'Blazing Voltech Saber! For the freedom of our world, strike down the evil invaders!'",
        },
      },
      {
        id: "prog-flame-shifter",
        channelId: "ch-07",
        title: "Flame Shifter Reiko",
        originalTitle: "Honō no Kunoichi Reiko (Shonen Action)",
        genre: "Martial Arts & Ninja Action",
        timeSlot: "afternoon-anime",
        broadcastTime: "5:00 PM – 5:30 PM",
        synopsis:
          "A rebellious ninja apprentice masters the legendary Crimson Phoenix flame technique to protect her mountain village from rogue spirit warlords.",
        culturalNote:
          "Illustrates the Philippine television phenomenon of 'Tagalized' shonen anime (like Ghost Fighter, Flame of Recca, Slam Dunk) where streetwise Tagalog expressions were woven directly into martial arts showdowns.",
        voiceCast: "Voice of Reiko: Veteran Voice Actress Ate Jenny",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub:
            "Reiko: 'Wala kang binatbat sa lagablab ng Phoenix! Matuto kang gumalang sa mga taga-nayon!'",
          taglishSub:
            "Reiko: 'You're no match for the Phoenix flames! Learn how to respect our village!'",
          origSub:
            "[Original Japanese] Reiko: 'You cannot withstand the heat of the Vermilion Phoenix! Show some respect for our people!'",
        },
      },
      {
        id: "prog-morning-cartoons-07",
        channelId: "ch-07",
        title: "Batang Cyber Toons",
        genre: "Saturday Morning Animation",
        timeSlot: "morning",
        broadcastTime: "7:30 AM – 9:00 AM",
        synopsis: "Educational animated shorts and adventures for young elementary children.",
        culturalNote: "Weekend mornings meant waking up early to watch educational cartoons in cereal bowls.",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub: "Sparky: 'Tara na mga kaibigan! Tuklasin natin ang hiwaga ng agham at kalikasan!'",
          taglishSub: "Sparky: 'Let's go friends! Let's discover the wonders of science and nature together!'",
          origSub: "Sparky: 'Come along friends! Let us discover the mysteries of science and nature!'",
        },
      },
    ],
  },
  {
    id: "ch-23",
    channelNumber: "23",
    name: "Karaoke Tambayan",
    tagline: "Biritan at Kantahan ng Buong Bayan",
    genre: "Sing-Along Music & Pop Ballads",
    currentProgramId: "prog-biritan-hapon",
    themeColor: "#16a34a",
    stationBug: "[KTV 23]",
    mediaAssetId: "tv-videoke",
    programs: [
      {
        id: "prog-biritan-hapon",
        channelId: "ch-23",
        title: "Videoke Performance",
        genre: "Interactive TV Karaoke",
        timeSlot: "afternoon-anime",
        broadcastTime: "3:00 PM – 4:30 PM",
        synopsis:
          "Sing along with the legendary bouncing ball! Classic Filipino rock ballads, romantic acoustic duets, and heartfelt love anthems with real-time scoring cues.",
        culturalNote:
          "Celebrates the quintessential Filipino karaoke tradition: living-room singing setups, VCD micro-systems, and communal neighborhood sing-alongs on rainy afternoons.",
        voiceCast: "Host & Announcer: Kuya Boy Birit",
        isFavorite: true,
        sampleDialogue: {
          tagalogDub:
            "Lyrics: '♪ Dahil sa 'yo... ako'y nagbago... Pag-ibig mo ang siyang sandigan ko... ♪ (Score: 98!)'",
          taglishSub:
            "Lyrics: '♪ Because of you... my world transformed... Your love is my true foundation... ♪ (Score: 98!)'",
          origSub:
            "Lyrics: '♪ It was through you... my heart was redeemed... Your love has become my sanctuary... ♪ (Score: 98!)'",
        },
      },
      {
        id: "prog-acoustic-unplugged",
        channelId: "ch-23",
        title: "Acoustic Unplugged Tambay",
        genre: "Acoustic Band Sessions",
        timeSlot: "primetime-drama",
        broadcastTime: "8:00 PM – 9:30 PM",
        synopsis:
          "Stripped-down live acoustic performances by emerging college bands, performing under intimate coffeehouse lighting.",
        culturalNote: "Acoustic coffee-shop culture boomed in the mid-2000s, influencing youth courtship and weekend barkada hangouts.",
        voiceCast: "VJ Bianca & Kuya Dennis",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub: "VJ Bianca: 'Handa na ba kayong maiyak sa acoustic rendition na ito? Heto na ang Bandang Alon!'",
          taglishSub: "VJ Bianca: 'Are you guys ready for some heartfelt vibes? Here is Bandang Alon!'",
          origSub: "VJ Bianca: 'Are you ready to be moved? Introducing Bandang Alon with an acoustic ballad!'",
        },
      },
    ],
  },
  {
    id: "ch-41",
    channelNumber: "41",
    name: "Weekend Mall Tour",
    tagline: "Saya at Tawanan sa Bawat Atrium",
    genre: "Live Variety & Mall Shows",
    currentProgramId: "prog-sunday-mall-tour",
    themeColor: "#9333ea",
    stationBug: "[WMT 41]",
    mediaAssetId: "tv-mall-variety",
    programs: [
      {
        id: "prog-sunday-mall-tour",
        channelId: "ch-41",
        title: "Mall Variety Show",
        genre: "Live Mall Variety & Roadshow",
        timeSlot: "primetime-drama",
        broadcastTime: "12:00 PM – 2:30 PM",
        synopsis:
          "Live broadcast from the crowded atrium of an SM/Robinsons mega mall. Features dance crew showdowns, celebrity guest appearances, raffle draws, and comedy games.",
        culturalNote:
          "Weekend mall shows were central to 2000s Philippine popular culture. Air-conditioned mega-malls served as communal town plazas where fans gathered along three floors of balconies to cheer their favorite stars.",
        voiceCast: "Hosts: Kuya Joey & Ate Sarah / DJ Mon",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub:
            "Host Joey: 'Isang masiglang hapon sa libu-libong nanonood dito sa Mega Atrium! Sino ang pambato niyo sa Grand Dance Showdown?!'",
          taglishSub:
            "Host Joey: 'A super energetic afternoon to the thousands here at the Mega Atrium! Who's your bet for the Grand Dance Showdown?!'",
          origSub:
            "Host Joey: 'A very warm afternoon to the packed crowd here in the Mega Atrium! Cheer loudly for your champion dance troupe!'",
        },
      },
      {
        id: "prog-barangay-idol",
        channelId: "ch-41",
        title: "Barangay Singing Idol Search",
        genre: "Grassroots Talent Competition",
        timeSlot: "afternoon-anime",
        broadcastTime: "2:30 PM – 4:00 PM",
        synopsis:
          "Talent scouts visit covered courts across Metro Manila and surrounding provinces to find vocal champions among local students, sari-sari store keepers, and market vendors.",
        culturalNote:
          "Grassroots barangay talent competitions were the authentic bedrock from which Philippine television unearthed powerhouse vocalists.",
        voiceCast: "Host: Ate Gemma / Resident Judge: Maestro Raul",
        isFavorite: false,
        sampleDialogue: {
          tagalogDub: "Maestro: 'Napakalinis ng vibrato mo, neng! May kinabukasan ka sa pagkanta!'",
          taglishSub: "Maestro: 'Your vibrato is super clean! You have a bright future ahead in singing!'",
          origSub: "Maestro: 'Your vocal control and vibrato were exceptional! You have immense potential!'",
        },
      },
    ],
  },
];

export const CULTURAL_INSIGHTS = [
  {
    id: "insight-meteor",
    title: "The Meteor Garden Phenomenon (2003)",
    subtitle: "The F4 Craze that Redefined Philippine Primetime",
    content:
      "In 2003, Taiwanese drama Meteor Garden premiered on Philippine television, sparking the widespread popularity of imported Asian television dramas often referred to locally as 'Asianovelas'. Broadcast in the late afternoon preceding primetime news, the series drew devoted audiences across urban centers. Local voice actors delivered a distinctively emotional, Tagalized script that helped make Dao Ming Si and Shan Cai familiar cultural figures across the country.",
  },
  {
    id: "insight-anime",
    title: "The 4:30 PM After-School Anime Ritual",
    subtitle: "How Tagalized Japanese Animation Unified Filipino Youth",
    content:
      "Throughout the late 1990s and 2000s, Philippine broadcast networks scheduled afternoon anime blocks that became a familiar post-school routine for many young viewers. Japanese series such as Ghost Fighter (Yu Yu Hakusho), Flame of Recca, and Slam Dunk were dubbed into conversational Tagalog by local voice actors. Tagalized dialogue introduced catchy vernacular phrases that circulated widely among school-age fans, establishing anime as an accessible staple on free-to-air television.",
  },
  {
    id: "insight-mall",
    title: "The Air-Conditioned Town Plaza: Weekend Mall Shows",
    subtitle: "Commercial Spaces as Living Cultural Centers",
    content:
      "The rapid expansion of mega-shopping complexes across Philippine cities in the 2000s turned mall atriums into modern town plazas. Television networks broadcast Sunday roadshows directly from mall activity centers, where families congregated across multi-tiered balconies. These free public appearances connected popular television programs to working-class patrons, making live entertainment a shared weekend event.",
  },
  {
    id: "insight-dubbing",
    title: "Tagalization: The Art of Filipino Dubbing",
    subtitle: "Linguistic Democratization of Global Storytelling",
    content:
      "Filipino localization studios adapted dialogue for local audiences through culturally attuned translation. Voice directors adjusted humor, colloquial expressions, and emotional pacing to match Philippine conversational styles. This approach made foreign narratives—from Taiwanese romances to Japanese animated adventures—accessible to broad audiences across language preferences without requiring English fluency or subtitle reading.",
  },
];

export const INITIAL_TV_TAMBAYAN_STATE: TvTambayanState = {
  activeTab: "tv",
  currentChannelId: "ch-02",
  isPoweredOn: true,
  volume: 75,
  isMuted: false,
  localizationMode: "tagalog-dub",
  channels: INITIAL_CHANNELS,
  selectedProgramId: "prog-meteor-heart",
  showOsd: true,
};
