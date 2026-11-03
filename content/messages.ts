export type SmsMessage = {
  id: string;
  sender: string;
  timestamp: string;
  preview: string;
  body: string;
};

export type ChatThread = {
  id: "yahoo" | "mirc";
  label: string;
  title: string;
  lines: readonly { speaker: string; text: string; time?: string }[];
};

export const smsMessages: readonly SmsMessage[] = [
  { id: "load", sender: "Ate", timestamp: "4:12 PM", preview: "Pabili load…", body: "Pabili load 30. Text mo ko pag nasa kanto ka na." },
  { id: "gm", sender: "GM", timestamp: "6:03 AM", preview: "Gud morning!", body: "Gud morning! Smile ka today. GM lang, no reply needed :)" },
  { id: "barkada", sender: "Barkada", timestamp: "5:48 PM", preview: "Comp shop tayo?", body: "Comp shop tayo 7pm. Dala ka barya, puno na naman sa kabila." },
  { id: "edsa", sender: "Forwarded", timestamp: "Jan 2001", preview: "EDSA update…", body: "Forwarded update: people are gathering at EDSA. Verify the news, stay together, and tell your family where you are." },
] as const;

export const chatThreads: readonly ChatThread[] = [
  {
    id: "yahoo",
    label: "Yahoo! Messenger",
    title: "After-school status: Online",
    lines: [
      { speaker: "miguel_08", text: "uy online ka pala", time: "6:42 PM" },
      { speaker: "xX_angel_Xx", text: "oo, galing comp shop haha", time: "6:43 PM" },
      { speaker: "miguel_08", text: "send mo testimonial ko sa Friendster!", time: "6:44 PM" },
      { speaker: "System", text: "xX_angel_Xx sent a BUZZ!", time: "6:44 PM" },
    ],
  },
  {
    id: "mirc",
    label: "mIRC",
    title: "#pinoytambayan",
    lines: [
      { speaker: "***", text: "miguel has joined #pinoytambayan" },
      { speaker: "manilaKid", text: "asl? welcome sa channel" },
      { speaker: "miguel", text: "19/m/ph — hello!" },
      { speaker: "cebu_girl", text: "welcome, bawal flood :)" },
    ],
  },
] as const;
