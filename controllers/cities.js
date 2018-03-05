const Endpoint = require(`${__dirname}/../utilities/Endpoint`);
const router = require("express").Router();

async function postCityInput(req, res) {
  let result;
  let predictions = await Endpoint.placesAutocomplete(req.body.city);

  if (predictions instanceof Error) {
    result = { error: predictions.message };
  } else {
    result = { predictions };
  }
  return res.json(result);
}

// request handling for /cities
router.post("/", postCityInput);

module.exports = { router, postCityInput };
