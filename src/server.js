"use strict";

var log = require('./log');
var targetUrl = process.env.TARGET_URL;
var listenPort = parseInt(process.env.LISTEN_PORT, 10);

require('./proxy').createServer(listenPort, targetUrl, log)
  .then(
    server => log.info(`proxy to ${targetUrl} started on ${server.address().port}`),
    err => log.error(`failed to start proxy: ${err}`)
  );
