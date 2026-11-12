"use client";

import { useState } from "react";
import type { OpmState, Track } from "@/lib/apps/opm/types";
import styles from "./amp.module.css";

export function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export type AmpHandlers = {
  play: (trackId?: string) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  volume: (value: number) => void;
  mute: () => void;
  shuffle: () => void;
  repeat: () => void;
  favorite: (trackId: string) => void;
  visualizer: () => void;
  togglePlaylist: (trackId: string) => void;
  openNotes: () => void;
};

const BAR_COUNT = 20;

function Visualizer({ state, onToggle }: { state: OpmState; onToggle: () => void }) {
  const playing = state.playbackState === "playing";
  return (
    <button
      type="button"
      className={styles.vis}
      onClick={onToggle}
      aria-label={`Visualizer: ${state.visualizerMode === "bars" ? "spectrum bars" : "waveform"}. Click to switch.`}
      title="Click to switch visualizer"
      data-playing={playing}
    >
      {state.visualizerMode === "bars" ? (
        <span className={styles.bars} data-testid="visualizer-bars">
          {Array.from({ length: BAR_COUNT }).map((_, index) => (
            <i key={index} style={{ animationDelay: `${(index * 97) % 700}ms`, height: playing ? undefined : "8%" }} />
          ))}
        </span>
      ) : (
        <svg className={styles.wave} viewBox="0 0 200 40" preserveAspectRatio="none" data-testid="visualizer-wave" aria-hidden="true">
          <path
            d={`M0 20 ${Array.from({ length: 40 })
              .map((_, i) => `L${i * 5 + 5} ${playing ? 20 + Math.sin(i * 0.9) * (6 + ((i * 7) % 9)) : 20}`)
              .join(" ")}`}
          />
        </svg>
      )}
    </button>
  );
}

export function PinoyAmp({ state, handlers }: { state: OpmState; handlers: AmpHandlers }) {
  const [genre, setGenre] = useState("all");
  const track = state.tracks.find((t) => t.id === state.currentTrackId) ?? state.tracks[0];
  const trackNumber = state.tracks.findIndex((t) => t.id === track.id) + 1;
  const playing = state.playbackState === "playing";
  const genres = Array.from(new Set(state.tracks.map((t) => t.genre)));
  const visible = state.tracks.filter((t) => genre === "all" || t.genre === genre);
  const queueSeconds = state.tracks
    .filter((t) => state.playlistTrackIds.includes(t.id))
    .reduce((sum, t) => sum + t.durationSeconds, 0);
  const marquee = `${trackNumber}. ${track.artist} – ${track.title} (${formatTime(track.durationSeconds)}) *** `;

  return (
    <div className={styles.amp}>
      <ol className={styles.tips} aria-label="Try this">
        <li>▶ Press play</li>
        <li>⏭ Skip to the next song</li>
        <li>Click the visualizer to switch it</li>
        <li>❤ Favorite a song</li>
        <li>🎸 Read the liner notes</li>
      </ol>

      <div className={styles.stack}>
        {/* ---------- Main window ---------- */}
        <section className={styles.main} aria-label="PinoyAmp player">
          <div className={styles.titlebar} aria-hidden="true">
            <span>PINOYAMP</span>
            <span className={styles.grip} />
            <span>_ □ ×</span>
          </div>

          <div className={styles.display}>
            <div className={styles.left}>
              <div className={styles.time}>
                <span className={styles.stateGlyph} aria-hidden="true">
                  {playing ? "▶" : state.playbackState === "paused" ? "❚❚" : "■"}
                </span>
                <span data-testid="lcd-time-display">{formatTime(state.currentTimeSeconds)}</span>
              </div>
              <Visualizer state={state} onToggle={handlers.visualizer} />
            </div>
            <div className={styles.right}>
              <div className={styles.marquee} data-testid="lcd-track-title">
                <span data-playing={playing}>{marquee.repeat(2)}</span>
              </div>
              <div className={styles.meta}>
                <span>{track.bitrate.replace(" kbps", "")}</span>
                <small>kbps</small>
                <span>44</span>
                <small>kHz</small>
                <span className={styles.stereo}>stereo</span>
              </div>
              <label className={styles.volume}>
                <span>Vol</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={state.isMuted ? 0 : state.volume}
                  onChange={(event) => handlers.volume(Number(event.target.value))}
                  aria-label="Volume"
                />
                <button type="button" onClick={handlers.mute} aria-pressed={state.isMuted} aria-label={state.isMuted ? "Unmute" : "Mute"}>
                  {state.isMuted ? "🔇" : "🔊"}
                </button>
              </label>
            </div>
          </div>

          <input
            className={styles.seek}
            type="range"
            min={0}
            max={track.durationSeconds}
            value={Math.min(state.currentTimeSeconds, track.durationSeconds)}
            onChange={(event) => handlers.seek(Number(event.target.value))}
            aria-label="Seek track position"
          />

          <div className={styles.transport}>
            <button type="button" onClick={handlers.prev} aria-label="Previous Track">
              ⏮
            </button>
            <button type="button" onClick={() => handlers.play()} aria-label="Play" data-on={playing}>
              ▶
            </button>
            <button type="button" onClick={handlers.pause} aria-label="Pause">
              ❚❚
            </button>
            <button type="button" onClick={handlers.stop} aria-label="Stop">
              ■
            </button>
            <button type="button" onClick={handlers.next} aria-label="Next Track">
              ⏭
            </button>
            <span className={styles.spacer} />
            <button type="button" className={styles.toggle} onClick={handlers.shuffle} aria-pressed={state.isShuffle}>
              Shuffle
            </button>
            <button type="button" className={styles.toggle} onClick={handlers.repeat} aria-pressed={state.isRepeat}>
              Repeat
            </button>
          </div>
        </section>

        {/* ---------- Now playing: CD case ---------- */}
        <section className={styles.nowPlaying} aria-label="Now playing">
          <div className={styles.jewel}>
            {track.coverSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={track.coverSrc} alt={`${track.artist} album cover for ${track.album}`} />
            ) : (
              <span className={styles.burned} role="img" aria-label={`${track.title} burned CD`}>
                💿
                <small>{track.album}</small>
              </span>
            )}
          </div>
          <div className={styles.npText}>
            <h3>{track.title}</h3>
            <p className={styles.npArtist}>
              {track.artist} · <i>{track.album}</i> ({track.year})
            </p>
            <p className={styles.npNotes}>{track.linerNotes}</p>
            <div className={styles.npActions}>
              <button
                type="button"
                className={styles.fav}
                onClick={() => handlers.favorite(track.id)}
                aria-pressed={track.isFavorite}
                aria-label={track.isFavorite ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
              >
                {track.isFavorite ? "❤ Favorite" : "♡ Favorite"}
              </button>
              <button type="button" className={styles.notesLink} onClick={handlers.openNotes}>
                🎸 Read the liner notes
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Playlist editor ---------- */}
        <section className={styles.playlist} aria-label="Playlist editor">
          <div className={styles.titlebar}>
            <span>PLAYLIST EDITOR</span>
            <span className={styles.grip} aria-hidden="true" />
            <label className={styles.genre}>
              Genre:
              <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                <option value="all">All</option>
                {genres.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ol className={styles.tracks}>
            {visible.map((item: Track) => {
              const index = state.tracks.findIndex((t) => t.id === item.id) + 1;
              const current = item.id === track.id;
              const queued = state.playlistTrackIds.includes(item.id);
              return (
                <li key={item.id} data-current={current} data-queued={queued}>
                  <button
                    type="button"
                    className={styles.trackButton}
                    onClick={() => handlers.play(item.id)}
                    aria-label={`Play ${item.artist} – ${item.title}`}
                    aria-current={current ? "true" : undefined}
                  >
                    <span className={styles.trackNo}>{index}.</span>
                    <span className={styles.trackName}>
                      {item.artist} – {item.title}
                    </span>
                    <span className={styles.trackTime}>{formatTime(item.durationSeconds)}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.miniButton}
                    onClick={() => handlers.favorite(item.id)}
                    aria-label={item.isFavorite ? `Unfavorite ${item.title}` : `Favorite ${item.title}`}
                  >
                    {item.isFavorite ? "❤" : "♡"}
                  </button>
                  <button
                    type="button"
                    className={styles.miniButton}
                    onClick={() => handlers.togglePlaylist(item.id)}
                    aria-label={queued ? `Remove ${item.title} from playlist` : `Add ${item.title} to playlist`}
                    title={queued ? "In playlist — click to remove" : "Not in playlist — click to add"}
                  >
                    {queued ? "−" : "+"}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className={styles.plFoot}>
            <span>
              {state.playlistTrackIds.length} songs in playlist · {formatTime(queueSeconds)}
            </span>
            <span>Click a song to play it</span>
          </div>
        </section>
      </div>
    </div>
  );
}
