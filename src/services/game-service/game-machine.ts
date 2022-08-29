import { assign, createMachine } from "xstate";
import type { MachineContext, MachineEvents, PlayerNumber } from "./types";

const initialContext: MachineContext = {
    board: Array(9).fill(null),
    currentMove: "x",
    firstPlayerToGo: 1,
    isYourMove: true,
    isYouWin: false,
};

export function createGameMachine(player: PlayerNumber) {
    return createMachine<MachineContext, MachineEvents>(
        {
            id: "tic-tac-toe-machine",
            schema: {},
            initial: "playing",
            context: { ...initialContext, isYourMove: player === 1 },
            states: {
                playing: {
                    on: {
                        "": [
                            { target: "winner", cond: "checkWin" },
                            { target: "draw", cond: "checkDraw" },
                        ],
                        PLAY: [
                            {
                                target: "playing",
                                cond: "isValidMove",
                                actions: "updateBoard",
                            },
                        ],
                    },
                },
                winner: {
                    entry: "setWinner",
                },
                draw: {},
            },
            on: {
                RESET: {
                    target: "playing",
                    actions: "resetGame",
                },
            },
        },
        {
            actions: {
                updateBoard: assign({
                    board: (ctx, e) => {
                        if (e.type === "PLAY") {
                            const updatedBoard = [...ctx.board];
                            updatedBoard[e.value] = ctx.currentMove;
                            return updatedBoard;
                        }
                    },
                    currentMove: (ctx) => (ctx.currentMove === "x" ? "o" : "x"),
                    isYourMove: (ctx) =>
                        player === ctx.firstPlayerToGo
                            ? ctx.currentMove === "o"
                            : ctx.currentMove === "x",
                }),
                resetGame: assign((ctx) => ({
                    ...initialContext,
                    firstPlayerToGo: ctx.firstPlayerToGo === 1 ? 2 : 1,
                    isYourMove: ctx.firstPlayerToGo !== player,
                })),
                setWinner: assign({
                    isYouWin: (ctx) => !ctx.isYourMove,
                }),
            },
            guards: {
                checkWin: (ctx) =>
                    [
                        [0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],
                        [0, 4, 8],
                        [2, 4, 6],
                    ].some(
                        (line) =>
                            line.every((cell) => ctx.board[cell] === "x") ||
                            line.every((cell) => ctx.board[cell] === "o")
                    ),
                checkDraw: (ctx) => ctx.board.every((cell) => cell !== null),
                isValidMove: (ctx, e) =>
                    e.type === "PLAY" && ctx.board[e.value] === null,
            },
        }
    );
}
