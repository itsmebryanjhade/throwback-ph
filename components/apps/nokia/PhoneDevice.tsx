"use client";

import React, { useEffect, useRef } from "react";
import { playKeyClick } from "@/lib/apps/nokia/audio";
import type { PhoneProfile } from "@/lib/apps/nokia/types";
import styles from "./nokia.module.css";

export const KEY_LETTERS: Record<string, string[]> = {
  "1": [".", ",", "?", "!", "-", "1"],
  "2": ["a", "b", "c", "2"],
  "3": ["d", "e", "f", "3"],
  "4": ["g", "h", "i", "4"],
  "5": ["j", "k", "l", "5"],
  "6": ["m", "n", "o", "6"],
  "7": ["p", "q", "r", "s", "7"],
  "8": ["t", "u", "v", "8"],
  "9": ["w", "x", "y", "z", "9"],
  "0": [" ", "0"],
  "*": ["*", "+"],
};

const KEYS: { key: string; sub: string; label: string }[] = [
  { key: "1", sub: ".,?!", label: "Key 1 punctuation" },
  { key: "2", sub: "abc", label: "Key 2 A B C" },
  { key: "3", sub: "def", label: "Key 3 D E F" },
  { key: "4", sub: "ghi", label: "Key 4 G H I" },
  { key: "5", sub: "jkl", label: "Key 5 J K L" },
  { key: "6", sub: "mno", label: "Key 6 M N O" },
  { key: "7", sub: "pqrs", label: "Key 7 P Q R S" },
  { key: "8", sub: "tuv", label: "Key 8 T U V" },
  { key: "9", sub: "wxyz", label: "Key 9 W X Y Z" },
  { key: "*", sub: "+", label: "Key asterisk and plus" },
  { key: "0", sub: "␣", label: "Key 0 space" },
  { key: "#", sub: "Aa1", label: "Key hash: change letter case" },
];

type PhoneDeviceProps = {
  carrier: string;
  balance: number;
  profile: PhoneProfile;
  clock: string;
  softLabel: string;
  onSoft: () => void;
  onBack: () => void;
  onUp: () => void;
  onDown: () => void;
  /** Digit pressed outside of text entry (menus, games). */
  onDigit: (key: string) => void;
  /** When set, digit keys type letters with multi-tap into the message. */
  typing?: {
    mode: "abc" | "ABC" | "123";
    onAppend: (char: string) => void;
    onReplaceLast: (char: string) => void;
    onCycleMode: () => void;
  };
  isMuted: boolean;
  /** Replaces a key's letters with a symbol (e.g. arrows while playing Snake). */
  keyHints?: Record<string, string>;
  children: React.ReactNode;
};

export function PhoneDevice({
  carrier,
  balance,
  profile,
  clock,
  softLabel,
  onSoft,
  onBack,
  onUp,
  onDown,
  onDigit,
  typing,
  isMuted,
  keyHints,
  children,
}: PhoneDeviceProps) {
  const lastKeyRef = useRef<string | null>(null);
  const cycleRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const resetMultiTap = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    lastKeyRef.current = null;
    cycleRef.current = 0;
  };

  const pressKey = (key: string) => {
    playKeyClick(isMuted);
    if (!typing) {
      onDigit(key);
      return;
    }
    if (key === "#") {
      resetMultiTap();
      typing.onCycleMode();
      return;
    }
    if (typing.mode === "123") {
      typing.onAppend(key);
      return;
    }
    const letters = KEY_LETTERS[key] ?? [key];
    const shape = (char: string) => (typing.mode === "ABC" ? char.toUpperCase() : char);
    if (lastKeyRef.current === key && timerRef.current) {
      clearTimeout(timerRef.current);
      cycleRef.current = (cycleRef.current + 1) % letters.length;
      typing.onReplaceLast(shape(letters[cycleRef.current]));
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      lastKeyRef.current = key;
      cycleRef.current = 0;
      typing.onAppend(shape(letters[0]));
    }
    timerRef.current = setTimeout(resetMultiTap, 800);
  };

  const navPress = (action: () => void) => {
    playKeyClick(isMuted);
    resetMultiTap();
    action();
  };

  // Hardware-like keyboard support: arrows scroll, Enter selects, Esc goes back.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const inField = target.tagName === "TEXTAREA" || target.tagName === "INPUT";
    if (event.key === "Escape") {
      event.preventDefault();
      onBack();
      return;
    }
    if (inField) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      onUp();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      onDown();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onDigit("4");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onDigit("6");
    } else if (event.key === "Enter" && target.tagName !== "BUTTON") {
      event.preventDefault();
      onSoft();
    } else if (/^[0-9]$/.test(event.key) && !typing) {
      onDigit(event.key);
    }
  };

  const bars = Math.max(1, Math.min(4, Math.round(balance / 15)));
  const profileIcon = profile === "silent" ? "🔕" : profile === "meeting" ? "📳" : "🔔";

  return (
    <div className={styles.phone} onKeyDown={handleKeyDown} data-testid="nokia-handset-exhibit">
      <div className={styles.phoneTop}>
        <span className={styles.earpiece} aria-hidden="true" />
        <span className={styles.phoneBrand}>TEXTMATE</span>
      </div>

      <div className={styles.lcdBezel}>
        <div className={styles.lcd} data-testid="nokia-lcd">
          <div className={styles.lcdStatus} aria-label={`${carrier} signal, profile ${profile}, load ₱${balance.toFixed(2)}`}>
            <span className={styles.signal} aria-hidden="true">
              {[1, 2, 3, 4].map((bar) => (
                <i key={bar} style={{ height: `${bar * 3 + 2}px` }} />
              ))}
            </span>
            <span>{carrier.toUpperCase()}</span>
            <span className={styles.lcdClock}>{clock}</span>
            <span aria-hidden="true">{profileIcon}</span>
            <span className={styles.battery} aria-hidden="true">
              {[1, 2, 3, 4].map((bar) => (
                <i key={bar} data-on={bar <= bars} />
              ))}
            </span>
          </div>
          <div className={styles.lcdBody}>{children}</div>
          <div className={styles.lcdSoft} aria-hidden="true">
            {softLabel}
          </div>
        </div>
      </div>

      <div className={styles.navCluster}>
        <button type="button" className={styles.cKey} onClick={() => navPress(onBack)} aria-label="C: back or delete">
          C
        </button>
        <button
          type="button"
          className={styles.naviKey}
          onClick={() => navPress(onSoft)}
          aria-label={`Select: ${softLabel}`}
        >
          <span aria-hidden="true">{softLabel}</span>
        </button>
        <div className={styles.rocker}>
          <button type="button" onClick={() => navPress(onUp)} aria-label="Scroll up">
            ▲
          </button>
          <button type="button" onClick={() => navPress(onDown)} aria-label="Scroll down">
            ▼
          </button>
        </div>
      </div>

      <div className={styles.keypad} aria-label="Phone keypad" data-testid="nokia-keypad">
        {KEYS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={styles.key}
            data-hint={keyHints?.[item.key] ? "true" : undefined}
            onClick={() => pressKey(item.key)}
            aria-label={keyHints?.[item.key] ? `${item.label} (steer ${{ "▲": "up", "◀": "left", "▶": "right", "▼": "down" }[keyHints[item.key]] ?? ""})` : item.label}
          >
            <b>{item.key}</b>
            <small>{keyHints?.[item.key] ?? item.sub}</small>
          </button>
        ))}
      </div>

      <div className={styles.phoneChin} aria-hidden="true" />
    </div>
  );
}
