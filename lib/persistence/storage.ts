import type { LoadResult, ResetResult, SaveResult, StoredRecord } from "./types";

const memoryRecords = new Map<string, StoredRecord<unknown>>();

function browserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadRecord<T>(
  key: string,
  version: number,
  validate: (value: unknown) => value is T,
  fallback: T,
): LoadResult<T> {
  const memory = memoryRecords.get(key);
  if (memory?.version === version && validate(memory.value)) {
    return { value: memory.value, source: "memory" };
  }

  const storage = browserStorage();
  if (!storage) return { value: fallback, source: "fallback", error: "unavailable" };

  const raw = storage.getItem(key);
  if (raw === null) return { value: fallback, source: "fallback" };

  try {
    const record = JSON.parse(raw) as Partial<StoredRecord<unknown>>;
    if (record.version !== version) {
      removeRecord(key);
      return { value: fallback, source: "fallback", error: "version" };
    }
    if (!validate(record.value)) {
      removeRecord(key);
      return { value: fallback, source: "fallback", error: "validation" };
    }
    return { value: record.value, source: "storage" };
  } catch {
    removeRecord(key);
    return { value: fallback, source: "fallback", error: "malformed" };
  }
}

export function saveRecord<T>(key: string, version: number, value: T): SaveResult {
  const record: StoredRecord<T> = { version, value };
  try {
    const storage = browserStorage();
    if (!storage) throw new DOMException("unavailable", "SecurityError");
    storage.setItem(key, JSON.stringify(record));
    memoryRecords.delete(key);
    return { ok: true, destination: "storage" };
  } catch (error) {
    memoryRecords.set(key, record);
    return {
      ok: false,
      destination: "memory",
      error: error instanceof DOMException && error.name === "QuotaExceededError" ? "quota" : "unavailable",
    };
  }
}

export function removeRecord(key: string): void {
  memoryRecords.delete(key);
  try {
    browserStorage()?.removeItem(key);
  } catch {
    // Memory has still been cleared; inaccessible browser storage is left untouched.
  }
}

export function removeMuseumRecords(keys: string[]): ResetResult {
  const failed: string[] = [];
  let removed = 0;
  for (const key of keys) {
    try {
      removeRecord(key);
      removed += 1;
    } catch {
      failed.push(key);
    }
  }
  return { removed, failed };
}
