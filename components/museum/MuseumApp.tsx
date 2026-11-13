"use client";

import { useCallback, useReducer } from "react";
import { BootScreen } from "@/components/desktop/BootScreen";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState, museumReducer } from "@/lib/museum-state";

export function MuseumApp() {
  const [state, dispatch] = useReducer(museumReducer, initialMuseumState);
  const finishBoot = useCallback(() => dispatch({ type: "FINISH_BOOT" }), []);
  const skipBoot = useCallback(() => dispatch({ type: "SKIP_BOOT" }), []);

  return (
    <>
      {state.bootComplete ? (
        <DesktopShell state={state} dispatch={dispatch} />
      ) : (
        <BootScreen onFinish={finishBoot} onSkip={skipBoot} />
      )}
    </>
  );
}
