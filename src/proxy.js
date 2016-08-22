"use strict";

var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var http = require('http');
var url = require('url');
var net = require('net');

// TODO respect buffers being filled

function createServer(listenPort, targetUrl, log) {
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

function createProxy(listenPort, targetUrl, log) {
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

module.exports.createServer = createServer;
module.exports.createProxy = createProxy;
