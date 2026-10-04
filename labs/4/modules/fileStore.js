/**
 * Appends to and reads text files inside a single storage directory.
 * COMP 4537 - Lab 4 Part C
 */
const fs = require("fs/promises");
const path = require("path");

class FileStore {
    constructor(directory) {
        this.directory = directory;
    }

    // appendFile creates the file if it is missing, otherwise adds to the end.
    async append(fileName, text) {
        await fs.mkdir(this.directory, { recursive: true });
        await fs.appendFile(this.resolve(fileName), `${text}\n`, "utf8");
    }

    // Resolves to null when the file does not exist.
    async read(fileName) {
        try {
            return await fs.readFile(this.resolve(fileName), "utf8");
        } catch (error) {
            if (error.code === "ENOENT" || error.code === "EISDIR") {
                return null;
            }
            throw error;
        }
    }

    // basename stops requests like ../../server.js from escaping the directory.
    resolve(fileName) {
        return path.join(this.directory, path.basename(fileName));
    }
}

module.exports = FileStore;
