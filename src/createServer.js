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
      var connection = request.accept('proxy-protocol', request.origin);
      var messages = [];
      var queuing = true;

      log.info(`${connection.remoteAddress} connected`);

      function sendMessage(message) {
        if (message.type === 'utf8') {
          socket.write(message.utf8Data);
        } else if (message.type === 'binary') {
          socket.write(message.binaryData);
        }
      }

      var socket = net.connect({ port : target.port, host : target.hostname }, () => {
        log.info(`upstream for ${connection.remoteAddress} connected`);
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
        log.info(`upstream of ${connection.remoteAddress} disconnected`);
        connection.close();
      });
      socket.on('error', err => {
        log.error(`error in upstream of ${connection.remoteAddress}`, err);
        connection.close();
      });
      connection.on('close', (reasonCode, description) => {
        log.info(`${connection.remoteAddress} disconnected`);
        socket.end();
      });
      connection.on('error', err => {
        log.error(`error in websocket connection with ${connection.remoteAddress}`, err);
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
