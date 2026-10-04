/**
 * Date and string helpers shared by the server.
 * COMP 4537 - Lab 4
 */
class Utils {
    // Server-side time; never comes from the browser.
    static getDate() {
        return new Date().toString();
    }

    // Replaces %1, %2, ... in the template with the given arguments.
    static format(template, ...args) {
        return template.replace(/%(\d+)/g, (match, index) => {
            const value = args[Number(index) - 1];
            return value === undefined ? match : String(value);
        });
    }

    static escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
}

module.exports = Utils;
