"use strict";

var log = require('./log');
var targetUrl = process.env.TARGET_URL;
var listenPort = parseInt(process.env.LISTEN_PORT, 10);

require('./proxy').createProxy(listenPort, targetUrl, log)
  .then(
    proxy => log.info(`proxy to ${targetUrl} started on ${proxy.address().port}`),
    err => log.error(`failed to start proxy: ${err}`)
  );
