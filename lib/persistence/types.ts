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
};
