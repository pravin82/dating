"use strict";
let router = (module.exports = require("express").Router());
const cors = require("cors");
const userRoute = require(`${__base}/user/router`);

var corsOptions = {
  credentials: true
}
router.use((req, res, next) => {
  corsOptions['origin'] = req.get('origin')
  next()
}, cors(corsOptions))



router.use("/user", userRoute);

