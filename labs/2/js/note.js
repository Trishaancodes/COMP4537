/**
 * COMP 4537 - Lab 2
 *
 * AI disclosure: Claude (Anthropic) was used to help write and structure
 * this code. All of it has been reviewed and is understood by the author.
 */

import { MESSAGES } from "../lang/messages/en/user.js";

/**
 * One note in the list: a textarea plus, when editable, its own remove
 * button. Encapsulates its DOM element and the behaviour tied to it,
 * so each note owns its own properties and methods (object constructor
 * / class based note, per the assignment's OOP requirement).
 */
export class Note {
    constructor(container, text, { editable = false, onChange = null, onRemove = null } = {}) {
        this.text = text;
        this.onChange = onChange;
        this.onRemove = onRemove;

        this.wrapper = document.createElement("div");
        this.wrapper.className = "noteRow";

        this.textarea = document.createElement("textarea");
        this.textarea.className = "noteText";
        this.textarea.value = text;
        this.textarea.readOnly = !editable;
        this.wrapper.appendChild(this.textarea);

        if (editable) {
            this.textarea.addEventListener("input", () => this.handleInput());

            this.removeButton = document.createElement("button");
            this.removeButton.type = "button";
            this.removeButton.className = "removeButton";
            this.removeButton.textContent = MESSAGES.BTN_REMOVE;
            this.removeButton.addEventListener("click", () => this.handleRemove());
            this.wrapper.appendChild(this.removeButton);
        }

        container.appendChild(this.wrapper);
    }

    handleInput() {
        this.text = this.textarea.value;
        if (this.onChange) {
            this.onChange();
        }
    }

    handleRemove() {
        this.wrapper.remove();
        if (this.onRemove) {
            this.onRemove(this);
        }
    }
}
