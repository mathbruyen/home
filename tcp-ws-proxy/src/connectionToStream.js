const Duplex = require('stream').Duplex;

// TODO auto-prefix id in log

class ConnectionStream extends Duplex {

  constructor(connection, id, log) {
    super({});
    this._connection = connection;
    this._id = id;
    this._log = log;
    connection.on('message', message => {
      if (message.type !== 'binary') {
        this._log.error(`${this._id} text message received: ${message.utf8Data}`);
      } else if (!this.push(message.binaryData)) {
        this._connection.socket.pause();
      }
    });
    connection.on('close', (reasonCode, description) => {
      log.info(`${this._id} websocket connection closed: ${reasonCode} - ${description}`);
      this.push(null);
    });
    connection.on('error', err => {
      this.emit('error', err);
    });
  }

  _write(chunk, encoding, callback) {
    this._connection.sendBytes(chunk, callback);
  }

  _read(size) {
    this._connection.socket.resume();
  }

}

module.exports = ConnectionStream;
