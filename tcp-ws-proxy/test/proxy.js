"use strict";

var assert = require('assert');
var net = require('net');
var Buffer = require('buffer').Buffer;
var debuglog = require('util').debuglog('wsproxy');

var createServer = require('../src/createServer');
var createProxy = require('../src/createProxy');

var log = {
  info : function info(message) {
    debuglog(message);
  },
  error : function error(message, exception) {
    console.error(message, exception);
  }
};

function newTcpServer(listener) {
  return new Promise(function (resolve, reject) {
    const server = net.createServer(listener);
    server.listen(0, err => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
      }
    });
  });
}

function newEchoServer() {
  return newTcpServer(c => c.pipe(c));
}

function expectEcho(proxyPort) {
  return new Promise(function (resolve, reject) {
    var received;
    const client = net.connect({ port: proxyPort }, () => {
      client.write('Hello world!\r\n');
    });
    client.on('data', (data) => {
      received = data.toString();
      client.end();
    });
    client.on('end', () => {
      if (received === 'Hello world!\r\n') {
        resolve();
      } else {
        reject(new Error('Invalid data received: ' + received));
      }
    });
  });
}

function newPushServer() {
  return newTcpServer(c => {
    c.write('Hello push!\r\n');
    c.end();
  });
}

function expectPush(proxyPort) {
  return new Promise(function (resolve, reject) {
    var received;
    const client = net.connect({ port: proxyPort });
    client.on('data', (data) => {
      received = data.toString();
    });
    client.on('end', () => {
      if (received === 'Hello push!\r\n') {
        resolve();
      } else {
        reject(new Error('Invalid data received: ' + received));
      }
    });
  });
}

describe('Proxy', function() {
  describe('server', function() {
    it('should echo back', function() {
      return newEchoServer().then(echo => {
        return createServer(0, `tcp://localhost:${echo.address().port}`, log).then(proxyServer => {
          return createProxy(0, 'ws://localhost:' + proxyServer.address().port, log).then(proxyClient => {
            return expectEcho(proxyClient.address().port).then(() => {
              echo.close();
              proxyServer.close();
              proxyClient.close();
            });
          });
        });
      });
    });
    it('should push data', function() {
      return newPushServer().then(push => {
        return createServer(0, `tcp://localhost:${push.address().port}`, log).then(proxyServer => {
          return createProxy(0, 'ws://localhost:' + proxyServer.address().port, log).then(proxyClient => {
            return expectPush(proxyClient.address().port).then(() => {
              push.close();
              proxyServer.close();
              proxyClient.close();
            });
          });
        });
      });
    });
  });
});
