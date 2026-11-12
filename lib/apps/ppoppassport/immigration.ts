/**
 * One immigration-desk question per passport stamp. Every answer comes from
 * that stamp's own curatorial notes in ./data.ts, so visitors can always find it.
 */
export type ImmigrationQuestion = {
  question: string;
  options: readonly string[];
  answer: string;
  hint: string;
};

export const IMMIGRATION_QUESTIONS: Record<string, ImmigrationQuestion> = {
  "stamp-street-dance": {
    question: "Which TV dance groups made synchronized routines famous in the 1990s and early 2000s?",
    options: ["Universal Motion Dancers & Streetboys", "Eraserheads & Rivermaya", "F4 & the Meteor Garden cast"],
    answer: "Universal Motion Dancers & Streetboys",
    hint: "Think of dance crews on Philippine variety TV, not bands or actors.",
  },
  "stamp-chinovela-ost": {
    question: "Which 2003 Taiwanese drama sparked the Asianovela and Mandopop craze in the Philippines?",
    options: ["Meteor Garden", "Full House", "Princess Hours"],
    answer: "Meteor Garden",
    hint: "It was the Taiwanese series with the F4 boyband.",
  },
  "stamp-birit-ballad": {
    question: "What do Filipinos call dramatic, high-note vocal belting?",
    options: ["Birit", "Budots", "Harana"],
    answer: "Birit",
    hint: "It's the word for a singing-contest showstopper note.",
  },
  "stamp-early-hallyu": {
    question: "How did local artists connect with Korean dramas airing on Philippine TV?",
    options: [
      "They recorded Tagalog covers of the theme songs",
      "They hosted the dramas on radio only",
      "They banned foreign soundtracks",
    ],
    answer: "They recorded Tagalog covers of the theme songs",
    hint: "Listen to the theme song: it was sung in Tagalog.",
  },
  "stamp-pinoy-idols": {
    question: "Which group was one of the early local idol groups of 2008–2012?",
    options: ["XLR8", "SB19", "Streetboys"],
    answer: "XLR8",
    hint: "SB19 came later, and Streetboys were a 90s dance crew.",
  },
  "stamp-modern-ppop": {
    question: "Which traditional Filipino instrument appears in modern P-pop motifs?",
    options: ["Kulintang", "Bagpipes", "Sitar"],
    answer: "Kulintang",
    hint: "It's a row of small gongs from Mindanao.",
  },
};
