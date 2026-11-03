"use client";

import { useState } from "react";
import type { Nominee } from "@/lib/apps/realitytv/types";
import styles from "./realitytv.module.css";

export function NomineePortrait({ nominee }: { nominee: Nominee }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span role="img" aria-label={nominee.portraitAlt}>Portrait unavailable: {nominee.nickname}</span>;
  }

  return (
    <span className={styles.portraitCrop} data-portrait={nominee.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.nomineePortrait}
        src={nominee.portraitSrc}
        alt={nominee.portraitAlt}
        data-portrait={nominee.id}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
