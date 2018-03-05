require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

if (!process.env.NODE_ENV) {
  app.use(express.static("public"));
}

app.use(bodyParser.json());
app.use(cookieParser());

const forecasts = require("./controllers/forecasts");
const cities = require("./controllers/cities");

app.use("/forecasts", forecasts.router);
app.use("/cities", cities.router);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("Weatherflow is listening for http requests 🌩🌩🌩️️️");
});
