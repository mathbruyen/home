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

function newTcpClient(proxyPort, expected, listener) {
  return new Promise(function (resolve, reject) {
    let received = Buffer.alloc(0);
    const earlyClose = () => reject(new Error('Server closed connection too early'));
    const client = net.connect({ port: proxyPort }, () => listener(client));
    client.on('data', data => {
      received = Buffer.concat([received, data]);
      if (received.toString() === expected) {
        client.end();
        client.removeListener('close', earlyClose);
        client.on('close', resolve);
      }
    });
    client.on('close', earlyClose);
    client.on('error', reject);
  });
}

function newPushServer() {
  return newTcpServer(c => {
    c.write('Hello, push!');
    c.end();
  });
}

function expectPush(proxyPort) {
  return newTcpClient(proxyPort, 'Hello, push!', client => {
  });
}

describe('Proxy', function() {
  describe('server', function() {
    it('should echo back', function() {
      return newTcpServer(c => c.pipe(c)).then(echo => {
        return createServer(0, `tcp://localhost:${echo.address().port}`, log).then(proxyServer => {
          return createProxy(0, 'ws://localhost:' + proxyServer.address().port, {}, log).then(proxyClient => {
            return newTcpClient(proxyClient.address().port, 'Hello, echo!', client => {
              client.write('Hello, echo!');
            }).then(() => {
              echo.close();
              proxyServer.close();
              proxyClient.close();
            });
          });
        });
      });
    });
    it('should push data', function() {
      return newTcpServer(c => {
        c.write('Hello, push!');
        c.end();
      }).then(push => {
        return createServer(0, `tcp://localhost:${push.address().port}`, log).then(proxyServer => {
          return createProxy(0, 'ws://localhost:' + proxyServer.address().port, {}, log).then(proxyClient => {
            return newTcpClient(proxyClient.address().port, 'Hello, push!', client => {}).then(() => {
              push.close();
              proxyServer.close();
              proxyClient.close();
            });
          });
        });
      });
    });
    it('should push large amount of data', function() {
      return newTcpServer(c => {
        c.write('Hello, large push!'.repeat(10000));
        c.end();
      }).then(push => {
        return createServer(0, `tcp://localhost:${push.address().port}`, log).then(proxyServer => {
          return createProxy(0, 'ws://localhost:' + proxyServer.address().port, {}, log).then(proxyClient => {
            return newTcpClient(proxyClient.address().port, 'Hello, large push!'.repeat(10000), client => {}).then(() => {
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
