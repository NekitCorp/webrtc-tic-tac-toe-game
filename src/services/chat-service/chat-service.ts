import { writable } from "svelte/store";
import type { IChatService } from "./types";

export class ChatService implements IChatService {
    public messages = writable<string[]>([]);

    public addMessage(text: string) {
        this.messages.update((prev) => [
            ...prev,
            `[${new Date().toLocaleString()}] ${text}`,
        ]);
    }
}
