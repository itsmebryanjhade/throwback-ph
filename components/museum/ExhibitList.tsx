import type { Exhibit } from "@/content/museum";
import styles from "./museum.module.css";

export function ExhibitList({ exhibits, selectedId, onSelect }: { exhibits: readonly Exhibit[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <nav className={styles.exhibitList} aria-label="Exhibits in this room">
      {exhibits.map((exhibit) => (
        <button key={exhibit.id} type="button" aria-label={`View exhibit: ${exhibit.title}`} aria-current={selectedId === exhibit.id ? "page" : undefined} onClick={() => onSelect(exhibit.id)}>
          <span>{exhibit.years}</span><strong>{exhibit.title}</strong>
        </button>
      ))}
    </nav>
  );
}
