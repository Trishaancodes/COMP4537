/**
 * COMP 4537 - Lab 2: Writer page
 *
 * AI disclosure: Claude (Anthropic) was used to help write and structure
 * this code. All of it has been reviewed and is understood by the author.
 */

import { MESSAGES } from "../lang/messages/en/user.js";
import { Note } from "./note.js";
import { NoteStorage } from "./storage.js";

const SAVE_INTERVAL_MS = 2000;

/**
 * Owns the list of editable notes, keeps them in sync with localStorage
 * and reports the most recent time they were actually saved.
 */
class WriterPage {
    constructor() {
        this.notesContainer = document.getElementById("notesContainer");
        this.addButton = document.getElementById("addButton");
        this.statusTime = document.getElementById("statusTime");
        this.backLink = document.getElementById("backLink");
        this.pageHeading = document.getElementById("pageHeading");

        this.notes = [];
        this.isDirty = false;

        document.title = MESSAGES.WRITER_TITLE;
        this.pageHeading.textContent = MESSAGES.WRITER_HEADING;
        this.addButton.textContent = MESSAGES.BTN_ADD;
        this.backLink.textContent = MESSAGES.BACK_LINK;
        this.statusTime.textContent = MESSAGES.NOT_YET_SAVED;

        this.addButton.addEventListener("click", () => this.addNote(""));

        this.loadExistingNotes();

        // Only ever writes when something actually changed since the last
        // save, rather than blindly touching localStorage every tick.
        setInterval(() => this.saveIfDirty(), SAVE_INTERVAL_MS);
    }

    loadExistingNotes() {
        const savedTexts = NoteStorage.read();
        savedTexts.forEach((text) => this.addNote(text, false));
    }

    addNote(text, markDirty = true) {
        const note = new Note(this.notesContainer, text, {
            editable: true,
            onChange: () => this.markDirty(),
            onRemove: (removedNote) => this.handleNoteRemoved(removedNote)
        });
        this.notes.push(note);
        if (markDirty) {
            this.markDirty();
        }
    }

    handleNoteRemoved(removedNote) {
        this.notes = this.notes.filter((note) => note !== removedNote);
        // Removal is persisted instantly, without waiting for the save cycle.
        this.persist();
    }

    markDirty() {
        this.isDirty = true;
    }

    saveIfDirty() {
        if (!this.isDirty) {
            return;
        }
        this.persist();
    }

    persist() {
        const texts = this.notes.map((note) => note.text);
        NoteStorage.write(texts);
        this.isDirty = false;
        this.updateStatus();
    }

    updateStatus() {
        const time = new Date().toLocaleTimeString();
        this.statusTime.textContent = `${MESSAGES.STORED_AT_PREFIX}${time}`;
    }
}

new WriterPage();
