"use strict";

var WebSocketClient = require('websocket').client;
var net = require('net');

// TODO respect buffers being filled

module.exports = function createProxy(listenPort, targetUrl, log) {
  return new Promise((resolve, reject) => {
    var server = net.createServer(socket => {
      var address = `${socket.address().address}:${socket.address().port}`;
      var client = new WebSocketClient();
      var buffers = [];
      var connection;

      log.info(`${address} connected`);

      function sendBuffer(buffer) {
        connection.sendBytes(buffer);
      }

      client.on('connectFailed', function (err) {
        log.error(`error while connecting websocket for ${address}`, err);
        socket.end();
      });

      client.on('connect', function(c) {
        log.info(`websocket connection for ${address} open`);

        connection = c;
        buffers.forEach(sendBuffer);
        buffers = undefined;

        connection.on('error', function (err) {
          log.error(`error in websocket connection for ${address}`, err);
          socket.end();
        });
        connection.on('close', function() {
          log.info(`websocket connection for ${address} closed`);
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
        log.error(`socket error for ${address}`, err);
        if (connection) {
          connection.close();
        } else {
          client.abort();
        }
      });
      socket.on('end', function (err) {
        log.info(`socket closed for ${address}`);
        if (connection) {
          connection.close();
        } else {
          client.abort();
        }
      });

      client.connect(targetUrl, 'proxy-protocol');
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
