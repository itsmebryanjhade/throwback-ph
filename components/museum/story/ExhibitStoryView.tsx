"use client";

import Image from "next/image";
import type { Exhibit } from "@/content/museum";
import type { ExhibitStory } from "@/content/exhibit-stories";
import { sourceCredits } from "@/content/sources";
import { chatThreads, smsMessages } from "@/content/messages";
import { getApp } from "@/lib/apps/catalog";
import { NokiaInbox } from "@/components/experiences/NokiaInbox";
import { DesktopGlyph, type GlyphKind } from "@/components/desktop/DesktopGlyph";
import { TextSpeakToy } from "./TextSpeakToy";
import { CoinTimerToy } from "./CoinTimerToy";
import { ProfileSkinToy } from "./ProfileSkinToy";
import { ForwardChainToy } from "./ForwardChainToy";
import { TextVoteToy } from "./TextVoteToy";
import { BurnCdToy } from "./BurnCdToy";
import { VideokeToy } from "./VideokeToy";
import { UploadToy } from "./UploadToy";
import { DubSceneToy } from "./DubSceneToy";
import { RaceHomeToy } from "./RaceHomeToy";
import { ScreenNameToy } from "./ScreenNameToy";
import { MixSoundToy } from "./MixSoundToy";
import { ChatArchives } from "@/components/experiences/ChatArchives";
import styles from "./story.module.css";

const TOYS = {
  textspeak: TextSpeakToy,
  "coin-timer": CoinTimerToy,
  "profile-skin": ProfileSkinToy,
  "forward-chain": ForwardChainToy,
  "text-vote": TextVoteToy,
  "burn-cd": BurnCdToy,
  videoke: VideokeToy,
  upload: UploadToy,
  "dub-scene": DubSceneToy,
  "race-home": RaceHomeToy,
  "screen-name": ScreenNameToy,
  "mix-sound": MixSoundToy,
} as const;

const HERO_GLYPHS: Record<string, readonly GlyphKind[]> = {
  "nokia-sms": ["nokia-messages", "chat-archives"],
  "internet-cafe": ["net-cafe", "opm-media-player"],
  "friendster-era": ["friendster", "chat-archives"],
  "power-of-text": ["nokia-messages", "nokia-messages", "nokia-messages"],
  "reality-tv": ["reality-tv-vote", "nokia-messages", "chat-archives"],
  "opm-band-scene": ["opm-media-player", "opm-media-player"],
  "karaoke-mall-shows": ["microphone", "tv-tambayan"],
  "early-youtube": ["pinoytube", "chat-archives"],
  "asianovela-craze": ["tv-tambayan", "chat-archives"],
  "anime-tv": ["tv-tambayan", "pinoytube"],
  "chat-archives": ["chat-archives", "net-cafe"],
  "foreign-to-ppop": ["ppop-passport", "opm-media-player"],
};

export type ExhibitStoryViewProps = {
  exhibit: Exhibit;
  story: ExhibitStory;
  position: { index: number; total: number };
  nextExhibit?: Exhibit;
  onSelectExhibit?: (exhibitId: string) => void;
  onOpenApp?: (appId: string) => void;
};

export function ExhibitStoryView({
  exhibit,
  story,
  position,
  nextExhibit,
  onSelectExhibit,
  onOpenApp,
}: ExhibitStoryViewProps) {
  const Toy = TOYS[story.toy];
  const app = getApp(story.relatedApp.id);
  const sources = sourceCredits.filter((source) => exhibit.sourceIds.includes(source.id));
  const glyphs = HERO_GLYPHS[exhibit.id] ?? ["start-here"];
  const tryItId = `try-${exhibit.id}`;

  return (
    <article className={styles.story} data-exhibit={exhibit.id}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>
            {exhibit.years} · Exhibit {position.index + 1} of {position.total}
          </p>
          <h2>{exhibit.title}</h2>
          <p className={styles.hook}>{story.hook}</p>
          <button
            type="button"
            className={styles.jumpLink}
            onClick={() => {
              const target = document.getElementById(tryItId);
              const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
              target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
              target?.querySelector<HTMLElement>("textarea, button, input")?.focus({ preventScroll: true });
            }}
          >
            ▶ Try it: {story.tryIt.title}
          </button>
        </div>
        <div className={styles.heroArt} role="img" aria-label={exhibit.alt}>
          {glyphs.map((kind, index) => (
            <span key={`${kind}-${index}`} className={styles.heroGlyph} data-slot={index}>
              <DesktopGlyph kind={kind} room={exhibit.room} size={index === 0 ? 112 : 64} />
            </span>
          ))}
        </div>
      </header>

      <section className={styles.tryIt} id={tryItId} aria-labelledby={`${tryItId}-title`}>
        <div className={styles.tryItHead}>
          <span className={styles.tryBadge}>Try it</span>
          <div>
            <h3 id={`${tryItId}-title`}>{story.tryIt.title}</h3>
            <p>{story.tryIt.instructions}</p>
          </div>
        </div>
        <Toy />
      </section>

      <section className={styles.storyBody} aria-label="The story">
        <div className={styles.storyText}>
          <h3>The story</h3>
          <p>{exhibit.summary}</p>
        </div>
        {exhibit.interaction === "nokia" && (
          <figure className={styles.artifact}>
            <NokiaInbox messages={smsMessages} />
            <figcaption>A typical inbox. Tap a message to read it.</figcaption>
          </figure>
        )}
        {exhibit.interaction === "chat-archives" && (
          <figure className={styles.artifact}>
            <ChatArchives threads={chatThreads} />
            <figcaption>Recreated chat logs from the era. Switch between Yahoo! Messenger and mIRC.</figcaption>
          </figure>
        )}
        {exhibit.id === "internet-cafe" && (
          <figure className={styles.artifact}>
            <div className={styles.photo}>
              <Image
                src="/museum/phase-9/images/net-cafe-interior.jpg"
                alt="Rows of desktop computers in a busy neighborhood computer shop, with students gaming and chatting."
                fill
                sizes="(max-width: 900px) 100vw, 420px"
              />
            </div>
            <figcaption>A neighborhood computer shop after school (reconstruction).</figcaption>
          </figure>
        )}
      </section>

      <section className={styles.facts} aria-labelledby={`${tryItId}-facts`}>
        <h3 id={`${tryItId}-facts`}>Did you know?</h3>
        <ul>
          {story.facts.map((fact, index) => (
            <li key={fact.label} style={{ "--tilt": `${(index - 1) * 1.2}deg` } as React.CSSProperties}>
              <strong>{fact.label}</strong>
              <p>{fact.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.thenNow} aria-label="Then and now">
        <div className={styles.then}>
          <h3>Then · 2000s</h3>
          <ul>
            {story.thenNow.then.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <span className={styles.thenNowArrow} aria-hidden="true">
          →
        </span>
        <div className={styles.now}>
          <h3>Now</h3>
          <ul>
            {story.thenNow.now.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.takeaway} aria-label="Why it mattered">
        <h3>Why it mattered</h3>
        <p>{exhibit.whyItMattered}</p>
      </section>

      <nav className={styles.continue} aria-label="Keep exploring">
        {app && onOpenApp && (
          <button type="button" className={styles.continueApp} onClick={() => onOpenApp(app.id)}>
            <DesktopGlyph kind={app.id} room={app.room} size={40} />
            <span>
              <strong>Open {app.title}</strong>
              <small>{story.relatedApp.pitch}</small>
            </span>
          </button>
        )}
        {nextExhibit && onSelectExhibit && (
          <button
            type="button"
            className={styles.continueNext}
            onClick={() => onSelectExhibit(nextExhibit.id)}
          >
            <small>Next in this room</small>
            <strong>{nextExhibit.title} →</strong>
          </button>
        )}
      </nav>

      <details className={styles.sources}>
        <summary>Sources and credits</summary>
        <ul>
          {sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
              <span>{source.creator}</span>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
