import { museumRooms } from "@/content/museum";
import type { MuseumAction, MuseumState } from "@/lib/museum-state";
import styles from "./museum.module.css";

export function RoomNavigation({ state, dispatch }: { state: MuseumState; dispatch: React.Dispatch<MuseumAction> }) {
  return (
    <div className={styles.roomTabs} role="tablist" aria-label="Museum room navigation">
      {museumRooms.map((room) => (
        <button key={room.id} role="tab" aria-selected={state.activeRoom === room.id} type="button" onClick={() => dispatch({ type: "OPEN_ROOM", roomId: room.id })}>
          {room.shortTitle}
        </button>
      ))}
    </div>
  );
}
