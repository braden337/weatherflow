const Endpoint = require(`${__dirname}/../utilities/Endpoint`);
const router = require("express").Router();

async function fetchCityCoordinates(req, res) {
  try {
    let { name, location } = await Endpoint.placesDetails(
      req.body.prediction
      // a prediction should look like
      // {
      //   name: "Sakarya, Turkey",
      //   placeid: "ChIJn2OO1fqyzBQRIRJPwfgST7g"
      // }
    );
    return res.json({ name, location });
  } catch (e) {
    return res.json({ error: e.message });
  }
}

// request handling for /coordinates
router.post("/", fetchCityCoordinates);

module.exports = { router, fetchCityCoordinates };
