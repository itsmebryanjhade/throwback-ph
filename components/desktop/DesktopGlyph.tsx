import type { RoomId } from "@/content/museum";

/**
 * Hand-drawn, Windows XP–style desktop icons (48×48 SVG).
 * Each app gets an object that is recognisable on its own, so visitors can
 * tell the icons apart without reading the label.
 */

export type GlyphKind =
  | "start-here"
  | "exhibit"
  | "folder"
  | "friendster"
  | "nokia-messages"
  | "net-cafe"
  | "reality-tv-vote"
  | "opm-media-player"
  | "pinoytube"
  | "tv-tambayan"
  | "chat-archives"
  | "ppop-passport"
  | "microphone";

export const ROOM_COLORS: Record<RoomId, { main: string; dark: string; label: string }> = {
  technology: { main: "#f5a623", dark: "#b86f00", label: "TXT" },
  performance: { main: "#ef6f5b", dark: "#a8341f", label: "PLAY" },
  globalization: { main: "#4aa3e8", dark: "#17609e", label: "WWW" },
};

type Props = {
  kind: GlyphKind;
  room?: RoomId;
  size?: number;
};

export function DesktopGlyph({ kind, room = "technology", size = 48 }: Props) {
  const tone = ROOM_COLORS[room];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      {renderGlyph(kind, tone)}
    </svg>
  );
}

function renderGlyph(kind: GlyphKind, tone: { main: string; dark: string; label: string }) {
  switch (kind) {
    case "start-here":
      // Help book with a question mark
      return (
        <g>
          <rect x="9" y="5" width="30" height="38" rx="2" fill="#1d5fbf" stroke="#0b3a80" strokeWidth="1.5" />
          <rect x="9" y="5" width="6" height="38" fill="#0b3a80" />
          <rect x="36" y="8" width="5" height="34" fill="#f4f1e4" stroke="#b9b39a" />
          <circle cx="26" cy="22" r="9" fill="#fff" />
          <text x="26" y="27" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1d5fbf" fontFamily="Tahoma, Verdana, sans-serif">?</text>
          <rect x="17" y="35" width="18" height="3" rx="1" fill="#8fb8f0" />
        </g>
      );
    case "exhibit":
      // Gallery frame with the room's colour and symbol
      return (
        <g>
          <rect x="3" y="6" width="42" height="34" rx="1" fill="#a8742c" stroke="#5f3e12" strokeWidth="1.5" />
          <rect x="7" y="10" width="34" height="26" fill={tone.main} stroke="#5f3e12" strokeWidth="1" />
          <path d="M7 36 L19 24 L27 31 L33 26 L41 34 L41 36 Z" fill={tone.dark} opacity=".55" />
          <text x="24" y="25" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0d2142" fontFamily="Tahoma, Verdana, sans-serif">{tone.label}</text>
          <rect x="16" y="41" width="16" height="4" rx="1" fill="#f4f1e4" stroke="#8a845f" strokeWidth=".8" />
        </g>
      );
    case "folder":
      // Manila folder with a room-coloured badge
      return (
        <g>
          <path d="M3 11 h15 l4 4 h23 v26 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z" fill="#d9a826" stroke="#9a7213" strokeWidth="1.2" />
          <rect x="7" y="13" width="32" height="20" fill="#fff" stroke="#c9c4a8" />
          <path d="M3 19 h42 v22 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z" fill="#f7cf55" stroke="#9a7213" strokeWidth="1.2" />
          <rect x="30" y="31" width="14" height="10" rx="2" fill={tone.main} stroke={tone.dark} strokeWidth="1" />
          <text x="37" y="38.5" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#0d2142" fontFamily="Tahoma, Verdana, sans-serif">{tone.label}</text>
        </g>
      );
    case "friendster":
      // Profile card with avatar and friend dots
      return (
        <g>
          <rect x="4" y="7" width="40" height="34" rx="3" fill="#fff" stroke="#2f5fa8" strokeWidth="1.5" />
          <rect x="4" y="7" width="40" height="9" rx="3" fill="#2f5fa8" />
          <text x="8" y="14.5" fontSize="7" fontWeight="900" fill="#fff" fontFamily="Tahoma, Verdana, sans-serif">friendster</text>
          <rect x="8" y="19" width="14" height="17" fill="#cfe0f7" stroke="#2f5fa8" strokeWidth=".8" />
          <circle cx="15" cy="25" r="4" fill="#e6a77a" />
          <path d="M9 36 q6 -8 12 0 Z" fill="#e8559a" />
          <rect x="25" y="20" width="15" height="2.5" fill="#9fb4d4" />
          <rect x="25" y="25" width="12" height="2.5" fill="#9fb4d4" />
          <circle cx="27" cy="33" r="2.6" fill="#f5a623" />
          <circle cx="33" cy="33" r="2.6" fill="#4caf50" />
          <circle cx="39" cy="33" r="2.6" fill="#e8559a" />
        </g>
      );
    case "nokia-messages":
      // Candy-bar phone with a green screen and envelope
      return (
        <g>
          <rect x="14" y="2" width="20" height="44" rx="7" fill="#20385f" stroke="#0d1c33" strokeWidth="1.2" />
          <rect x="17" y="7" width="14" height="13" rx="1.5" fill="#a7c957" stroke="#0d1c33" strokeWidth=".8" />
          <rect x="19.5" y="10" width="9" height="6.5" fill="#fff" stroke="#3d5a1e" strokeWidth=".7" />
          <path d="M19.5 10 l4.5 3.6 l4.5 -3.6" fill="none" stroke="#3d5a1e" strokeWidth=".8" />
          <rect x="19" y="23" width="10" height="3.5" rx="1.7" fill="#5f7da8" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect key={`${row}-${col}`} x={17.5 + col * 4.8} y={29 + row * 4.8} width="3.4" height="3" rx="1" fill="#c9d6ea" />
            )),
          )}
        </g>
      );
    case "net-cafe":
      // CRT monitor with a timer
      return (
        <g>
          <rect x="4" y="5" width="40" height="30" rx="3" fill="#e9e4d0" stroke="#7d7660" strokeWidth="1.3" />
          <rect x="8" y="9" width="32" height="21" fill="#2a6fd1" />
          <rect x="8" y="9" width="32" height="4" fill="#0c3f8f" />
          <rect x="11" y="16" width="12" height="9" fill="#fff" opacity=".9" />
          <text x="31.5" y="25" textAnchor="middle" fontSize="7" fontWeight="900" fill="#ffe066" fontFamily="Tahoma, Verdana, sans-serif">1:00</text>
          <rect x="18" y="35" width="12" height="4" fill="#cfc8ae" stroke="#7d7660" />
          <rect x="10" y="39" width="28" height="5" rx="1.5" fill="#e9e4d0" stroke="#7d7660" />
        </g>
      );
    case "reality-tv-vote":
      // TV with a ballot check mark
      return (
        <g>
          <rect x="3" y="8" width="42" height="30" rx="4" fill="#4a4f5c" stroke="#1d2027" strokeWidth="1.3" />
          <rect x="7" y="12" width="28" height="22" rx="3" fill="#7a3fb0" />
          <circle cx="21" cy="23" r="7.5" fill="#fff" />
          <path d="M17 23 l3 3.2 l5.5 -6" fill="none" stroke="#2f9e44" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="40" cy="16" r="2" fill="#c9ced8" />
          <circle cx="40" cy="22" r="2" fill="#c9ced8" />
          <rect x="37.5" y="27" width="5" height="6" fill="#ef6f5b" />
          <rect x="12" y="38" width="5" height="4" fill="#1d2027" />
          <rect x="31" y="38" width="5" height="4" fill="#1d2027" />
        </g>
      );
    case "opm-media-player":
      // CD with music note
      return (
        <g>
          <circle cx="22" cy="24" r="19" fill="#dfe6ee" stroke="#8a97a8" strokeWidth="1.2" />
          <path d="M22 5 a19 19 0 0 1 17 10.5 L22 24 Z" fill="#f7c6e0" opacity=".85" />
          <path d="M22 24 L5 32.5 a19 19 0 0 0 9 9 Z" fill="#b7e4f7" opacity=".85" />
          <circle cx="22" cy="24" r="6" fill="#fff" stroke="#8a97a8" />
          <circle cx="22" cy="24" r="2.2" fill="#8a97a8" />
          <path d="M37 18 v17" stroke="#d84a1b" strokeWidth="2.6" />
          <path d="M37 18 l8 -3 v5 l-8 3 Z" fill="#d84a1b" />
          <ellipse cx="34" cy="36" rx="4.3" ry="3.3" fill="#d84a1b" />
        </g>
      );
    case "pinoytube":
      // Browser window with a red play button
      return (
        <g>
          <rect x="3" y="7" width="42" height="34" rx="2" fill="#fff" stroke="#59606e" strokeWidth="1.3" />
          <rect x="3" y="7" width="42" height="7" rx="2" fill="#c9ced8" />
          <circle cx="8" cy="10.5" r="1.4" fill="#ef6f5b" />
          <circle cx="12.5" cy="10.5" r="1.4" fill="#f5a623" />
          <rect x="8" y="17" width="32" height="19" fill="#20232b" />
          <rect x="16" y="20" width="16" height="12" rx="4" fill="#e02020" />
          <path d="M22 23 v6 l5.5 -3 Z" fill="#fff" />
          <rect x="8" y="37.5" width="20" height="1.8" fill="#e02020" />
        </g>
      );
    case "tv-tambayan":
      // Old CRT TV with rabbit-ear antenna
      return (
        <g>
          <path d="M17 11 L10 2 M31 11 L38 2" stroke="#4a4f5c" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="4" y="11" width="40" height="30" rx="4" fill="#9a6a3a" stroke="#5c3a17" strokeWidth="1.3" />
          <rect x="8" y="15" width="26" height="22" rx="5" fill="#2b4c7e" />
          <path d="M8 30 q13 -10 26 -2 v4 a5 5 0 0 1 -5 5 H13 a5 5 0 0 1 -5 -5 Z" fill="#4aa3e8" opacity=".6" />
          <circle cx="16" cy="22" r="3" fill="#f7cf55" />
          <circle cx="39" cy="20" r="2.2" fill="#e6d3b3" />
          <circle cx="39" cy="27" r="2.2" fill="#e6d3b3" />
          <rect x="10" y="41" width="5" height="4" fill="#5c3a17" />
          <rect x="33" y="41" width="5" height="4" fill="#5c3a17" />
        </g>
      );
    case "chat-archives":
      // Messenger smiley with speech bubbles
      return (
        <g>
          <path d="M3 8 h28 a3 3 0 0 1 3 3 v14 a3 3 0 0 1 -3 3 H14 l-6 6 v-6 H6 a3 3 0 0 1 -3 -3 V11 a3 3 0 0 1 3 -3 Z" fill="#fff" stroke="#6b3fa0" strokeWidth="1.3" />
          <rect x="8" y="13" width="18" height="2.4" fill="#b8a3d8" />
          <rect x="8" y="18.5" width="13" height="2.4" fill="#b8a3d8" />
          <circle cx="34" cy="32" r="11" fill="#f9d423" stroke="#b8860b" strokeWidth="1.2" />
          <circle cx="30.5" cy="29.5" r="1.5" fill="#3a2a00" />
          <circle cx="37.5" cy="29.5" r="1.5" fill="#3a2a00" />
          <path d="M29 34.5 q5 5 10 0" fill="none" stroke="#3a2a00" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    case "microphone":
      // Videoke microphone with a cable
      return (
        <g>
          <path d="M24 30 C24 40 14 38 10 44" fill="none" stroke="#20232b" strokeWidth="2" strokeLinecap="round" />
          <rect x="19" y="18" width="10" height="16" rx="3" fill="#2a2f3a" stroke="#0d0f14" strokeWidth="1.2" />
          <rect x="19" y="21" width="10" height="2" fill="#ef6f5b" />
          <circle cx="24" cy="12" r="9" fill="#c9ced8" stroke="#59606e" strokeWidth="1.3" />
          <path d="M17 9 h14 M16 12 h16 M17 15 h14" stroke="#8a91a0" strokeWidth=".9" />
          <path d="M35 6 l3 -3 M38 11 h4 M35 16 l3 3" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );
    case "ppop-passport":
      // Maroon passport with globe and a stamp
      return (
        <g>
          <rect x="9" y="4" width="28" height="40" rx="2.5" fill="#7a1f2b" stroke="#4a0f17" strokeWidth="1.3" />
          <circle cx="23" cy="20" r="8" fill="none" stroke="#e8c260" strokeWidth="1.4" />
          <ellipse cx="23" cy="20" rx="3.5" ry="8" fill="none" stroke="#e8c260" strokeWidth="1" />
          <path d="M15 20 h16" stroke="#e8c260" strokeWidth="1" />
          <rect x="15" y="32" width="16" height="2" fill="#e8c260" />
          <rect x="17.5" y="36" width="11" height="1.6" fill="#e8c260" />
          <g transform="rotate(-14 37 35)">
            <circle cx="37" cy="35" r="7.5" fill="#fff" stroke="#2f9e44" strokeWidth="1.5" />
            <text x="37" y="37.3" textAnchor="middle" fontSize="6" fontWeight="900" fill="#2f9e44" fontFamily="Tahoma, Verdana, sans-serif">PH</text>
          </g>
        </g>
      );
  }
}
