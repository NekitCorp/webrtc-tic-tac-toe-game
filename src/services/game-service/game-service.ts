import { useMachine } from "@xstate/svelte";
import type { Event } from "xstate";
import { createGameMachine } from "./game-machine";
import type {
    GameState,
    IGameService,
    MachineEvents,
    PlayerNumber,
} from "./types";

export class GameService implements IGameService {
    public readonly state: GameState;
    public readonly send: (event: Event<MachineEvents>) => void;

    constructor(private player: PlayerNumber) {
        const { state, send, service } = useMachine(
            createGameMachine(this.player)
        );

        this.state = state;
        this.send = send;

        service.onTransition((state) => {
            console.log("[GAME STATE]", state);
        });
    }
}
