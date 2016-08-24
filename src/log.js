"use strict";

module.exports = {
  info : function info(message) {
    console.log(`${new Date()} - ${message}`);
  },
  error : function error(message, exception) {
    if (exception) {
      console.error(`${new Date()} - ${message}`, exception);
    } else {
      console.error(`${new Date()} - ${message}`);
    }
  }
};
