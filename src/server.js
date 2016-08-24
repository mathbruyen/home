"use strict";

var log = require('./log');
var createServer = require('./createServer');

var targetUrl = process.env.TARGET_URL;
var listenPort = parseInt(process.env.LISTEN_PORT, 10);

createServer(listenPort, targetUrl, log)
  .then(
    server => log.info(`proxy to ${targetUrl} started on ${server.address().port}`),
    err => log.error(`failed to start proxy: ${err}`)
  );
