import type { Nominee, RealityTvAction, RealityTvState, VoteRecord } from "./types";
import { INITIAL_REALITY_TV_STATE } from "./data";

function recalculateRisks(nominees: Nominee[]): Nominee[] {
  // Only nominated housemates can be endangered
  const nominated = nominees.filter((n) => n.status === "nominated");
  if (nominated.length === 0) return nominees;

  // Sort by votes ascending (lowest votes = most at risk)
  const sorted = [...nominated].sort((a, b) => a.currentVotes - b.currentVotes);
  const lowestId = sorted[0]?.id;
  const secondLowestId = sorted[1]?.id;

  return nominees.map((nom) => {
    if (nom.status !== "nominated") {
      return { ...nom, evictionRisk: "safe" as const };
    }
    if (nom.id === lowestId) {
      return { ...nom, evictionRisk: "endangered" as const };
    }
    if (nom.id === secondLowestId) {
      return { ...nom, evictionRisk: "moderate" as const };
    }
    return { ...nom, evictionRisk: "safe" as const };
  });
}

export function realityTvReducer(
  state: RealityTvState,
  action: RealityTvAction,
): RealityTvState {
  switch (action.type) {
    case "SET_TAB": {
      return {
        ...state,
        activeTab: action.tab,
      };
    }

    case "SELECT_NOMINEE": {
      return {
        ...state,
        selectedNomineeId: action.nomineeId,
      };
    }

    case "CAST_VOTE": {
      const nominee = state.nominees.find((n) => n.id === action.nomineeId);
      if (!nominee) return state;

      const totalCost = state.costPerVote * action.voteCount;
      if (state.prepaidLoad < totalCost) {
        return state; // Insufficient prepaid load
      }

      const updatedNominees = state.nominees.map((n) => {
        if (n.id === action.nomineeId) {
          return {
            ...n,
            currentVotes: n.currentVotes + action.voteCount,
          };
        }
        return n;
      });

      const updatedWithRisks = recalculateRisks(updatedNominees);

      const newRecord: VoteRecord = {
        id: `vote-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        nomineeId: nominee.id,
        nomineeName: nominee.name,
        keyword: nominee.voteKeyword,
        voteCount: action.voteCount,
        costPesos: totalCost,
        shortcode: state.shortcode,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      return {
        ...state,
        prepaidLoad: Math.max(0, state.prepaidLoad - totalCost),
        totalSimulatedVotes: state.totalSimulatedVotes + action.voteCount,
        nominees: updatedWithRisks,
        voteHistory: [newRecord, ...state.voteHistory],
      };
    }

    case "RELOAD_PREPAID": {
      return {
        ...state,
        prepaidLoad: state.prepaidLoad + action.amount,
      };
    }

    case "SIMULATE_CROWD_SURGE": {
      // Simulate sudden influx of votes across all nominees during eviction night
      const surgeDistributions: Record<string, number> = {
        "nom-bea": 260,
        "nom-kiko": 240,
        "nom-joma": 450, // Fans rally to save Joma
        "nom-patty": 180,
        "nom-chen": 210,
      };

      const updatedNominees = state.nominees.map((n) => ({
        ...n,
        currentVotes: n.currentVotes + (surgeDistributions[n.id] || 150),
      }));

      const addedTotal = Object.values(surgeDistributions).reduce((a, b) => a + b, 0);

      return {
        ...state,
        nominees: recalculateRisks(updatedNominees),
        totalSimulatedVotes: state.totalSimulatedVotes + addedTotal,
      };
    }

    case "CLEAR_HISTORY": {
      return {
        ...state,
        voteHistory: [],
      };
    }

    case "RESET_VOTES": {
      return INITIAL_REALITY_TV_STATE;
    }

    case "ADD_CROWD_VOTES": {
      const added = Object.values(action.votes).reduce((sum, value) => sum + value, 0);
      return {
        ...state,
        nominees: recalculateRisks(
          state.nominees.map((n) => ({ ...n, currentVotes: n.currentVotes + (action.votes[n.id] ?? 0) })),
        ),
        totalSimulatedVotes: state.totalSimulatedVotes + added,
      };
    }

    case "SEND_GM": {
      const nominee = state.nominees.find((n) => n.id === action.nomineeId);
      if (!nominee || state.prepaidLoad < action.costPesos) return state;
      const record: VoteRecord = {
        id: `gm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        nomineeId: nominee.id,
        nomineeName: nominee.name,
        keyword: `GM: ${nominee.voteKeyword} (textmates)`,
        voteCount: action.bonusVotes,
        costPesos: action.costPesos,
        shortcode: "Phonebook",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return {
        ...state,
        prepaidLoad: Math.max(0, state.prepaidLoad - action.costPesos),
        nominees: recalculateRisks(
          state.nominees.map((n) => (n.id === nominee.id ? { ...n, currentVotes: n.currentVotes + action.bonusVotes } : n)),
        ),
        totalSimulatedVotes: state.totalSimulatedVotes + action.bonusVotes,
        voteHistory: [record, ...state.voteHistory],
      };
    }

    case "NEW_EPISODE": {
      return {
        ...state,
        nominees: INITIAL_REALITY_TV_STATE.nominees,
        totalSimulatedVotes: INITIAL_REALITY_TV_STATE.totalSimulatedVotes,
      };
    }

    default:
      return state;
  }
}
