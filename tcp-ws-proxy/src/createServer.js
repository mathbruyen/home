"use strict";

var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');
var net = require('net');
const ConnectionStream = require('./connectionToStream');

module.exports = function createServer(listenPort, targetUrl, log) {
  var target = url.parse(targetUrl);
  return new Promise((resolve, reject) => {
    var server = http.createServer((request, response) => {
      log.info(`received HTTP request for ${request.url}`);
      response.writeHead(404);
      response.end();
    });

    var wsServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
    });

    wsServer.on('request', request => {
      if (request.requestedProtocols.length !== 1 || request.requestedProtocols[0].indexOf('proxy-protocol-') !== 0) {
        log.error(`Invalid protocol requested: ${request.requestedProtocols.join(', ')}`);
        request.reject(400, `Invalid requested protocol`);
        return;
      }

      var connectionId = request.requestedProtocols[0].substring('proxy-protocol-'.length);
      var connection = request.accept(request.requestedProtocols[0], request.origin);
      connection.socket.pause();
      var stream = new ConnectionStream(connection, connectionId, log);

      log.info(`${connection.remoteAddress} connected with id ${connectionId}`);

      var socket = net.connect({ port : target.port, host : target.hostname }, () => {
        log.info(`${connectionId} upstream connected`);
      });

      socket.pipe(stream);
      stream.pipe(socket);

      socket.on('error', err => {
        log.error(`${connectionId} error in upstream`, err);
        connection.close();
      });
      stream.on('error', err => {
        log.error(`${connectionId} error in websocket`, err);
        connection.close();
        socket.end();
      });

      socket.on('close', () => {
        log.info(`${connectionId} upstream disconnected`);
      });
    });

    server.listen(listenPort, err => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
      }
    });
  });
}
