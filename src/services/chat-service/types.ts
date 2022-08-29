import type { Writable } from "svelte/store";

export interface IChatService {
    messages: Writable<string[]>;

    addMessage(text: string): void;
}
