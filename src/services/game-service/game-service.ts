import { useMachine } from "@xstate/svelte";
import type { Readable } from "svelte/store";
import type { Event, State } from "xstate";
import { createGameMachine } from "./game-machine";
import type {
    IGameService,
    MachineContext,
    MachineEvents,
    PlayerNumber,
} from "./types";

export class GameService implements IGameService {
    public readonly state: Readable<State<MachineContext, MachineEvents>>;
    public readonly send: (event: Event<MachineEvents>) => void;

    constructor(private player: PlayerNumber) {
        const { state, send, service } = useMachine(
            createGameMachine(this.player)
        );

        this.state = state;
        this.send = send;

        service.onTransition((state) => {
            console.log(state);
        });
    }
}
