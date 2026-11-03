import type {
  InfluenceNode,
  PassportStamp,
  PpopPassportState,
  PpopRoute,
} from "./types";

export const PASSPORT_STAMPS: PassportStamp[] = [
  {
    id: "stamp-street-dance",
    eraId: "era-streetdance",
    title: "Street Dance & B-Boy Crews",
    yearRange: "1990s–2000s Era",
    genre: "Pinoy Hip-hop & Synchronized Street Dance",
    icon: "🕺",
    accentColor: "#f59e0b",
    originCity: "Manila TV Studios & Dance Communities (Curatorial Context)",
    historicalFact:
      "During the 1990s and early 2000s, popular dance groups such as the Universal Motion Dancers (UMD) and Streetboys achieved national followings on Philippine television with athletic choreography and synchronized stage routines. In curatorial interpretation, this popular dance era established an important domestic precedent for the high athletic and synchronization expectations seen in contemporary Filipino pop groups.",
    culturalImpact:
      "Curatorial Interpretation: Elevated synchronized youth dance from informal campus gatherings into prime-time television spectacles, creating an enduring performance lineage.",
    sampleSongArchetype: {
      title: "Galaw sa Kalsada (Street Moves)",
      style: "High-tempo 90s breakbeat & novelty dance hip-hop",
      description: "Fast-paced synth bassline with catchy chant choruses and synchronized pop-and-lock routines.",
    },
    isCollected: true,
    collectedDate: "Museum Entry Pass",
  },
  {
    id: "stamp-chinovela-ost",
    eraId: "era-asianovela",
    title: "Asianovela Mandopop Wave",
    yearRange: "2003–2005 (Broadcast Era)",
    genre: "Ballad Pop & Asian Idol Soundtracks",
    icon: "📺",
    accentColor: "#e11d48",
    originCity: "Taipei ⇄ Manila Broadcast Dialogue (Curatorial Context)",
    historicalFact:
      "The 2003 Philippine broadcast of the Taiwanese series 'Meteor Garden' ignited widespread audience passion for Asianovelas and Mandopop boyband soundtracks. Scholarly reception analysis (Sales, 2015) documents how Tagalog-dubbed broadcasts and localized acoustic covers opened prime-time media to East Asian melodic pop structures.",
    culturalImpact:
      "Curatorial Interpretation: Illustrated how Filipino audiences enthusiastically embraced pan-Asian popular culture, setting precedent for subsequent regional music crossovers.",
    sampleSongArchetype: {
      title: "Ulan ng Pag-asa (Rain of Hope)",
      style: "Dramatic Mandarin-pop inspired ballad with lush acoustic guitars",
      description: "Sweeping strings, melodic piano intro, and heartfelt Tagalog vocal delivery.",
    },
    isCollected: false,
  },
  {
    id: "stamp-birit-ballad",
    eraId: "era-birit",
    title: "Birit Powerhouse Vocals",
    yearRange: "2000s Talent Broadcasts",
    genre: "Belting Melodrama & Kundiman Soul",
    icon: "🎙️",
    accentColor: "#8b5cf6",
    originCity: "Grassroots Contests & Television Showcases (Curatorial Context)",
    historicalFact:
      "Dramatic high-register vocal belting (popularly termed 'birit') is an established benchmark in Philippine television variety shows and barangay singing contests. Music historians trace this vocal preference to expressive Kundiman passion and theatrical melodrama, creating an enduring expectation that Filipino pop artists demonstrate commanding live vocal stamina.",
    culturalImpact:
      "Curatorial Interpretation: Celebrates technical vocal stamina and emotional sincerity as foundational values across Philippine popular music genres.",
    sampleSongArchetype: {
      title: "Sigaw ng Damdamin (Cry of the Heart)",
      style: "Grand orchestral pop power ballad with modulated climax",
      description: "Dramatic dynamic range soaring to sustained high belts in the final key-change chorus.",
    },
    isCollected: false,
  },
  {
    id: "stamp-early-hallyu",
    eraId: "era-asianovela",
    title: "Early Korean Wave Melodrama",
    yearRange: "Mid-2000s Broadcast Era",
    genre: "K-Drama Soundtracks & East Asian Ballads",
    icon: "🌸",
    accentColor: "#ec4899",
    originCity: "Seoul ⇄ Manila Television Broadcasts (Curatorial Context)",
    historicalFact:
      "During the mid-to-late 2000s, Korean television dramas gained strong audience followings on Philippine networks, often accompanied by official Tagalog theme song covers by local recording artists. This period built early cultural affinity and active fan communities around East Asian romantic soundtrack aesthetics.",
    culturalImpact:
      "Curatorial Interpretation: Cultivated early fandom networks and cross-cultural media literacy that preceded wider global K-pop and P-pop exchanges.",
    sampleSongArchetype: {
      title: "Pangako sa Taglagas (Autumn Promise)",
      style: "Tender East Asian OST piano ballad with Tagalog lyrics",
      description: "Minor-key piano arpeggios building into an emotive cello and vocal crescendo.",
    },
    isCollected: false,
  },
  {
    id: "stamp-pinoy-idols",
    eraId: "era-earlyidol",
    title: "Pioneering Localized Idol Groups",
    yearRange: "2008–2012 Era",
    genre: "Multi-Member Idol Pop & Electropop",
    icon: "🌟",
    accentColor: "#06b6d4",
    originCity: "Manila Commercial Recording Studios (Curatorial Context)",
    historicalFact:
      "Between 2008 and 2012, Philippine recording labels debuted groups such as XLR8 and Pop Girls, exploring multi-member formations, synchronized choreography, and electropop production. In curatorial analysis, these early efforts represent important industry experiments in testing how international idol group formats could adapt to local audience tastes.",
    culturalImpact:
      "Curatorial Interpretation: Served as a formative bridge between variety show dance crews and modern multi-member pop groups.",
    sampleSongArchetype: {
      title: "Sabay sa Beat (Together in Rhythm)",
      style: "Late-2000s electropop with synchronized rap and vocal harmonies",
      description: "Autotuned synth leads, four-on-the-floor electro drums, and alternating boyband vocal lines.",
    },
    isCollected: false,
  },
  {
    id: "stamp-modern-ppop",
    eraId: "era-modernppop",
    title: "Modern P-pop Renaissance",
    yearRange: "2018–Present",
    genre: "World-Class Contemporary P-pop",
    icon: "🇵🇭",
    accentColor: "#2563eb",
    originCity: "Contemporary Philippine Pop Movement (Curatorial Context)",
    historicalFact:
      "The contemporary P-pop renaissance (2018–present) combines rigorous performance training with an intentional celebration of Filipino identity—incorporating indigenous musical motifs (such as kulintang), traditional folk dance analogies, and Tagalog lyricism exploring mental health and social resilience.",
    culturalImpact:
      "Curatorial Interpretation: Demonstrates a confident synthesis of global production standards with authentic Philippine heritage, transforming localization into international cultural export.",
    sampleSongArchetype: {
      title: "Giting at Dangal (Honor and Valor)",
      style: "Hybrid P-pop anthem blending tribal percussion, urban beats, and multi-part vocal harmonies",
      description: "Energetic brass hits, rapid synchronized choreography cues, and soaring vocal high notes.",
    },
    isCollected: false,
  },
];

export const PPOP_ROUTES: PpopRoute[] = [
  {
    id: "route-rhythm",
    title: "The Dance & Choreography Trail",
    description:
      "Trace the lineage of movement from 90s street dance crews to pioneering multi-member formations and contemporary synchronized P-pop stages.",
    stampIds: ["stamp-street-dance", "stamp-pinoy-idols", "stamp-modern-ppop"],
    isCompleted: false,
  },
  {
    id: "route-broadcast",
    title: "The Asian Broadcast Wave",
    description:
      "Follow the impact of imported Asianovela soundtracks and early Korean melodrama themes on Philippine songwriting and pop arrangement.",
    stampIds: ["stamp-chinovela-ost", "stamp-early-hallyu", "stamp-modern-ppop"],
    isCompleted: false,
  },
  {
    id: "route-vocal",
    title: "The Powerhouse Voice Journey",
    description:
      "Explore how grassroots vocal competitions and Kundiman belting traditions infused Filipino idol groups with unmatched live vocal stamina.",
    stampIds: ["stamp-birit-ballad", "stamp-pinoy-idols", "stamp-modern-ppop"],
    isCompleted: false,
  },
];

export const INFLUENCE_NODES: InfluenceNode[] = [
  {
    id: "node-manila",
    name: "Metro Manila & Provinces",
    region: "Philippines (Hub)",
    contribution: "Curatorial Analysis: Rich traditions of Kundiman vocal emotion, street dance agility, barangay contest culture, and vernacular Taglish expression.",
    connectionType: "vocal",
  },
  {
    id: "node-taipei",
    name: "Taipei",
    region: "Taiwan",
    contribution: "Curatorial Analysis: 2003 Meteor Garden phenomenon and Mandopop soundtrack arrangements adapted into Tagalized radio hits (Sales, 2015).",
    connectionType: "melodrama",
  },
  {
    id: "node-seoul",
    name: "Seoul",
    region: "South Korea",
    contribution: "Curatorial Analysis: Formative idol training systems, visual synchronization, and Koreanovela drama scoring adapted to local tastes.",
    connectionType: "production",
  },
  {
    id: "node-tokyo",
    name: "Tokyo",
    region: "Japan",
    contribution: "Curatorial Analysis: Afternoon anime programming blocks, J-pop group concepts, and dedicated youth fan subcultures.",
    connectionType: "dance",
  },
  {
    id: "node-losangeles",
    name: "Los Angeles",
    region: "United States",
    contribution: "Curatorial Analysis: Hip-hop breakdancing, B-boy battles, and R&B vocal harmony arrangements popularized on local television.",
    connectionType: "dance",
  },
];

export const PPOP_CULTURAL_INSIGHTS = [
  {
    id: "insight-hybrid",
    title: "Cultural Hybridity in Filipino Performance",
    subtitle: "Curatorial Interpretation of Adaptation and Vernacular Style",
    content:
      "Philippine cultural scholars have long observed that Filipino musical artists engage in active localization—reinterpreting imported genres through vernacular melodies, vocal styles, and lyrical concerns. P-pop is interpreted by curators as an evolving hybrid form where international pop structures are infused with local sentiment and cultural references.",
  },
  {
    id: "insight-birit-roots",
    title: "The Vocal Stamina of 'Birit' in Pop Groups",
    subtitle: "From Singing Contests to Synchronized Live Sets",
    content:
      "Unlike studio-centric pop traditions that de-emphasize raw live vocals, Philippine music culture has consistently celebrated vocal passion and stamina. The grounding of Filipino vocalists in local church choirs and amateur singing contests prepares contemporary P-pop performers to deliver demanding high notes while executing intense synchronized choreography.",
  },
  {
    id: "insight-bayanihan-dance",
    title: "Bayanihan Movement and Collective Rhythm",
    subtitle: "Folkloric Ensemble Precision as a Curatorial Analogy",
    content:
      "Choreographers and cultural critics frequently draw comparisons between modern group synchronization and historic Philippine ensemble traditions, such as the communal spirit of Bayanihan dance troupes and the complex footwork of dances like Singkil. In museum interpretation, these parallels are understood as creative analogies highlighting how contemporary performers celebrate collective discipline and shared heritage.",
  },
  {
    id: "insight-transnational",
    title: "The Transnational Cycle: From Importer to Cultural Exporter",
    subtitle: "How the Philippines Participates in Global Pop Exchanges",
    content:
      "Between 2000 and 2010, the Philippines engaged deeply with imported Asian entertainment. Over subsequent decades, Filipino artists and producers internalized global production techniques to create homegrown pop art forms that are increasingly recognized on global stages.",
  },
];

export const INITIAL_PPOP_PASSPORT_STATE: PpopPassportState = {
  activeTab: "passport",
  travelerName: "Museum Visitor",
  travelerNationality: "Republic of the Philippines",
  selectedEraId: "era-streetdance",
  stamps: PASSPORT_STAMPS,
  selectedStampId: "stamp-street-dance",
  routes: PPOP_ROUTES,
  activeRouteId: "route-rhythm",
};
