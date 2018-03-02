const User = require(`${__dirname}/../models/User`);
const Endpoint = require(`${__dirname}/../utilities/Endpoint`);
const router = require("express").Router();

async function getForecasts(req, res) {
  let uuid = req.cookies.uuid;

  try {
    let user = await new User(uuid).init();
    if (typeof user.id === "undefined") console.log("it doesnot exist");
    if (user.id) {
      res.cookie("uuid", user.uuid, {
        httpOnly: true,
        secure: !!process.env.NODE_ENV,
        expires: new Date(Date.now() + 10 * 365 * 8.64e7)
      });
    }
    let forecasts = await user.forecasts();
    res.json(forecasts);
  } catch (e) {
    return res.json({ error: "hellooooo" + e.message });
  }
}

async function postForecast(req, res) {
  let uuid = req.cookies.uuid;

  let place = req.body.place;
  // a place should look like
  // {
  //   city: "Sakarya, Turkey",
  //   location: { lat: 49.848471, lng: -99.9500904 }
  // }
  let user = await new User(uuid).init();

  try {
    let forecast = await Endpoint.forecast(place);

    let id = await user.addForecast(forecast);

    return res.json(forecast);
  } catch (e) {
    return res.json({ error: e.message });
  }
}

// request handling for /forecast
router.get("/", getForecasts);
router.post("/", postForecast);

module.exports = { router, getForecasts, postForecast };
