import type { Readable } from "svelte/store";
import type { Event, State } from "xstate";

export type PlayerNumber = 1 | 2;
export type Marks = "x" | "o";
export type CellValue = Marks | null;

export type MachineContext = {
    board: CellValue[];
    currentMove: Marks;
    firstPlayerToGo: PlayerNumber;
    isYourMove: boolean;
    isYouWin: boolean;
};

export type MachineEvents = { type: "PLAY"; value: number } | { type: "RESET" };

export type GameState = Readable<State<MachineContext, MachineEvents>>;
export type GameEvent = Event<MachineEvents>;

export interface IGameService {
    state: GameState;

    send: (event: GameEvent) => void;
}
