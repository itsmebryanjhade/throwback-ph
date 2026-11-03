export const WINDOW_STORAGE_KEY = "throwback-ph:windows";

export const APP_STORAGE_KEYS = [
  "friendster",
  "nokia-messages",
  "net-cafe",
  "reality-tv-vote",
  "opm-media-player",
  "pinoytube",
  "tv-tambayan",
  "chat-archives",
  "ppop-passport",
].map((id) => `throwback-ph:app:${id}`);

export const MUSEUM_STORAGE_KEYS = [WINDOW_STORAGE_KEY, ...APP_STORAGE_KEYS];
