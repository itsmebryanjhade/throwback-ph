import type { Exhibit } from "@/content/museum";
import { sourceCredits } from "@/content/sources";
import { chatThreads, smsMessages } from "@/content/messages";
import { NokiaInbox } from "@/components/experiences/NokiaInbox";
import { ChatArchives } from "@/components/experiences/ChatArchives";
import { getExhibitStory } from "@/content/exhibit-stories";
import { ExhibitStoryView, type ExhibitStoryViewProps } from "./story/ExhibitStoryView";
import styles from "./museum.module.css";

const visualMarks: Record<Exhibit["visualKind"], readonly string[]> = {
  phone: ["NOKIA", "1 message", "Menu"],
  "computer-shop": ["INTERNET", "₱15 / hour", "OPEN 24 HRS"],
  profile: ["My profile", "Testimonials", "Friends · 248"],
  "text-rally": ["Forward", "Pass this on", "EDSA · 2001"],
  television: ["LIVE", "Text to vote", "PBB · 2005"],
  "music-player": ["OPM MIX", "Now playing", "03:42"],
  karaoke: ["YOUR SONG", "Score 92", "Next singer"],
  "video-page": ["▶", "Buffering…", "Add to favorites"],
  "drama-screen": ["Tonight", "Asianovela", "Next episode"],
  "anime-screen": ["After school", "Filipino dub", "Channel 7"],
  chat: ["Online", "BUZZ!", "#pinoytambayan"],
  passport: ["PH", "ARRIVAL", "P-POP"],
};

type StoryProps = Partial<Omit<ExhibitStoryViewProps, "exhibit" | "story">>;

export function ExhibitViewer({
  exhibit,
  children,
  position,
  ...storyProps
}: { exhibit: Exhibit; children?: React.ReactNode } & StoryProps) {
  const story = getExhibitStory(exhibit.id);
  if (story) {
    return (
      <ExhibitStoryView
        exhibit={exhibit}
        story={story}
        position={position ?? { index: 0, total: 1 }}
        {...storyProps}
      />
    );
  }
  const sources = sourceCredits.filter((source) => exhibit.sourceIds.includes(source.id));
  return (
    <article className={styles.viewer}>
      {exhibit.interaction === "nokia" ? <NokiaInbox messages={smsMessages} /> : exhibit.interaction === "chat-archives" ? <ChatArchives threads={chatThreads} /> : (
        <div className={`${styles.visual} ${styles[exhibit.visualKind]}`} role="img" aria-label={exhibit.alt} data-ui>
          {visualMarks[exhibit.visualKind].map((mark) => <span key={mark}>{mark}</span>)}
        </div>
      )}
      <div className={styles.exhibitCopy}>
        <p className={styles.years}>{exhibit.years}</p>
        <h2>{exhibit.title}</h2>
        <p>{exhibit.summary}</p>
        <section className={styles.takeaway} aria-label="Why it mattered">
          <h3>Why it mattered</h3><p>{exhibit.whyItMattered}</p>
        </section>
        {children}
        <details className={styles.sources}>
          <summary>Sources and credits</summary>
          <ul>{sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><span>{source.creator}</span></li>)}</ul>
        </details>
      </div>
    </article>
  );
}
