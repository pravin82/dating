const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = (module.exports = express());
const path = require('path')
const cookieParser = require('cookie-parser')

global.__base = __dirname + "/";
const db = require(`${__base}/database/sql`);
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
const PORT = process.env.npm_package_config_port || 4000;
const API_PORT = 3001;
const apiRouter = require(`${__base}/router/router`);
const isProd = 'ENVIRONMENT' in process.env && process.env.ENVIRONMENT === 'prod';


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
if(isProd) {
	corsOptions.origin = 'https://www.shulkpay.com'
}
app.use(cookieParser())

app.use(cors(corsOptions));
if(isProd){
  app.enable('view cache')
}
else {
  app.disable("view cache");
  app.locals.host = "http://dating.test:8080/";
  app.use(apiRouter);
}

app.listen(PORT, async () => {
	console.log("App listening started at port " + PORT);
});
	

app.use((req, res) => {
	return res
		.status(404)
		.send("<h1>Sorry! The path does not exist.</h1>")
		.end();
});
