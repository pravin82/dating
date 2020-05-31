"use strict";

const session = require("cookie-session");

const sessionConfig = {
  name: "sessionId",
  proxy: true,
  secret: "pravin",
  resave: false,
  saveUninitialized: true
};

module.exports = function() {
  return session(sessionConfig);
};
