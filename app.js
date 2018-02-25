require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());

const forecast = require("./controllers/forecast");

app.use("/forecast", forecast.router);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Weatherflow is listening for http requests 🌩🌩🌩️️️");
});
