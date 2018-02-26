require("dotenv").config({ path: `${__dirname}/../.env` });

const httpMocks = require("node-mocks-http");
const Forecast = require("../controllers/forecast").Forecast;

it("Returns the correct number of forecasts that belong to a user as JSON", () => {
  expect.assertions(1);

  let req = httpMocks.createRequest({
    cookies: {
      uuid: "mitch-hedberg"
    }
  });

  let res = httpMocks.createResponse();

  return expect(
    Forecast.getSavedForecasts(req, res).then(_ => JSON.parse(res._getData()))
  ).resolves.toHaveLength(3); // hedberg has 3 forecasts
});

it("Returns JSON error message if no city is provided", () => {
  expect.assertions(1);

  let req = httpMocks.createRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  let res = httpMocks.createResponse();

  return expect(
    Forecast.lookUpCity(req, res)
      .then(_ => JSON.parse(res._getData()))
      .then(json => json.error)
  ).resolves.toMatch(/Must provide a city/);
});

it("Returns JSON error message if the provided city does not exist", () => {
  expect.assertions(1);

  let req = httpMocks.createRequest({
    method: "POST",
    body: {
      city: "xxxyyyzzz"
    },
    headers: {
      "Content-Type": "application/json"
    }
  });

  let res = httpMocks.createResponse();

  return expect(
    Forecast.lookUpCity(req, res)
      .then(_ => JSON.parse(res._getData()))
      .then(json => json.error)
  ).resolves.toMatch(/No cities match your search/);
});

it("Adds forecast for existing user and returns forecast", () => {
  expect.assertions(1);

  let req = httpMocks.createRequest({
    method: "POST",
    cookies: {
      uuid: "jimi-hendrix"
    },
    body: {
      city: "Seattle, Washington"
    },
    headers: {
      "Content-Type": "application/json"
    }
  });

  let res = httpMocks.createResponse();

  return expect(
    Forecast.lookUpCity(req, res).then(_ => JSON.parse(res._getData()))
  ).resolves.toEqual(expect.objectContaining({ city: "Seattle, Washington" }));
});

it("Adds forecast for new user and returns forecast", () => {
  expect.assertions(1);

  let req = httpMocks.createRequest({
    method: "POST",
    body: {
      city: "New York City, New York"
    },
    headers: {
      "Content-Type": "application/json"
    }
  });

  let res = httpMocks.createResponse();

  return expect(
    Forecast.lookUpCity(req, res).then(_ => JSON.parse(res._getData()))
  ).resolves.toEqual(
    expect.objectContaining({ city: "New York City, New York" })
  );
});
