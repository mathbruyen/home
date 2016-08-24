"use strict";

var log = require('./log');
var createProxy = require('./createProxy');

var targetUrl = process.env.TARGET_URL;
var listenPort = parseInt(process.env.LISTEN_PORT, 10);

createProxy(listenPort, targetUrl, log)
  .then(
    proxy => log.info(`proxy to ${targetUrl} started on ${proxy.address().port}`),
    err => log.error(`failed to start proxy: ${err}`)
  );
