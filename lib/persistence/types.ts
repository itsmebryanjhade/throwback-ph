export type StoredRecord<T> = { version: number; value: T };

export type LoadResult<T> = {
  value: T;
  source: "storage" | "memory" | "fallback";
  error?: "unavailable" | "malformed" | "version" | "validation";
};

export type SaveResult = {
  ok: boolean;
  destination: "storage" | "memory";
  error?: "unavailable" | "quota";
};

export type ResetResult = { removed: number; failed: string[] };

export type PersistentReducerOptions<T> = {
  key: string;
  version: number;
  validate: (value: unknown) => value is T;
  onStorageError?: () => void;
  /** Adjusts a restored record before first render (e.g. refresh labels from code). */
  hydrate?: (restored: T) => T;
};
