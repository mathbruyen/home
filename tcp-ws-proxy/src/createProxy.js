"use strict";

var WebSocketClient = require('websocket').client;
var net = require('net');
var uuid = require('node-uuid');

// TODO respect buffers being filled

module.exports = function createProxy(listenPort, targetUrl, log) {
  return new Promise((resolve, reject) => {
    var server = net.createServer(socket => {
      var connectionId = uuid.v1();
      var client = new WebSocketClient();
      var buffers = [];
      var connection;

      log.info(`${socket.remoteAddress}:${socket.remotePort} connected, got id ${connectionId}`);

      function sendBuffer(buffer) {
        connection.sendBytes(buffer);
      }

      client.on('connectFailed', function (err) {
        log.error(`${connectionId} error while connecting websocket`, err);
        socket.end();
      });

      client.on('connect', function(c) {
        log.info(`${connectionId} websocket connection open`);

        connection = c;
        buffers.forEach(sendBuffer);
        buffers = undefined;

        connection.on('error', function (err) {
          log.error(`${connectionId} error in websocket connection`, err);
          socket.end();
        });
        connection.on('close', function() {
          log.info(`${connectionId} websocket connection closed`);
          socket.end();
        });
        connection.on('message', function(message) {
          if (message.type === 'utf8') {
            socket.write(message.utf8Data);
          } else if (message.type === 'binary') {
            socket.write(message.binaryData);
          }
        });
      });

      socket.on('data', function (buffer) {
        if (connection) {
          sendBuffer(buffer);
        } else {
          buffers.push(buffer);
        }
      });
      socket.on('error', function (err) {
        log.error(`${connectionId} socket error`, err);
        if (connection) {
          connection.close();
        } else {
          client.abort();
        }
      });
      socket.on('end', function (err) {
        log.info(`${connectionId} socket closed`);
        if (connection) {
          connection.close();
        } else {
          client.abort();
        }
      });

      client.connect(targetUrl, `proxy-protocol-${connectionId}`);
    });
    server.listen(listenPort, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(server);
      }
    });
  });
}
