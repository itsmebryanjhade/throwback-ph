import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadRecord,
  removeMuseumRecords,
  removeRecord,
  saveRecord,
} from "@/lib/persistence/storage";

const KEY = "throwback-ph:test:profile";
const fallback = { theme: "orange", visits: 0 };
const validate = (value: unknown): value is typeof fallback =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as typeof fallback).theme === "string" &&
  typeof (value as typeof fallback).visits === "number";

describe("versioned museum persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    removeRecord(KEY);
  });

  it("loads a valid record", () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, value: { theme: "neon", visits: 4 } }));
    expect(loadRecord(KEY, 1, validate, fallback)).toMatchObject({
      value: { theme: "neon", visits: 4 },
      source: "storage",
    });
  });

  it.each([
    ["malformed JSON", "{"],
    ["wrong version", JSON.stringify({ version: 2, value: fallback })],
    ["failed validation", JSON.stringify({ version: 1, value: { theme: 7 } })],
  ])("resets only the affected record for %s", (_label, stored) => {
    localStorage.setItem(KEY, stored);
    localStorage.setItem("unrelated", "keep-me");
    expect(loadRecord(KEY, 1, validate, fallback).value).toEqual(fallback);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(localStorage.getItem("unrelated")).toBe("keep-me");
  });

  it("retains the current session in memory when storage rejects a save", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    expect(saveRecord(KEY, 1, { theme: "midnight", visits: 8 }).ok).toBe(false);
    setItem.mockRestore();
    expect(loadRecord(KEY, 1, validate, fallback)).toMatchObject({
      value: { theme: "midnight", visits: 8 },
      source: "memory",
    });
  });

  it("selectively removes museum records while preserving unrelated browser data", () => {
    localStorage.setItem("throwback-ph:app:a", "a");
    localStorage.setItem("throwback-ph:app:b", "b");
    localStorage.setItem("other-site", "safe");
    expect(removeMuseumRecords(["throwback-ph:app:a", "throwback-ph:app:b"]).removed).toBe(2);
    expect(localStorage.getItem("other-site")).toBe("safe");
  });
});
