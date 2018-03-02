const { URL } = require("url");
const querystring = require("querystring");

const fetcher = typeof fetch === "undefined" ? require("node-fetch") : fetch;

class Endpoint {
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

    try {
      let data = await (await fetcher(url)).json();

      let predictions = data.predictions.map(prediction => ({
        name: prediction.description,
        placeid: prediction.place_id
      }));

      return predictions;
    } catch (_) {
      return new Error("Unable to get place suggestions");
    }
  }

  static async placesDetails(prediction) {
    let url = new URL(
      "/maps/api/place/details/json",
      "https://maps.googleapis.com"
    );

    url.search = querystring.stringify({
      placeid: prediction.placeid,
      key: process.env.GOOGLE_PLACES_API_KEY || "NO_API_KEY"
    });

    try {
      let data = await fetcher(url);
      data = await data.json();
      return {
        name: prediction.name,
        location: data.result.geometry.location
      };
    } catch (_) {
      return new Error("Unable to get coordinates for that place");
    }
  }

  static async forecast(place) {
    let url = new URL(
      `/api/${process.env.WUNDERGROUND_API_KEY}/forecast/q/`,
      "http://api.wunderground.com"
    );

    url.pathname += `${place.location.lat},${place.location.lng}.json`;

    const kelvin = celsius => Number.parseInt(celsius) + 273.15;

    try {
      let data = await fetcher(url);
      data = await data.json();

      data = data.forecast.simpleforecast.forecastday[0];

      let city = place.name;
      let low = kelvin(data.low.celsius) || -1;
      let high = kelvin(data.high.celsius) || -1;
      let pop = typeof data.pop == "number" ? data.pop : -1;

      return {
        city,
        low,
        high,
        pop
      };
    } catch (_) {
      return new Error("Unable to get a forecast for that location");
    }
  }
}

module.exports = Endpoint;
