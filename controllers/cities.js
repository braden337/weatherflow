const Endpoint = require(`${__dirname}/../utilities/Endpoint`);
const router = require("express").Router();

async function fetchCityPredictions(req, res) {
  try {
    let predictions = await Endpoint.placesAutocomplete(req.body.city);
    return res.json({ predictions });
  } catch (e) {
    return res.json({ error: e.message });
  }
}

// request handling for /cities
router.post("/", fetchCityPredictions);

module.exports = { router, fetchCityPredictions };
