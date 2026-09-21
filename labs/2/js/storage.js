/**
 * Reads and writes the shared notes array to localStorage as JSON.
 * COMP 4537 - Lab 2
 */
export const NOTES_STORAGE_KEY = "comp4537Lab2Notes";

export function readNotesFromStorage() {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
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

export function writeNotesToStorage(texts) {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(texts));
}
