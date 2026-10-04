/**
 * Starter: creates the web server and starts listening.
 * COMP 4537 - Lab 4
 */
const WebServer = require("./modules/webServer");

const DEFAULT_PORT = 3000;
new WebServer(process.env.PORT || DEFAULT_PORT).start();
