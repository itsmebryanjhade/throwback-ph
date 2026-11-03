"use client";

import { useCallback, useEffect, useReducer } from "react";
import { loadRecord, saveRecord } from "./storage";
import type { PersistentReducerOptions } from "./types";

export function usePersistentReducer<S, A>(
  reducer: React.Reducer<S, A>,
  initialState: S,
  options: PersistentReducerOptions<S>,
) {
  const { key, version, validate, onStorageError } = options;
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState,
    (fallback) => loadRecord(key, version, validate, fallback).value,
  );
  const dispatch = useCallback(
    (action: A) => reducerDispatch(action),
    [reducerDispatch],
  );

  useEffect(() => {
    const result = saveRecord(key, version, state);
    if (!result.ok) onStorageError?.();
  }, [state, key, version, onStorageError]);

  return [state, dispatch] as const;
}

export function matchesStateShape<T extends object>(sample: T) {
  return (value: unknown): value is T => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const candidate = value as Record<string, unknown>;
    return Object.entries(sample).every(([key, expected]) => {
      const actual = candidate[key];
      if (Array.isArray(expected)) return Array.isArray(actual);
      if (expected === null) return actual === null || typeof actual === "string";
      return typeof actual === typeof expected;
    });
  };
}
