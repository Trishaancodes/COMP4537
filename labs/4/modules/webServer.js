/**
 * HTTP server and router for the Lab 4 endpoints.
 * COMP 4537 - Lab 4 Parts B and C
 */
const http = require("http");
const path = require("path");
const Utils = require("./utils");
const FileStore = require("./fileStore");
const MESSAGES = require("../lang/en/en");

class WebServer {
    static BASE_PATH = "/COMP4537/labs/4";
    static WRITE_FILE_NAME = "file.txt";

    constructor(port) {
        this.port = port;
        this.fileStore = new FileStore(path.join(__dirname, "..", "files"));
        this.server = http.createServer((req, res) => this.handle(req, res));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(Utils.format(MESSAGES.LISTENING, this.port));
        });
    }

    async handle(req, res) {
        const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
        // Treat /getDate and /getDate/ the same.
        const pathname = url.pathname.replace(/\/+$/, "");

        if (req.method !== "GET") {
            this.send(res, 405, MESSAGES.METHOD_NOT_ALLOWED);
            return;
        }

        try {
            if (pathname === `${WebServer.BASE_PATH}/getDate`) {
                this.getDate(res, url.searchParams);
            } else if (pathname === `${WebServer.BASE_PATH}/writeFile`) {
                await this.writeFile(res, url.searchParams);
            } else if (pathname.startsWith(`${WebServer.BASE_PATH}/readFile/`)) {
                const fileName = decodeURIComponent(pathname.slice(`${WebServer.BASE_PATH}/readFile/`.length));
                await this.readFile(res, fileName);
            } else {
                this.send(res, 404, Utils.format(MESSAGES.ROUTE_NOT_FOUND, url.pathname));
            }
        } catch (error) {
            console.error(error);
            this.send(res, 500, MESSAGES.SERVER_ERROR);
        }
    }

    // Part B: the blue styling is set inline here, on the server.
    getDate(res, params) {
        const name = params.get("name");
        if (!name) {
            this.send(res, 400, MESSAGES.MISSING_NAME);
            return;
        }
        const message = Utils.format(MESSAGES.GREETING, name, Utils.getDate());
        const html = `<p style="color: blue;">${Utils.escapeHtml(message)}</p>`;
        this.send(res, 200, html, "text/html");
    }

    // Part C.1
    async writeFile(res, params) {
        const text = params.get("text");
        if (!text) {
            this.send(res, 400, MESSAGES.MISSING_TEXT);
            return;
        }
        await this.fileStore.append(WebServer.WRITE_FILE_NAME, text);
        this.send(res, 200, Utils.format(MESSAGES.APPENDED, text, WebServer.WRITE_FILE_NAME));
    }

    // Part C.2: text/plain so the browser shows the content instead of downloading it.
    async readFile(res, fileName) {
        const content = await this.fileStore.read(fileName);
        if (content === null) {
            this.send(res, 404, Utils.format(MESSAGES.FILE_NOT_FOUND, fileName));
            return;
        }
        this.send(res, 200, content);
    }

    send(res, status, body, contentType = "text/plain") {
        res.writeHead(status, { "Content-Type": `${contentType}; charset=utf-8` });
        res.end(body);
    }
}

module.exports = WebServer;
