import React from "react";
import type {
  PpopPassportAction,
  PpopPassportState,
  PpopRoute,
} from "@/lib/apps/ppoppassport/types";
import { INFLUENCE_NODES } from "@/lib/apps/ppoppassport/data";
import styles from "./ppoppassport.module.css";

type InfluenceRoutesPanelProps = {
  state: PpopPassportState;
  dispatch: React.Dispatch<PpopPassportAction>;
  onRouteChangeToast: (routeTitle: string) => void;
};

export function InfluenceRoutesPanel({
  state,
  dispatch,
  onRouteChangeToast,
}: InfluenceRoutesPanelProps) {
  const handleCompleteRoute = (route: PpopRoute) => {
    dispatch({ type: "COMPLETE_ROUTE", routeId: route.id });
    onRouteChangeToast(route.title);
  };

  return (
    <div className={styles.routesContainer}>
      <div>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#f59e0b" }}>
          🧭 P-pop Cultural Exploration Trails
        </h3>
        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
          Follow curated exploration trails illustrating regional musical and choreographic influences that intersected with Philippine popular performance.
        </p>
      </div>

      {/* Routes List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {state.routes.map((route) => {
          const stops = route.stampIds.map(
            (id) => state.stamps.find((s) => s.id === id)!,
          ).filter(Boolean);

          const isComplete = stops.every((s) => s.isCollected);

          return (
            <div key={route.id} className={styles.routeCard}>
              <div className={styles.routeHeader}>
                <h4 className={styles.routeTitle}>{route.title}</h4>
                <span
                  className={`${styles.stampStatusSeal} ${isComplete ? styles.sealCollected : styles.sealUncollected}`}
                >
                  {isComplete ? "✓ TRAIL COMPLETED" : "IN PROGRESS"}
                </span>
              </div>

              <p style={{ fontSize: "11px", color: "#cbd5e1", margin: 0 }}>
                {route.description}
              </p>

              <div className={styles.routeStopsRow}>
                {stops.map((stop) => (
                  <span
                    key={stop.id}
                    className={`${styles.stopChip} ${stop.isCollected ? styles.stopChipActive : ""}`}
                  >
                    <span>{stop.icon}</span>
                    <span>{stop.title}</span>
                    {stop.isCollected ? " ✓" : ""}
                  </span>
                ))}
              </div>

              {!isComplete && (
                <button
                  type="button"
                  onClick={() => handleCompleteRoute(route)}
                  className={styles.completeRouteBtn}
                >
                  ✨ Complete & Stamp All Trail Stops
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Regional Influence Centers */}
      <div style={{ marginTop: "12px" }}>
        <h4 style={{ fontSize: "14px", color: "#38bdf8", margin: "0 0 4px 0" }}>
          🌏 Regional Cultural Influence Hubs
        </h4>
        <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#94a3b8" }}>
          Curatorial Mapping Note: The regional connections below represent interpretive models of artistic dialogue and media exchange rather than direct linear causality.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          {INFLUENCE_NODES.map((node) => (
            <div
              key={node.id}
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}>
                  {node.name}
                </span>
                <span style={{ fontSize: "9px", color: "#f59e0b", background: "#0f172a", padding: "1px 6px", borderRadius: "10px" }}>
                  {node.region}
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                {node.contribution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
