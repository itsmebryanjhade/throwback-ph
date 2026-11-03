import type { ReactNode } from "react";
import styles from "./artifact-ui.module.css";

export type CuratorCardProps = {
  title: string;
  summary: string;
  children?: ReactNode;
  tone?: "paper" | "notice";
};

export function CuratorCard({ title, summary, children, tone = "paper" }: CuratorCardProps) {
  return (
    <aside className={`${styles.curatorCard} ${styles[tone]}`}>
      <div className={styles.curatorLabel}>Museum curator note</div>
      <h3 className={styles.curatorTitle}>{title}</h3>
      <p className={styles.curatorSummary}>{summary}</p>
      {children ? <div className={styles.curatorDetails}>{children}</div> : null}
    </aside>
  );
}
