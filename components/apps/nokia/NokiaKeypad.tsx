import React, { useRef } from "react";
import { playKeyClick } from "@/lib/apps/nokia/audio";
import styles from "./nokia.module.css";

type KeypadProps = {
  mode: "abc" | "ABC" | "123";
  isMuted?: boolean;
  onAppendChar: (char: string) => void;
  onReplaceLastChar: (char: string) => void;
  onBackspace: () => void;
  onCycleMode: () => void;
};

const KEY_MAPPINGS: Record<string, string[]> = {
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
  "#": ["#"],
};

export function NokiaKeypad({
  mode,
  isMuted = false,
  onAppendChar,
  onReplaceLastChar,
  onBackspace,
  onCycleMode,
}: KeypadProps) {
  const lastKeyRef = useRef<string | null>(null);
  const cycleIndexRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyPress = (key: string) => {
    playKeyClick(isMuted);

    if (mode === "123") {
      onAppendChar(key);
      return;
    }

    const mapping = KEY_MAPPINGS[key] || [key];

    // Check if cycling same key within multi-tap timeout window (800ms)
    if (lastKeyRef.current === key && timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      cycleIndexRef.current = (cycleIndexRef.current + 1) % mapping.length;
      let char = mapping[cycleIndexRef.current];
      if (mode === "ABC") char = char.toUpperCase();
      onReplaceLastChar(char);
    } else {
      // New key press
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      lastKeyRef.current = key;
      cycleIndexRef.current = 0;
      let char = mapping[0];
      if (mode === "ABC") char = char.toUpperCase();
      onAppendChar(char);
    }

    timeoutRef.current = setTimeout(() => {
      lastKeyRef.current = null;
      cycleIndexRef.current = 0;
      timeoutRef.current = null;
    }, 800);
  };

  const handleClear = () => {
    playKeyClick(isMuted);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    lastKeyRef.current = null;
    onBackspace();
  };

  return (
    <div className={styles.keypadBezel} aria-label="Nokia phone keypad" data-testid="nokia-keypad">
      <div className={styles.keypadActionRow}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={onCycleMode}
          aria-label={`Current input mode: ${mode}. Click to cycle.`}
        >
          Mode: [{mode}]
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => handleKeyPress("0")}
          aria-label="Add space"
        >
          ␣ Space
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleClear}
          aria-label="Clear / Backspace"
        >
          ⌫ Clear
        </button>
      </div>

      <div className={styles.keypadGrid}>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("1")}
          aria-label="Key 1 punctuation"
        >
          <span className={styles.keyNumber}>1</span>
          <span className={styles.keySub}>.,?!</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("2")}
          aria-label="Key 2 A B C"
        >
          <span className={styles.keyNumber}>2</span>
          <span className={styles.keySub}>ABC</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("3")}
          aria-label="Key 3 D E F"
        >
          <span className={styles.keyNumber}>3</span>
          <span className={styles.keySub}>DEF</span>
        </button>

        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("4")}
          aria-label="Key 4 G H I"
        >
          <span className={styles.keyNumber}>4</span>
          <span className={styles.keySub}>GHI</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("5")}
          aria-label="Key 5 J K L"
        >
          <span className={styles.keyNumber}>5</span>
          <span className={styles.keySub}>JKL</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("6")}
          aria-label="Key 6 M N O"
        >
          <span className={styles.keyNumber}>6</span>
          <span className={styles.keySub}>MNO</span>
        </button>

        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("7")}
          aria-label="Key 7 P Q R S"
        >
          <span className={styles.keyNumber}>7</span>
          <span className={styles.keySub}>PQRS</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("8")}
          aria-label="Key 8 T U V"
        >
          <span className={styles.keyNumber}>8</span>
          <span className={styles.keySub}>TUV</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("9")}
          aria-label="Key 9 W X Y Z"
        >
          <span className={styles.keyNumber}>9</span>
          <span className={styles.keySub}>WXYZ</span>
        </button>

        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("*")}
          aria-label="Key asterisk and plus"
        >
          <span className={styles.keyNumber}>*</span>
          <span className={styles.keySub}>+</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("0")}
          aria-label="Key 0 space"
        >
          <span className={styles.keyNumber}>0</span>
          <span className={styles.keySub}>_</span>
        </button>
        <button
          type="button"
          className={styles.keypadBtn}
          onClick={() => handleKeyPress("#")}
          aria-label="Key hash"
        >
          <span className={styles.keyNumber}>#</span>
          <span className={styles.keySub}>Mode</span>
        </button>
      </div>
    </div>
  );
}
