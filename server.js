const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = (module.exports = express());
const path = require('path')
const cookieParser = require('cookie-parser')
global.__base = __dirname + "/";
const session = require(`${__base}/database/session`);
const socketIO = require('socket.io');
const db = require(`${__base}/database/sql`);
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
const PORT = process.env.npm_package_config_port || 4000;
const API_PORT = 3001;
const apiRouter = require(`${__base}/routes/router`);
const isProd = 'ENVIRONMENT' in process.env && process.env.ENVIRONMENT === 'prod';

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cookieParser())
app.use(session());
app.use(cors(corsOptions));
if(isProd){
  app.enable('view cache')
}
else {
  app.disable("view cache");
  app.locals.host = "http://dating.test:8080/";
  app.use(apiRouter);
}

var server = app.listen(PORT, async () => {
	console.log("App listening started at port " + PORT);
});
global.io = socketIO(server);


io.on('connection', function(socket){
 console.log("Socket established with id: " + socket.id);

 socket.on('disconnect', function () {
  console.log("Socket disconnected: " + socket.id);
 });
 socket.on('join', function (userId) {
    socket.join(userId);
});

});







	

app.use((req, res) => {
	return res
		.status(404)
		.send("<h1>Sorry! The path does not exist.</h1>")
		.end();
});
