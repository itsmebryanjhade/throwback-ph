/**
 * Fictional replies so chatting feels alive. Each Yahoo! contact has their own
 * voice; mIRC channels answer as a room. Replies cycle in order (no randomness),
 * so every visitor gets the same friendly conversation.
 */

export const YAHOO_REPLIES: Record<string, readonly string[]> = {
  "contact-angel": [
    "haha oo nga! teka lang, nagda-download pa ko ng kanta sa Limewire :P",
    "uy add mo ko sa Top Friends mo ha!! ;)",
    "brb kakain lang, tawag na ni mama >.<",
    "sige sige! text mo na lang ako pag offline ka na :D",
  ],
  "contact-skater": [
    "pare tara DotA mamaya sa comp shop! 5v5 tayo",
    "lag dito samin, 56k lang kasi hahaha",
    "game! dala ka ng sariling headset ha",
  ],
  "contact-kuya": [
    "ingat ka dyan ha. kumain ka na ba?",
    "nakapag-review ka na ba para sa exam? :)",
    "sige, sabihin ko kay mama na nasa comp shop ka lang.",
  ],
  "contact-rocker": [
    "\\m/ rakenrol! narinig mo na yung bagong kanta ng Kamikazee?",
    "may gig kami sa Saturday, nood ka! :D",
    "burn mo ko ng CD ha, yung may Narda!",
  ],
  "contact-crush": [
    "hehe hi :)",
    "uy... sige, kita tayo bukas sa school? ^_^",
    "ang kulit mo talaga haha. gudnyt na! :)",
  ],
};

export const YAHOO_BUZZ_BACK: Record<string, string> = {
  "contact-angel": "Uy! bakit?? haha nandito lang ako",
  "contact-skater": "oi oi! wag mo ko buzz, nasa laro ako!",
  "contact-kuya": "O bakit? may problema ba?",
  "contact-rocker": "BUZZ! ka rin hahaha \\m/",
  "contact-crush": "hala nagulat ako! hehe :)",
};

export const MIRC_REPLIES: Record<string, readonly { nick: string; text: string }[]> = {
  "chan-tambayan": [
    { nick: "manilaKid", text: "asl? :)" },
    { nick: "cebu_girl", text: "hello! welcome sa #pinoytambayan, bawal flood ha" },
    { nick: "davao_boy", text: "haha true! taga-san ka?" },
    { nick: "Mod_AteV", text: "chill lang guys, keep it friendly :)" },
  ],
  "chan-opm": [
    { nick: "Bassist_Mark", text: "pare anong fave band mo? Rivermaya or Eraserheads?" },
    { nick: "Vocal_Chix", text: "may jam kami later sa garahe, sali ka!" },
    { nick: "RockOps", text: "post mo na lang yung lyrics, wag i-flood ha" },
  ],
  "chan-ragnarok": [
    { nick: "GuildMaster_RO", text: "WoE mamaya 8pm! sino sasama?" },
    { nick: "Priest_Healer", text: "pa-buff naman o, sino need ng heal? hehe" },
    { nick: "Knight_Lord", text: "nag-drop ng card yung boss kanina!! grabe" },
  ],
  "chan-manila": [
    { nick: "Katipunan_Guy", text: "gising pa kayo? may exam pa ko bukas haha" },
    { nick: "StarCity_Fan", text: "sino gusto mag-Star City this weekend?" },
    { nick: "NightOwl_Op", text: "reminder: no caps lock, chill lang :)" },
  ],
};

export function pickYahooReply(contactId: string, index: number) {
  const pool = YAHOO_REPLIES[contactId] ?? ["haha :)"];
  return pool[index % pool.length];
}

export function pickMircReply(channelId: string, index: number) {
  const pool = MIRC_REPLIES[channelId] ?? [{ nick: "someone", text: "hello :)" }];
  return pool[index % pool.length];
}
