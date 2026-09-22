/**
 * Reads and writes the shared notes array to localStorage as JSON.
 * COMP 4537 - Lab 2
 */
export class NoteStorage {
    static KEY = "comp4537Lab2Notes";

    static read() {
        const raw = localStorage.getItem(NoteStorage.KEY);
        if (!raw) {
            return [];
        }
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    static write(texts) {
        localStorage.setItem(NoteStorage.KEY, JSON.stringify(texts));
    }
}
