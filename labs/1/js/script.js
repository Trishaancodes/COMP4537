/**
 * COMP 4537 - Lab 1: Memory game
 *
 * AI disclosure: Claude (Anthropic) was used to help write and structure
 * this code. All of it has been reviewed and is understood by the author.
 */

import { MESSAGES } from "../lang/messages/en/user.js";

/**
 * One coloured button in the game. Knows its own order number and
 * how to draw, move, hide and reveal itself.
 */
class MemoryButton {
    constructor(order, color) {
        this.order = order;
        this.color = color;
        this.element = document.createElement("button");
        this.element.type = "button";
        this.element.className = "memoryButton";
        this.element.style.backgroundColor = color;
        this.revealOrder();
    }

    revealOrder() {
        this.element.textContent = this.order;
    }

    hideOrder() {
        this.element.textContent = "";
    }

    /** Switches from the flow layout to absolute positioning. */
    detachFromFlow() {
        this.element.classList.add("scattered");
    }

    moveTo(left, top) {
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }

    get width() {
        return this.element.offsetWidth;
    }

    get height() {
        return this.element.offsetHeight;
    }

    setClickable(isClickable, handler) {
        this.element.classList.toggle("clickable", isClickable);
        this.element.onclick = isClickable ? handler : null;
    }
}

/**
 * Owns the collection of buttons: creates them, scrambles them inside the
 * current window, and clears them away.
 */
class ButtonBoard {
    constructor(container) {
        this.container = container;
        this.buttons = [];
        this.colorMax = 256;
    }

    createButtons(count) {
        this.clear();
        for (let i = 1; i <= count; i++) {
            const button = new MemoryButton(i, this.randomColor());
            this.buttons.push(button);
            this.container.appendChild(button.element);
        }
    }

    randomColor() {
        const red = Math.floor(Math.random() * this.colorMax);
        const green = Math.floor(Math.random() * this.colorMax);
        const blue = Math.floor(Math.random() * this.colorMax);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    /** Removes every button from the screen and from memory. */
    clear() {
        this.container.innerHTML = "";
        this.buttons = [];
    }

    /**
     * Reads the window size right now, then drops each button at a random
     * spot that keeps it fully inside the viewport. Overlap is allowed.
     */
    scramble() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        this.buttons.forEach((button) => {
            button.detachFromFlow();
            const maxLeft = Math.max(0, windowWidth - button.width);
            const maxTop = Math.max(0, windowHeight - button.height);
            button.moveTo(
                Math.random() * maxLeft,
                Math.random() * maxTop
            );
        });
    }

    hideAllOrders() {
        this.buttons.forEach((button) => button.hideOrder());
    }

    revealAllOrders() {
        this.buttons.forEach((button) => button.revealOrder());
    }

    setAllClickable(isClickable, handler) {
        this.buttons.forEach((button) => {
            button.setClickable(isClickable, () => handler(button));
        });
    }
}

/**
 * Everything the player sees and types: the label, the input, the Go button
 * and the status message.
 */
class UserInterface {
    constructor() {
        this.label = document.getElementById("countLabel");
        this.input = document.getElementById("countInput");
        this.goButton = document.getElementById("goButton");
        this.messageBox = document.getElementById("message");
        this.minButtons = 3;
        this.maxButtons = 7;

        document.title = MESSAGES.PAGE_TITLE;
        this.label.textContent = MESSAGES.PROMPT_BUTTON_COUNT;
        this.goButton.textContent = MESSAGES.BTN_GO;
    }

    onGo(handler) {
        this.goButton.onclick = handler;
    }

    /** Returns the entered count, or null when the input is not valid. */
    readButtonCount() {
        const raw = this.input.value.trim();
        const value = Number(raw);
        const isValid =
            raw !== "" &&
            Number.isInteger(value) &&
            value >= this.minButtons &&
            value <= this.maxButtons;
        return isValid ? value : null;
    }

    showMessage(text) {
        this.messageBox.textContent = text;
    }

    clearMessage() {
        this.messageBox.textContent = "";
    }
}

/**
 * Runs the game: validates input, times the pause and the scrambles,
 * then checks the player's clicks against the original order.
 */
class MemoryGame {
    constructor(board, ui) {
        this.board = board;
        this.ui = ui;
        this.buttonCount = 0;
        this.nextExpectedOrder = 1;
        this.acceptingClicks = false;
        this.roundId = 0;
        this.msPerSecond = 1000;
        this.scrambleIntervalMs = 2000;
    }

    start() {
        const count = this.ui.readButtonCount();
        if (count === null) {
            this.ui.showMessage(MESSAGES.ERROR_INVALID_INPUT);
            return;
        }

        // Invalidates any timers still running from a previous round.
        this.roundId++;
        this.buttonCount = count;
        this.nextExpectedOrder = 1;
        this.acceptingClicks = false;

        this.ui.clearMessage();
        this.board.createButtons(count);
        this.runScrambleSequence(this.roundId);
    }

    /** Pauses n seconds, scrambles n times 2 seconds apart, then opens play. */
    async runScrambleSequence(roundId) {
        await this.pause(this.buttonCount * this.msPerSecond);
        if (!this.isCurrentRound(roundId)) {
            return;
        }

        for (let i = 0; i < this.buttonCount; i++) {
            this.board.scramble();
            await this.pause(this.scrambleIntervalMs);
            if (!this.isCurrentRound(roundId)) {
                return;
            }
        }

        this.board.hideAllOrders();
        this.acceptingClicks = true;
        this.board.setAllClickable(true, (button) => this.handleClick(button));
    }

    pause(milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    isCurrentRound(roundId) {
        return roundId === this.roundId;
    }

    handleClick(button) {
        if (!this.acceptingClicks) {
            return;
        }

        if (button.order !== this.nextExpectedOrder) {
            this.endGame(MESSAGES.LOSE);
            return;
        }

        button.revealOrder();
        this.nextExpectedOrder++;

        if (this.nextExpectedOrder > this.buttonCount) {
            this.endGame(MESSAGES.WIN);
        }
    }

    endGame(message) {
        this.acceptingClicks = false;
        this.board.revealAllOrders();
        this.board.setAllClickable(false, null);
        this.ui.showMessage(message);
    }
}

// Starting point: the only code outside of a class.
const userInterface = new UserInterface();
const buttonBoard = new ButtonBoard(document.getElementById("buttonArea"));
const memoryGame = new MemoryGame(buttonBoard, userInterface);
userInterface.onGo(() => memoryGame.start());
