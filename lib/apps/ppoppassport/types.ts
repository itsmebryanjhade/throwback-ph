export type PpopTab =
  | "passport"
  | "timeline"
  | "routes"
  | "cultural-notes"
  | "museum-info";

export type CulturalEraId =
  | "era-streetdance"
  | "era-asianovela"
  | "era-birit"
  | "era-earlyidol"
  | "era-modernppop";

export type PassportStamp = {
  id: string;
  eraId: CulturalEraId;
  title: string;
  yearRange: string;
  genre: string;
  icon: string;
  accentColor: string;
  originCity: string;
  historicalFact: string;
  culturalImpact: string;
  sampleSongArchetype: {
    title: string;
    style: string;
    description: string;
  };
  isCollected: boolean;
  collectedDate?: string;
};

export type PpopRoute = {
  id: string;
  title: string;
  description: string;
  stampIds: string[];
  isCompleted: boolean;
};

export type InfluenceNode = {
  id: string;
  name: string;
  region: string;
  contribution: string;
  connectionType: "dance" | "melodrama" | "vocal" | "production";
};

export type PpopPassportState = {
  activeTab: PpopTab;
  travelerName: string;
  travelerNationality: string;
  selectedEraId: CulturalEraId;
  stamps: PassportStamp[];
  selectedStampId: string;
  routes: PpopRoute[];
  activeRouteId: string;
};

export type PpopPassportAction =
  | { type: "SET_TAB"; tab: PpopTab }
  | { type: "SET_TRAVELER_NAME"; name: string }
  | { type: "SELECT_ERA"; eraId: CulturalEraId }
  | { type: "SELECT_STAMP"; stampId: string }
  | { type: "COLLECT_STAMP"; stampId: string }
  | { type: "COMPLETE_ROUTE"; routeId: string }
  | { type: "RESET_PASSPORT" };
