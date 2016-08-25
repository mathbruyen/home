"use strict";

var fs = require('fs');

var log = require('./log');
var createProxy = require('./createProxy');

var targetUrl = process.env.TARGET_URL;
var listenPort = parseInt(process.env.LISTEN_PORT, 10);

var cert = process.env.CERT_PATH ? fs.readFileSync(process.env.CERT_PATH) : undefined;
var key = process.env.KEY_PATH ? fs.readFileSync(process.env.KEY_PATH) : undefined;

createProxy(listenPort, targetUrl, { cert, key }, log)
  .then(
    proxy => log.info(`proxy to ${targetUrl} started on ${proxy.address().port}`),
    err => log.error(`failed to start proxy: ${err}`)
  );
