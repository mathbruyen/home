# Websocket proxy for TCP connections

```
                  ----------                        ----------
? <-- tcp --> 123 | client | ? <-- websocket --> 80 | server | ? <-- tcp --> 456
                  ----------                        ----------
```

Starting:

```
TARGET_URL=tcp://localhost:80 LISTEN_PORT=8081 npm run server
TARGET_URL=http://localhost:8081 LISTEN_PORT=8080 npm run client
```

## Dev

Run tests with `npm test`. Test runner is [Mocha](https://mochajs.org/).

Main dependency is [websocket](https://www.npmjs.com/package/websocket) ([docs here](https://github.com/theturtle32/WebSocket-Node/tree/master/docs)). Each connection is assigned a UUID transmitted to the server through websocket protocol negotiation that allows correlating log entries.
