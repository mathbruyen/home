"use strict";

module.exports = {
  info : function info(message) {
    console.log(`${new Date()} - ${message}`);
  },
  error : function error(message, exception) {
    console.error(`${new Date()} - ${message}`, exception);
  }
};
