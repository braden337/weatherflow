const { URL } = require("url");
const querystring = require("querystring");

const fetcher = typeof fetch === "undefined" ? require("node-fetch") : fetch;

class Endpoint {
  // hits the Google Places place autocomplete api
  // for city suggestions from the users input
  static async placesAutocomplete(city) {
    let url = new URL(
      "/maps/api/place/autocomplete/json",
      "https://maps.googleapis.com"
    );

    url.search = querystring.stringify({
      types: "(cities)",
      input: city,
      key: process.env.GOOGLE_PLACES_API_KEY || "NO_API_KEY"
    });

    let result;

    try {
      let data = await (await fetcher(url)).json();

      if (data.status == "ZERO_RESULTS") {
        result = new Error(
          "Couldn't find any city suggestions for what you typed in."
        );
      } else {
        let predictions = data.predictions.map(prediction => ({
          name: prediction.description,
          placeid: prediction.place_id
        }));

        result = predictions;
      }
    } catch (_) {
      result = new Error(
        "Unable to access Google Places place autocomplete API"
      );
    }

    return result;
  }

  // hits the Google Places place details api
  // to get the latitude and longitude
  // of the city that the user picked
  static async placesDetails(prediction) {
    let url = new URL(
      "/maps/api/place/details/json",
      "https://maps.googleapis.com"
    );

    url.search = querystring.stringify({
      placeid: prediction.placeid,
      key: process.env.GOOGLE_PLACES_API_KEY || "NO_API_KEY"
    });

    let result;

    try {
      let data = await fetcher(url);
      data = await data.json();
      if (data.status == "OK") {
        result = {
          name: prediction.name,
          location: data.result.geometry.location
        };
      } else {
        result = new Error(
          "Invalid placeid sent to Google Places place details API"
        );
      }
    } catch (_) {
      result = new Error("Unable to access Google Places place details API");
    }
    return result;
  }

  // hits the Wunderground forecast API
  // and processes the forecast that it receives
  static async forecast(place) {
    let url = new URL(
      `/api/${process.env.WUNDERGROUND_API_KEY}/forecast/q/`,
      "http://api.wunderground.com"
    );

    url.pathname += `${place.location.lat},${place.location.lng}.json`;

    const kelvin = celsius => Number.parseInt(celsius) + 273.15;

    let result;

    try {
      let data = await fetcher(url);
      data = await data.json();

      if (data.response.hasOwnProperty("error")) {
        result = new Error(data.response.error.description);
      } else {
        data = data.forecast.simpleforecast.forecastday[0];

        let city = place.name;
        let low = kelvin(data.low.celsius) || -1;
        let high = kelvin(data.high.celsius) || -1;
        let pop = typeof data.pop == "number" ? data.pop : -1;

        result = {
          city,
          low,
          high,
          pop
        };
      }
    } catch (_) {
      result = new Error("Unable to access Wunderground forecast API");
    }
    return result;
  }
}

module.exports = Endpoint;
