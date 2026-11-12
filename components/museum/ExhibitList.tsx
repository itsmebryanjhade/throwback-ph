import type { Exhibit } from "@/content/museum";
import styles from "./museum.module.css";

export function ExhibitList({
  exhibits,
  selectedId,
  visitedIds = [],
  onSelect,
}: {
  exhibits: readonly Exhibit[];
  selectedId: string | null;
  visitedIds?: readonly string[];
  onSelect: (id: string) => void;
}) {
  return (
    <nav className={styles.exhibitList} aria-label="Exhibits in this room">
      {exhibits.map((exhibit, index) => {
        const visited = visitedIds.includes(exhibit.id);
        return (
          <button
            key={exhibit.id}
            type="button"
            aria-label={`View exhibit: ${exhibit.title}${visited ? " (explored)" : ""}`}
            aria-current={selectedId === exhibit.id ? "page" : undefined}
            data-visited={visited}
            onClick={() => onSelect(exhibit.id)}
          >
            <span>
              {index + 1}. {exhibit.years}
            </span>
            <strong>{exhibit.title}</strong>
            <i className={styles.visitMark} aria-hidden="true">
              {visited ? "✓" : "NEW"}
            </i>
          </button>
        );
      })}
    </nav>
  );
}
