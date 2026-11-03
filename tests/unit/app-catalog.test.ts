import { describe, expect, it } from "vitest";
import {
  APP_CATALOG,
  APP_LIST,
  ROOM_FOLDERS,
  ROOM_FOLDER_LIST,
  allAppRegistrations,
  getApp,
  getAppsForRoom,
  getRoomFolder,
  getRoomFolderById,
} from "@/lib/apps/catalog";
import type { AppId } from "@/lib/apps/types";

describe("Phase 2 — Application Catalog & Room Folders", () => {
  it("registers all nine required applications with complete metadata", () => {
    expect(APP_LIST).toHaveLength(9);

    const expectedAppIds: AppId[] = [
      "friendster",
      "nokia-messages",
      "net-cafe",
      "reality-tv-vote",
      "opm-media-player",
      "pinoytube",
      "tv-tambayan",
      "chat-archives",
      "ppop-passport",
    ];

    for (const id of expectedAppIds) {
      const app = APP_CATALOG[id];
      expect(app).toBeDefined();
      expect(app.id).toBe(id);
      expect(app.title.length).toBeGreaterThan(0);
      expect(app.icon.length).toBeGreaterThan(0);
      expect(app.room).toMatch(/^(technology|performance|globalization)$/);

      // Default and minimum dimensions
      expect(app.defaultBounds.width).toBeGreaterThanOrEqual(app.minSize.width);
      expect(app.defaultBounds.height).toBeGreaterThanOrEqual(app.minSize.height);
      expect(app.minSize.width).toBeGreaterThanOrEqual(460);
      expect(app.minSize.height).toBeGreaterThanOrEqual(350);

      // Curatorial museum context
      expect(app.museumContext.years.length).toBeGreaterThan(0);
      expect(app.museumContext.summary.length).toBeGreaterThan(0);
      expect(app.museumContext.whyItMattered.length).toBeGreaterThan(0);
      expect(app.museumContext.sources.length).toBeGreaterThan(0);
    }
  });

  it("designates the three flagship applications correctly", () => {
    expect(APP_CATALOG["friendster"].isFlagship).toBe(true);
    expect(APP_CATALOG["nokia-messages"].isFlagship).toBe(true);
    expect(APP_CATALOG["net-cafe"].isFlagship).toBe(true);

    expect(APP_CATALOG["reality-tv-vote"].isFlagship).toBe(false);
    expect(APP_CATALOG["opm-media-player"].isFlagship).toBe(false);
    expect(APP_CATALOG["pinoytube"].isFlagship).toBe(false);
    expect(APP_CATALOG["tv-tambayan"].isFlagship).toBe(false);
    expect(APP_CATALOG["chat-archives"].isFlagship).toBe(false);
    expect(APP_CATALOG["ppop-passport"].isFlagship).toBe(false);
  });

  it("registers all three room folders with three apps each", () => {
    expect(ROOM_FOLDER_LIST).toHaveLength(3);

    const techFolder = ROOM_FOLDERS["folder-technology"];
    expect(techFolder).toBeDefined();
    expect(techFolder.roomId).toBe("technology");
    expect(techFolder.appIds).toEqual([
      "friendster",
      "nokia-messages",
      "net-cafe",
    ]);

    const perfFolder = ROOM_FOLDERS["folder-performance"];
    expect(perfFolder).toBeDefined();
    expect(perfFolder.roomId).toBe("performance");
    expect(perfFolder.appIds).toEqual([
      "reality-tv-vote",
      "opm-media-player",
      "pinoytube",
    ]);

    const globalFolder = ROOM_FOLDERS["folder-globalization"];
    expect(globalFolder).toBeDefined();
    expect(globalFolder.roomId).toBe("globalization");
    expect(globalFolder.appIds).toEqual([
      "tv-tambayan",
      "chat-archives",
      "ppop-passport",
    ]);
  });

  it("provides helper lookup methods for apps and rooms", () => {
    expect(getApp("friendster")?.title).toBe("Friendster PH");
    expect(getApp("unknown-app")).toBeUndefined();

    expect(getRoomFolder("technology")?.id).toBe("folder-technology");
    expect(getRoomFolderById("folder-performance")?.title).toBe("Performance Folder");

    const techApps = getAppsForRoom("technology");
    expect(techApps).toHaveLength(3);
    expect(techApps.map((a) => a.id)).toEqual([
      "friendster",
      "nokia-messages",
      "net-cafe",
    ]);
  });

  it("supplies complete window registrations for WindowManager", () => {
    // 1 welcome + 1 museum + 3 room folders + 9 apps = 14 registrations
    expect(allAppRegistrations).toHaveLength(14);

    const ids = allAppRegistrations.map((r) => r.id);
    expect(ids).toContain("welcome");
    expect(ids).toContain("museum");
    expect(ids).toContain("folder-technology");
    expect(ids).toContain("folder-performance");
    expect(ids).toContain("folder-globalization");
    expect(ids).toContain("friendster");
    expect(ids).toContain("nokia-messages");
    expect(ids).toContain("net-cafe");
    expect(ids).toContain("reality-tv-vote");
    expect(ids).toContain("opm-media-player");
    expect(ids).toContain("pinoytube");
    expect(ids).toContain("tv-tambayan");
    expect(ids).toContain("chat-archives");
    expect(ids).toContain("ppop-passport");
  });
});
