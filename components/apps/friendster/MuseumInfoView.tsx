import { sourceCredits } from "@/content/sources";
import styles from "./friendster.module.css";

export function MuseumInfoView() {
  const archive = sourceCredits.find((source) => source.id === "friendster-archive");

  return (
    <div className={styles.page}>
      <section className={styles.box}>
        <div className={styles.museumHeaderRow}>
          <div>
            <span className={styles.museumEyebrow}>EXHIBIT INTERPRETATION · TECHNOLOGY ROOM</span>
            <h2 className={styles.museumExhibitTitle}>Friendster Era & Early Profile Culture</h2>
          </div>
          <span className={styles.museumYearsTag}>2002–2008</span>
        </div>

        <p className={styles.museumTextBlock}>
          Between 2002 and 2008, Friendster became the undisputed center of Filipino online social life. Long before
          smartphones and algorithmic recommendation engines dominated digital interaction, Filipinos crowded into
          internet cafés and home dial-up connections to curate their profiles, rearrange their Top Friends, design
          custom HTML/CSS skins, and collect testimonials.
        </p>

        <blockquote className={styles.museumQuoteBox}>
          “Testimonials, profile skins, carefully chosen photos, and a visible friends list made identity something
          Filipinos could design, display, and validate in public view.”
        </blockquote>

        <h3 className={styles.boxTitle}>What to try in this app</h3>
        <ul className={styles.museumTryList}>
          <li>
            <strong>Profile skins</strong>: people spent hours on their page&apos;s look, and so can you.
          </li>
          <li>
            <strong>Testimonials</strong>: approve the pending one, then write a testi back. Testi-for-testi was
            the etiquette.
          </li>
          <li>
            <strong>Top Friends</strong>: your list was public, so who made the cut mattered.
          </li>
          <li>
            <strong>Bulletins</strong>: one post reached your whole network, like an early group announcement.
          </li>
        </ul>

        <p className={styles.museumTextBlock}>
          <strong>Why it mattered:</strong> The Philippines emerged as one of Friendster’s largest user bases
          globally, serving as a pioneer for how social networks can mediate real-world community. In the Philippine
          context, Friendster was not merely a directory of contacts; it was a digital extension of barkada life,
          campus reputations, and courtship rituals.
        </p>

        <div className={styles.reconstructionNoticeBox}>
          <strong>Educational Reconstruction Notice:</strong> This application is an original educational recreation
          honoring mid-2000s Filipino social networking culture. All profile names, photos, testimonials, and
          bulletins are fictional historical reconstructions. No copyrighted code, logos, or assets from Friendster
          Inc. are used.
        </div>

        <h3 className={styles.boxTitle}>Sources & Citations</h3>
        <ul className={styles.sourceList}>
          {archive && (
            <li className={styles.sourceLinkItem}>
              <a href={archive.url} target="_blank" rel="noopener noreferrer">
                {archive.title}
              </a>{" "}
              — {archive.creator} ({archive.usageBasis})
            </li>
          )}
          <li className={styles.sourceLinkItem}>
            <a
              href="https://www.itu.int/en/ITU-D/Statistics/Dashboards/Pages/Digital-Development.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              ITU Digital Development: Philippines
            </a>{" "}
            — International Telecommunication Union
          </li>
        </ul>
      </section>
    </div>
  );
}
