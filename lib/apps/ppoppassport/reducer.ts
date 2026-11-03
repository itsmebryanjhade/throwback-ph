import type {
  PpopPassportAction,
  PpopPassportState,
} from "./types";
import { INITIAL_PPOP_PASSPORT_STATE } from "./data";

export function ppopPassportReducer(
  state: PpopPassportState,
  action: PpopPassportAction,
): PpopPassportState {
  switch (action.type) {
    case "SET_TAB": {
      return {
        ...state,
        activeTab: action.tab,
      };
    }

    case "SET_TRAVELER_NAME": {
      const trimmed = action.name.trim();
      return {
        ...state,
        travelerName: trimmed || "Museum Visitor",
      };
    }

    case "SELECT_ERA": {
      return {
        ...state,
        selectedEraId: action.eraId,
      };
    }

    case "SELECT_STAMP": {
      const targetStamp = state.stamps.find((s) => s.id === action.stampId);
      return {
        ...state,
        selectedStampId: action.stampId,
        selectedEraId: targetStamp ? targetStamp.eraId : state.selectedEraId,
      };
    }

    case "COLLECT_STAMP": {
      const updatedStamps = state.stamps.map((stamp) =>
        stamp.id === action.stampId
          ? { ...stamp, isCollected: true, collectedDate: "Stamped Just Now" }
          : stamp,
      );

      const collectedIds = new Set(
        updatedStamps.filter((s) => s.isCollected).map((s) => s.id),
      );

      const updatedRoutes = state.routes.map((route) => ({
        ...route,
        isCompleted: route.stampIds.every((id) => collectedIds.has(id)),
      }));

      return {
        ...state,
        stamps: updatedStamps,
        routes: updatedRoutes,
      };
    }

    case "COMPLETE_ROUTE": {
      const targetRoute = state.routes.find((r) => r.id === action.routeId);
      if (!targetRoute) return state;

      const updatedStamps = state.stamps.map((stamp) =>
        targetRoute.stampIds.includes(stamp.id)
          ? { ...stamp, isCollected: true, collectedDate: "Stamped Just Now" }
          : stamp,
      );

      const collectedIds = new Set(
        updatedStamps.filter((s) => s.isCollected).map((s) => s.id),
      );

      const updatedRoutes = state.routes.map((route) => ({
        ...route,
        isCompleted: route.stampIds.every((id) => collectedIds.has(id)),
      }));

      return {
        ...state,
        stamps: updatedStamps,
        routes: updatedRoutes,
        activeRouteId: action.routeId,
      };
    }

    case "RESET_PASSPORT": {
      return {
        ...INITIAL_PPOP_PASSPORT_STATE,
        travelerName: state.travelerName,
      };
    }

    default:
      return state;
  }
}
