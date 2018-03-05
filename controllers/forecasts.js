const User = require(`${__dirname}/../models/User`);
const Endpoint = require(`${__dirname}/../utilities/Endpoint`);
const router = require("express").Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !!process.env.NODE_ENV,
  expires: new Date(Date.now() + 10 * 365 * 8.64e7)
};

async function getForecasts(req, res) {
  let result = [];
  let { uuid } = req.cookies;

  if (uuid) {
    let id = await User.id(uuid);
    if (id) {
      result = await User.forecasts(id);
    }
  }

  return res.json(result);
}

async function postForecast(req, res) {
  let result;
  let { uuid } = req.cookies;
  let prediction = req.body.prediction;

  if (prediction) {
    let place = await Endpoint.placesDetails(prediction);

    if (place instanceof Error) {
      result = { error: place.message };
    } else {
      let forecast = await Endpoint.forecast(place);

      if (forecast instanceof Error) {
        result = { error: forecast.message };
      } else {
        let id = await User.id(uuid);

        if (id) {
          await User.addForecast(id, forecast);
        } else {
          let user = await User.create();
          await User.addForecast(user.id, forecast);
          res.cookie("uuid", user.uuid, COOKIE_OPTIONS);
        }

        result = { forecast };
      }
    }
  } else {
    result = { error: "You must choose a suggested city." };
  }
  return res.json(result);
}

// request handling for /forecasts
router.get("/", getForecasts);
router.post("/", postForecast);

module.exports = { router, getForecasts, postForecast, User };
