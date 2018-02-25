const express = require("express");
const router = express.Router();

// request handling for /forecast
router.get("/", retrieveSavedForecasts);
router.post("/", fetchForecast);

function retrieveSavedForecasts(req, res) {
  res.send("weather");
}

function fetchForecast(req, res) {
  res.json({ greeting: "Hello" });
  // this should return the forecast for the city
  // after it
}

module.exports = { router, retrieveSavedForecasts, fetchForecast };

// to use cookies with the fetch API, use {credentials: 'include'}
