"use strict";

var WebSocketClient = require('websocket').client;
var net = require('net');
var uuid = require('node-uuid');
const ConnectionStream = require('./connectionToStream');

module.exports = function createProxy(listenPort, targetUrl, tlsOptions, log) {
  return new Promise((resolve, reject) => {
    var server = net.createServer(socket => {
      socket.pause();

      var config = {
        tlsOptions : tlsOptions || {}
      };

      var connectionId = uuid.v1();
      var client = new WebSocketClient(config);
      var connection;

      log.info(`${socket.remoteAddress}:${socket.remotePort} connected, got id ${connectionId}`);

      client.on('connectFailed', function (err) {
        log.error(`${connectionId} error while connecting websocket`, err);
        socket.end();
      });

      client.on('connect', function(c) {
        connection = c;
        connection.socket.pause();
        log.info(`${connectionId} websocket connection open`);

        let stream = new ConnectionStream(connection, connectionId, log);

        stream.pipe(socket);
        socket.pipe(stream);

        socket.resume();

        stream.on('error', err => {
          log.error(`${connectionId} error in websocket connection`, err);
          socket.end();
        });
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
        if (!connection) {
          log.info(`${connectionId} socket closed`);
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
