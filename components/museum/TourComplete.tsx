import type { MuseumAction } from "@/lib/museum-state";
import styles from "./museum.module.css";

export function TourComplete({ dispatch }: { dispatch: React.Dispatch<MuseumAction> }) {
  return (
    <section className={styles.complete}>
      <p>Technology connected people. Performance invited them in. Globalization widened the screen.</p>
      <h2>The decade changed together.</h2>
      <p>The Filipino 2000s were not simply a switch from analog to digital. They were a period when audiences became participants and global media became local memory.</p>
      <div>
        <button type="button" onClick={() => dispatch({ type: "OPEN_ROOM", roomId: "technology" })}>Revisit rooms</button>
        <button type="button" onClick={() => dispatch({ type: "CLOSE_MUSEUM" })}>Return to desktop</button>
      </div>
    </section>
  );
}
