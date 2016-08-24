"use strict";

var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');
var net = require('net');

// TODO respect buffers being filled

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
      var messages = [];
      var queuing = true;

      log.info(`${connection.remoteAddress} connected with id ${connectionId}`);

      function sendMessage(message) {
        if (message.type === 'utf8') {
          socket.write(message.utf8Data);
        } else if (message.type === 'binary') {
          socket.write(message.binaryData);
        }
      }

      var socket = net.connect({ port : target.port, host : target.hostname }, () => {
        log.info(`${connectionId} upstream connected`);
        queuing = false;
        messages.forEach(sendMessage);
        messages = undefined;
      });

      connection.on('message', message => {
        if (queuing) {
          messages.push(message);
        } else {
          sendMessage(message);
        }
      });
      socket.on('data', buffer => {
        connection.sendBytes(buffer);
      });
      socket.on('close', () => {
        log.info(`${connectionId} upstream disconnected`);
        connection.close();
      });
      socket.on('error', err => {
        log.error(`${connectionId} error in upstream`, err);
        connection.close();
      });
      connection.on('close', (reasonCode, description) => {
        log.info(`${connectionId} disconnected`);
        socket.end();
      });
      connection.on('error', err => {
        log.error(`${connectionId} error in websocket connection`, err);
        socket.end();
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
