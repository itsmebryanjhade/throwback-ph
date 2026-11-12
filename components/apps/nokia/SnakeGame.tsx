"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./nokia.module.css";

export const SNAKE_COLS = 18;
export const SNAKE_ROWS = 11;
const TICK_MS = 200;

export type Direction = "up" | "down" | "left" | "right";
type Cell = { x: number; y: number };
export type SnakeStatus = "ready" | "playing" | "paused" | "over";

const OPPOSITE: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
const STEP: Record<Direction, Cell> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

const START: Cell[] = [
  { x: 6, y: 5 },
  { x: 5, y: 5 },
  { x: 4, y: 5 },
];

/** Moves the snake one cell, wrapping around the edges like the classic game. */
export function advanceSnake(snake: Cell[], dir: Direction, food: Cell) {
  const head = snake[0];
  const next = {
    x: (head.x + STEP[dir].x + SNAKE_COLS) % SNAKE_COLS,
    y: (head.y + STEP[dir].y + SNAKE_ROWS) % SNAKE_ROWS,
  };
  const ate = next.x === food.x && next.y === food.y;
  const body = ate ? snake : snake.slice(0, -1);
  const crashed = body.some((cell) => cell.x === next.x && cell.y === next.y);
  return { snake: [next, ...body], ate, crashed };
}

function placeFood(snake: Cell[]): Cell {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const cell = { x: Math.floor(Math.random() * SNAKE_COLS), y: Math.floor(Math.random() * SNAKE_ROWS) };
    if (!snake.some((part) => part.x === cell.x && part.y === cell.y)) return cell;
  }
  return { x: 0, y: 0 };
}

export type SnakeApi = { turn: (dir: Direction) => void; primary: () => void };

export function SnakeGame({
  best,
  onScore,
  onStatusChange,
  apiRef,
}: {
  best: number;
  /** Called whenever the score changes, so leaving mid-game still saves it. */
  onScore: (score: number) => void;
  onStatusChange?: (status: SnakeStatus) => void;
  apiRef: React.MutableRefObject<SnakeApi | null>;
}) {
  const [snake, setSnake] = useState<Cell[]>(START);
  const [food, setFood] = useState<Cell>({ x: 12, y: 5 });
  const [status, setStatus] = useState<SnakeStatus>("ready");
  const [score, setScore] = useState(0);
  const dirRef = useRef<Direction>("right");
  const queuedRef = useRef<Direction>("right");

  const updateStatus = useCallback(
    (next: SnakeStatus) => {
      setStatus(next);
      onStatusChange?.(next);
    },
    [onStatusChange],
  );

  // A freshly opened game always starts at "ready", whatever the last game did.
  useEffect(() => {
    onStatusChange?.("ready");
  }, [onStatusChange]);

  const start = useCallback(() => {
    setSnake(START);
    setFood({ x: 12, y: 5 });
    setScore(0);
    dirRef.current = "right";
    queuedRef.current = "right";
    updateStatus("playing");
  }, [updateStatus]);

  useEffect(() => {
    apiRef.current = {
      turn: (dir) => {
        if (status !== "playing") return;
        if (dir !== OPPOSITE[dirRef.current]) queuedRef.current = dir;
      },
      primary: () => {
        if (status === "playing") updateStatus("paused");
        else if (status === "paused") updateStatus("playing");
        else start();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, start, status, updateStatus]);

  // Arrow keys / WASD steer from anywhere while the game is on screen, so
  // players don't have to click the phone first.
  useEffect(() => {
    const keyDirs: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return; // the phone already handled it
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const dir = keyDirs[event.key];
      if (dir) {
        event.preventDefault();
        if (status === "ready" || status === "over") start();
        else if (status === "playing" && dir !== OPPOSITE[dirRef.current]) queuedRef.current = dir;
      } else if (event.key === " " || event.key === "p") {
        event.preventDefault();
        apiRef.current?.primary();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [apiRef, start, status]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setTimeout(() => {
      dirRef.current = queuedRef.current;
      const result = advanceSnake(snake, dirRef.current, food);
      if (result.crashed) {
        updateStatus("over");
        return;
      }
      setSnake(result.snake);
      if (result.ate) {
        setScore(score + 1);
        onScore(score + 1);
        setFood(placeFood(result.snake));
      }
    }, TICK_MS);
    return () => window.clearTimeout(timer);
  }, [status, snake, food, score, onScore, updateStatus]);

  return (
    <div className={styles.snake}>
      <div className={styles.snakeHud}>
        <span>Score {score}</span>
        <span>Best {Math.max(best, score)}</span>
      </div>
      <svg
        className={styles.snakeBoard}
        viewBox={`0 0 ${SNAKE_COLS} ${SNAKE_ROWS}`}
        role="img"
        aria-label={`Snake game board. Score ${score}.`}
      >
        <rect x="0" y="0" width={SNAKE_COLS} height={SNAKE_ROWS} fill="none" stroke="currentColor" strokeWidth="0.08" />
        <rect x={food.x + 0.25} y={food.y + 0.25} width="0.5" height="0.5" fill="currentColor" />
        {snake.map((cell, index) => (
          <rect
            key={`${cell.x}-${cell.y}-${index}`}
            x={cell.x + 0.06}
            y={cell.y + 0.06}
            width="0.88"
            height="0.88"
            fill="currentColor"
          />
        ))}
      </svg>
      {status !== "playing" && (
        <p className={styles.snakeMessage} role="status">
          {status === "ready" && (
            <>
              Snake II · Press Start
              <small>Steer: ◀ 4 · 6 ▶ · ▲ 2 · 8 ▼ or arrow keys</small>
            </>
          )}
          {status === "paused" && "Paused"}
          {status === "over" && `Game over! Score ${score}`}
        </p>
      )}
    </div>
  );
}
