/**
 * All user-facing text lives here so no string literals appear in the logic.
 * %1 is replaced with the first argument passed to Utils.format().
 * COMP 4537 - Lab 4
 */
const MESSAGES = {
    GREETING: "Hello %1, What a beautiful day. Server current date and time is %2",
    MISSING_NAME: "Please provide a name, e.g. ?name=John",
    MISSING_TEXT: "Please provide text to append, e.g. ?text=BCIT",
    APPENDED: "Appended \"%1\" to %2",
    FILE_NOT_FOUND: "404 Not Found: file \"%1\" does not exist",
    ROUTE_NOT_FOUND: "404 Not Found: %1",
    METHOD_NOT_ALLOWED: "405 Method Not Allowed",
    SERVER_ERROR: "500 Internal Server Error",
    LISTENING: "Server listening on port %1"
};

module.exports = MESSAGES;
