"use client";

import { useMemo, useState } from "react";
import styles from "./story.module.css";

const FANOUT = 5;
const MAX_ROUNDS = 4;
const RING_RADII = [0, 46, 92, 138, 184];

type Node = { x: number; y: number; ring: number };

/** Lays out each forwarding round as a ring of phones around the sender. */
function buildNodes(rounds: number): Node[] {
  const nodes: Node[] = [{ x: 0, y: 0, ring: 0 }];
  for (let ring = 1; ring <= rounds; ring += 1) {
    const count = FANOUT ** ring;
    const radius = RING_RADII[ring];
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      nodes.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, ring });
    }
  }
  return nodes;
}

export function reachAfter(rounds: number) {
  let total = 1;
  for (let ring = 1; ring <= rounds; ring += 1) total += FANOUT ** ring;
  return total;
}

const RING_COLORS = ["#fff", "#f5a623", "#ffd166", "#9ad1ff", "#c7e8ff"];

export function ForwardChainToy() {
  const [rounds, setRounds] = useState(0);
  const nodes = useMemo(() => buildNodes(rounds), [rounds]);
  const reached = reachAfter(rounds);
  const done = rounds >= MAX_ROUNDS;

  return (
    <div className={styles.forwardToy}>
      <svg
        className={styles.forwardMap}
        viewBox="-200 -200 400 400"
        role="img"
        aria-label={`Illustration: the message has reached ${reached} phones after ${rounds} forwarding rounds`}
      >
        {[1, 2, 3, 4].map((ring) => (
          <circle
            key={ring}
            r={RING_RADII[ring]}
            fill="none"
            stroke="rgba(255,255,255,.18)"
            strokeDasharray="3 5"
          />
        ))}
        {nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={node.ring === 0 ? 14 : node.ring === 1 ? 7 : node.ring === 2 ? 4 : node.ring === 3 ? 2.4 : 1.4}
            fill={RING_COLORS[node.ring]}
            className={styles.forwardNode}
            style={{ animationDelay: `${Math.min(index, 300) * 2}ms` }}
          />
        ))}
        <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1d2b4f">
          YOU
        </text>
      </svg>

      <div className={styles.forwardPanel}>
        <div className={styles.forwardSms}>
          <span>Forwarded · Jan 2001</span>
          <p>People are gathering at EDSA. Verify the news, stay together, and tell your family where you are. Pass this on.</p>
        </div>
        <p className={styles.forwardCount} aria-live="polite">
          <strong>{reached.toLocaleString("en-US")}</strong> {reached === 1 ? "phone has" : "phones have"} the message
          <small>after {rounds} of {MAX_ROUNDS} forwarding rounds</small>
        </p>
        <div className={styles.forwardActions}>
          <button type="button" className={styles.forwardButton} disabled={done} onClick={() => setRounds((value) => value + 1)}>
            {done ? "Everyone got it!" : `Forward to ${FANOUT} friends`}
          </button>
          {rounds > 0 && (
            <button type="button" className={styles.resetLink} onClick={() => setRounds(0)}>
              Start over
            </button>
          )}
        </div>
        <p className={styles.forwardNote}>
          Illustration only: it assumes everyone forwards to five people. Real chains were messier, but just as fast.
        </p>
      </div>
    </div>
  );
}
