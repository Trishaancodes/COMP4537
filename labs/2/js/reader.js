/**
 * COMP 4537 - Lab 2: Reader page
 *
 * AI disclosure: Claude (Anthropic) was used to help write and structure
 * this code. All of it has been reviewed and is understood by the author.
 */

import { MESSAGES } from "../lang/messages/en/user.js";
import { Note } from "./note.js";
import { NOTES_STORAGE_KEY, readNotesFromStorage } from "./storage.js";

const POLL_INTERVAL_MS = 2000;

/**
 * Displays the notes the writer page has saved, read-only. Refreshes on a
 * timer and, on top of that, reacts immediately to the "storage" event so
 * a change made in another tab shows up without waiting for the next tick.
 */
class ReaderPage {
    constructor() {
        this.notesContainer = document.getElementById("notesContainer");
        this.statusTime = document.getElementById("statusTime");
        this.backLink = document.getElementById("backLink");
        this.pageHeading = document.getElementById("pageHeading");

        this.lastRenderedTexts = null;

        document.title = MESSAGES.READER_TITLE;
        this.pageHeading.textContent = MESSAGES.READER_HEADING;
        this.backLink.textContent = MESSAGES.BACK_LINK;
        this.statusTime.textContent = MESSAGES.NOT_YET_UPDATED;

        window.addEventListener("storage", (event) => {
            if (event.key === NOTES_STORAGE_KEY) {
                this.refresh();
            }
        });

        this.refresh();
        setInterval(() => this.refresh(), POLL_INTERVAL_MS);
    }

    refresh() {
        const texts = readNotesFromStorage();
        if (this.textsChanged(texts)) {
            this.render(texts);
        }
        this.updateStatus();
    }

    textsChanged(texts) {
        const previous = this.lastRenderedTexts;
        const same =
            previous !== null &&
            texts.length === previous.length &&
            texts.every((text, index) => text === previous[index]);
        return !same;
    }

    render(texts) {
        this.notesContainer.innerHTML = "";
        texts.forEach((text) => new Note(this.notesContainer, text, { editable: false }));
        this.lastRenderedTexts = texts;
    }

    updateStatus() {
        const time = new Date().toLocaleTimeString();
        this.statusTime.textContent = `${MESSAGES.UPDATED_AT_PREFIX}${time}`;
    }
}

new ReaderPage();
