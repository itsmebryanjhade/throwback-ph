import { getExhibit, museumRooms, type RoomId } from "@/content/museum";

export type MuseumVisibility = "closed" | "open" | "minimized";
export type TourStatus = "inactive" | "active" | "complete";

export type MuseumState = {
  bootComplete: boolean;
  welcomeOpen: boolean;
  activeRoom: RoomId | null;
  selectedExhibitId: string | null;
  tourStatus: TourStatus;
  museumVisibility: MuseumVisibility;
  startMenuOpen: boolean;
  soundEnabled: boolean;
};

export type MuseumAction =
  | { type: "FINISH_BOOT" }
  | { type: "SKIP_BOOT" }
  | { type: "START_TOUR" }
  | { type: "EXPLORE_FREELY" }
  | { type: "OPEN_WELCOME" }
  | { type: "OPEN_ROOM"; roomId: RoomId }
  | { type: "SELECT_EXHIBIT"; exhibitId: string }
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "CLOSE_MUSEUM" }
  | { type: "MINIMIZE_MUSEUM" }
  | { type: "RESTORE_MUSEUM" }
  | { type: "TOGGLE_START_MENU" }
  | { type: "SET_SOUND"; enabled: boolean };

export const initialMuseumState: MuseumState = {
  bootComplete: false,
  welcomeOpen: false,
  activeRoom: null,
  selectedExhibitId: null,
  tourStatus: "inactive",
  museumVisibility: "closed",
  startMenuOpen: false,
  soundEnabled: false,
};

const tourExhibits = museumRooms.flatMap((room) => room.exhibits);

function openRoom(state: MuseumState, roomId: RoomId): MuseumState {
  const room = museumRooms.find((candidate) => candidate.id === roomId);
  if (!room) return state;
  return {
    ...state,
    welcomeOpen: false,
    activeRoom: roomId,
    selectedExhibitId: room.exhibits[0]?.id ?? null,
    tourStatus: "inactive",
    museumVisibility: "open",
    startMenuOpen: false,
  };
}

export function museumReducer(state: MuseumState, action: MuseumAction): MuseumState {
  switch (action.type) {
    case "FINISH_BOOT":
    case "SKIP_BOOT":
      return { ...state, bootComplete: true, welcomeOpen: true };
    case "START_TOUR": {
      const first = tourExhibits[0];
      return {
        ...state,
        bootComplete: true,
        welcomeOpen: false,
        activeRoom: first.room,
        selectedExhibitId: first.id,
        tourStatus: "active",
        museumVisibility: "open",
        startMenuOpen: false,
      };
    }
    case "EXPLORE_FREELY":
      return { ...state, welcomeOpen: false };
    case "OPEN_WELCOME":
      return { ...state, welcomeOpen: true, startMenuOpen: false };
    case "OPEN_ROOM":
      return openRoom(state, action.roomId);
    case "SELECT_EXHIBIT": {
      const exhibit = getExhibit(action.exhibitId);
      if (!exhibit) return state;
      return {
        ...state,
        activeRoom: exhibit.room,
        selectedExhibitId: exhibit.id,
        museumVisibility: "open",
      };
    }
    case "NEXT": {
      if (state.tourStatus !== "active" || !state.selectedExhibitId) return state;
      const index = tourExhibits.findIndex((exhibit) => exhibit.id === state.selectedExhibitId);
      if (index < 0) return state;
      if (index === tourExhibits.length - 1) return { ...state, tourStatus: "complete" };
      const next = tourExhibits[index + 1];
      return { ...state, activeRoom: next.room, selectedExhibitId: next.id };
    }
    case "PREVIOUS": {
      if (state.tourStatus !== "active" || !state.selectedExhibitId) return state;
      const index = tourExhibits.findIndex((exhibit) => exhibit.id === state.selectedExhibitId);
      if (index <= 0) return state;
      const previous = tourExhibits[index - 1];
      return { ...state, activeRoom: previous.room, selectedExhibitId: previous.id };
    }
    case "MINIMIZE_MUSEUM":
      if (state.museumVisibility !== "open") return state;
      return { ...state, museumVisibility: "minimized" };
    case "RESTORE_MUSEUM":
      if (!state.activeRoom) return state;
      return { ...state, museumVisibility: "open" };
    case "CLOSE_MUSEUM":
      return {
        ...state,
        activeRoom: null,
        selectedExhibitId: null,
        tourStatus: "inactive",
        museumVisibility: "closed",
      };
    case "TOGGLE_START_MENU":
      return { ...state, startMenuOpen: !state.startMenuOpen };
    case "SET_SOUND":
      return { ...state, soundEnabled: action.enabled };
    default:
      return state;
  }
}

export function getTourPosition(
  state: MuseumState,
): { index: number; total: number } | null {
  if (state.tourStatus === "inactive" || !state.selectedExhibitId) return null;
  const index = tourExhibits.findIndex((exhibit) => exhibit.id === state.selectedExhibitId);
  if (index < 0) return null;
  return { index, total: tourExhibits.length };
}
