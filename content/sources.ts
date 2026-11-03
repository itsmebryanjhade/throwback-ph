export type SourceCredit = {
  id: string;
  title: string;
  creator: string;
  url: string;
  usageBasis: string;
  accessed: string;
};

export const sourceCredits: readonly SourceCredit[] = [
  {
    id: "ncca-popular-music",
    title: "Popular Music in the Philippines",
    creator: "Dr. Antonio C. Hila (National Commission for Culture and the Arts)",
    url: "https://ncca.gov.ph/about-ncca-3/subcommissions/subcommission-on-the-arts-sca/music/popular-music-in-the-philippines/",
    usageBasis: "Historical research reference on the development of Pinoy pop, vocal traditions, and musical hybridization; linked and paraphrased.",
    accessed: "2026-10-15",
  },
  {
    id: "ncca-pinoy-rock",
    title: "Confessions of a Rock Journalist",
    creator: "National Commission for Culture and the Arts",
    url: "https://ncca.gov.ph/about-culture-and-arts/in-focus/confessions-of-a-rock-journalist-or-some-disjointed-ramblings-on-pinoy-rock-n-roll/",
    usageBasis: "Research reference; linked and paraphrased.",
    accessed: "2026-10-14",
  },
  {
    id: "pbb-history",
    title: "Pinoy Big Brother Big Winners (2005 to 2014)",
    creator: "ABS-CBN Entertainment",
    url: "https://www.abs-cbn.com/2015/11/2/fresh-scoops/throwback-pinoy-big-brother-big-winners-2005-to-20-121224",
    usageBasis: "Research reference; linked and paraphrased.",
    accessed: "2026-10-14",
  },
  {
    id: "itu-philippines",
    title: "Digital development dashboard: Philippines",
    creator: "International Telecommunication Union",
    url: "https://www.itu.int/en/ITU-D/Statistics/Dashboards/Pages/Digital-Development.aspx",
    usageBasis: "Research reference for telecommunications context; linked and paraphrased.",
    accessed: "2026-10-14",
  },
  {
    id: "friendster-archive",
    title: "Friendster: social networking pioneer",
    creator: "Internet Archive",
    url: "https://web.archive.org/web/20080101000000*/friendster.com",
    usageBasis: "Historical web reference; no archived imagery reproduced.",
    accessed: "2026-10-14",
  },
  {
    id: "youtube-history",
    title: "YouTube at 15: My personal journey and the road ahead",
    creator: "YouTube Official Blog",
    url: "https://blog.youtube/inside-youtube/youtube-at-15-my-personal-journey/",
    usageBasis: "Platform history reference; linked and paraphrased.",
    accessed: "2026-10-14",
  },
  {
    id: "korean-wave",
    title: "Lalaki Dao, Babae Sha: Meteor Garden and Its Gender(ed) Representations in Retrospect",
    creator: "Marlon James S. Sales (Plaridel: A Philippine Journal of Communication, Media, and Society)",
    url: "https://www.plarideljournal.org/article/lalaki-dao-babae-sha-meteor-garden-and-its-gendered-representations-in-retrospect/",
    usageBasis: "Scholarly research reference analyzing Meteor Garden's Philippine reception and Filipino translation/localization; linked and paraphrased.",
    accessed: "2026-10-15",
  },
  {
    id: "japan-foundation-anime",
    title: "Arts and Cultural Exchange: Japanese Media Arts and Popular Culture",
    creator: "The Japan Foundation, Manila",
    url: "https://jfmo.org.ph/arts-and-culture/",
    usageBasis: "Institutional cultural exchange reference for Japanese media arts, film, and popular culture programs in the Philippines; linked and cited.",
    accessed: "2026-10-15",
  },
  {
    id: "yahoo-messenger",
    title: "Yahoo! Messenger Help and Feature Archive (2005–2007)",
    creator: "Internet Archive / Yahoo! Inc.",
    url: "https://web.archive.org/web/20070115000000*/http://help.yahoo.com/help/us/mesg/",
    usageBasis: "Historical reference documenting Yahoo! Messenger features including BUZZ!, emoticons, and status states; interface is an original educational simulation.",
    accessed: "2026-10-15",
  },
  {
    id: "mirc-history",
    title: "mIRC: An Introduction and History",
    creator: "Khaled Mardam-Bey (mIRC Co. Ltd.)",
    url: "https://www.mirc.com/about.html",
    usageBasis: "Official software history documenting IRC channel conventions, commands, and operator roles; linked and paraphrased.",
    accessed: "2026-10-15",
  },
  {
    id: "edsa-text",
    title: "People Power II and the role of mobile communication",
    creator: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/place/Philippines/The-downfall-of-Estrada-and-arroyo-of-Macapagal-Arroyo",
    usageBasis: "Historical research reference; linked and paraphrased.",
    accessed: "2026-10-14",
  },
  {
    id: "cidob-text-revolution",
    title: "The Text-messaging Revolutions",
    creator: "CIDOB (Barcelona Centre for International Affairs)",
    url: "https://www.cidob.org/publicaciones/text-messaging-revolutions",
    usageBasis: "Historical research reference for early mobile civic communication and forwarded SMS phrases; linked and paraphrased.",
    accessed: "2026-10-14",
  },
  {
    id: "p-pop",
    title: "Filipino Popular Music (Cultural Center of the Philippines Encyclopedia of Philippine Art)",
    creator: "Cultural Center of the Philippines",
    url: "https://epa.culturalcenter.gov.ph/",
    usageBasis: "Curatorial research reference for popular music genres, vocal traditions, and dance groups; linked and contextualized.",
    accessed: "2026-10-15",
  },
] as const;
