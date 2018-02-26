const express = require("express");
const fetch = require("node-fetch");
const User = require("../models/user");

const router = express.Router();

class Forecast {
  static getSavedForecasts(req, res) {
    return new Promise((resolve, reject) => {
      let uuid = req.cookies.uuid;

      if (uuid) {
        let user = new User(uuid);
        user
          .initialize()
          .then(_ => user.forecasts())
          .then(forecasts => resolve(res.json(forecasts)))
          .catch(_ => {
            res.clearCookie("uuid");
            resolve(res.json([]));
          });
      } else {
        resolve(res.json([]));
      }
    });
  }

  static lookUpCity(req, res) {
    return new Promise((resolve, reject) => {
      let user = null;
      let uuid = req.cookies.uuid;
      let city = req.body.city;

      function fetchAndSaveForecast(aNewUser) {
        return new Promise((resolve, reject) => {
          Forecast.fetch(city)
            .then(forecast => {
              Object.assign(forecast, {
                user_id: user.id,
                created_at: new Date().valueOf()
              });
              user
                .addForecast(forecast)
                .then(savedForecast => resolve(savedForecast))
                .catch(reject);
            })
            .catch(reject);
        });
      }

      if (uuid && city) {
        user = new User(uuid);
        user
          .initialize()
          .then(_ => fetchAndSaveForecast())
          .then(forecast => resolve(res.json(forecast)))
          .catch(_ => {
            res.clearCookie("uuid");
            resolve(res.json({}));
          });
      } else if (!uuid && city) {
        user = new User();
        user
          .save()
          .then(_ => fetchAndSaveForecast())
          .then(forecast => {
            res.cookie("uuid", user.uuid);
            resolve(res.json(forecast));
          })
          .catch(e => resolve(res.json({ error: e.message })));
      } else {
        resolve(res.json({ error: "Must provide a city to search for" }));
      }
    });
  }

  static fetch(city) {
    const kelvin = celsius => Number.parseInt(celsius) + 273.15;

    const forecastURL = city =>
      `http://api.wunderground.com/api/${
        process.env.WUNDERGROUND_API_KEY
      }/forecast/q/${city}.json`;

    function citySearch(city, search, resolve, reject) {
      return fetch(forecastURL(search))
        .then(res => res.json())
        .then(data => {
          if (data.forecast) {
            let forecast = data.forecast.simpleforecast.forecastday[0];
            resolve({
              city,
              low: kelvin(forecast.low.celsius),
              high: kelvin(forecast.high.celsius),
              pop: forecast.pop
            });
          } else if (data.response.results) {
            citySearch(
              city,
              data.response.results[0].l.substr(3),
              resolve,
              reject
            );
          } else if (data.response.error) {
            reject(new Error(data.response.error.description));
          }
        })
        .catch(_ =>
          reject(new Error("Unable to access 3rd party forecast API"))
        );
    }

    return new Promise((resolve, reject) =>
      citySearch(city, city, resolve, reject)
    );
  }
}

// request handling for /forecast
router.get("/", Forecast.getSavedForecasts);
router.post("/", Forecast.lookUpCity);

module.exports = { router, Forecast };

// to use cookies with the fetch API, use {credentials: 'include'}
