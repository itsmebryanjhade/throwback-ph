export type NomineeStatus = "nominated" | "safe" | "immune";
export type EvictionRisk = "endangered" | "moderate" | "safe";

export type Nominee = {
  id: string;
  name: string;
  nickname: string;
  age: number;
  hometown: string;
  tagline: string;
  archetype: string;
  bio: string;
  voteKeyword: string;
  avatarIcon: string;
  portraitSrc: string;
  portraitAlt: string;
  colorAccent: string;
  status: NomineeStatus;
  currentVotes: number;
  evictionRisk: EvictionRisk;
};

export type VoteRecord = {
  id: string;
  nomineeId: string;
  nomineeName: string;
  keyword: string;
  voteCount: number;
  costPesos: number;
  shortcode: string;
  timestamp: string;
};

export type RealityTvTab =
  | "vote"
  | "standings"
  | "history"
  | "impact"
  | "museum-info";

export type RealityTvState = {
  activeTab: RealityTvTab;
  nominees: Nominee[];
  selectedNomineeId: string | null;
  prepaidLoad: number;
  voteHistory: VoteRecord[];
  shortcode: string;
  costPerVote: number;
  totalSimulatedVotes: number;
  isEvictionNight: boolean;
};

export type RealityTvAction =
  | { type: "SET_TAB"; tab: RealityTvTab }
  | { type: "SELECT_NOMINEE"; nomineeId: string }
  | { type: "CAST_VOTE"; nomineeId: string; voteCount: number }
  | { type: "RELOAD_PREPAID"; amount: number }
  | { type: "SIMULATE_CROWD_SURGE" }
  | { type: "CLEAR_HISTORY" }
  | { type: "RESET_VOTES" };
