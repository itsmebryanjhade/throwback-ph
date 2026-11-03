const APP_ARTWORK: Record<string, string> = {
  friendster: "/museum/boot-www.png",
  "nokia-messages": "/museum/boot-txt.png",
  "net-cafe": "/museum/boot-www.png",
  "reality-tv-vote": "/museum/boot-www.png",
  "opm-media-player": "/museum/boot-opm.png",
  pinoytube: "/museum/boot-www.png",
  "tv-tambayan": "/museum/boot-www.png",
  "chat-archives": "/museum/boot-buzz.png",
  "ppop-passport": "/museum/boot-opm.png",
};

export function getAppArtwork(appId: string) {
  return APP_ARTWORK[appId] ?? "/museum/boot-www.png";
}
