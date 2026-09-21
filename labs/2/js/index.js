/**
 * COMP 4537 - Lab 2: Landing page
 *
 * AI disclosure: Claude (Anthropic) was used to help write and structure
 * this code. All of it has been reviewed and is understood by the author.
 */

import { MESSAGES } from "../lang/messages/en/user.js";

document.title = MESSAGES.INDEX_HEADING;
document.getElementById("pageHeading").textContent = MESSAGES.INDEX_HEADING;
document.getElementById("writerLink").textContent = MESSAGES.WRITER_LINK;
document.getElementById("readerLink").textContent = MESSAGES.READER_LINK;
