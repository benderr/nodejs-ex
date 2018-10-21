"use strict";
const webSocketServer = require('websocket').server;
const http = require('http');


function createSocket({port}) {

    const server = http.createServer(function (request, response) {
        // Not important for us. We're writing WebSocket server,
        // not HTTP server
    });

    server.listen(port, function () {
        console.log((new Date()) + " Server is listening on port "
            + port);
    });

    return new webSocketServer({
        httpServer: server
    });

}

module.exports = createSocket;