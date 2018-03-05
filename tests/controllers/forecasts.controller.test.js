require("dotenv").config({ path: `${__dirname}/../../.env` });

const httpMocks = require("node-mocks-http");

const {
  getForecasts,
  postForecast,
  User
} = require("../../controllers/forecasts");

it("Sends forecasts for user that exists", async () => {
  let req = httpMocks.createRequest({
    cookies: {
      uuid: "mitch-hedberg"
    }
  });

  let res = httpMocks.createResponse();
  let forecasts = await getForecasts(req, res);
  forecasts = JSON.parse(res._getData());

  expect(forecasts.length).toBe(3);
});

it("Sends empty array for user that doesn't have any forecasts", async () => {
  let req = httpMocks.createRequest({
    cookies: {
      uuid: "lynn-shawcroft"
    }
  });

  let res = httpMocks.createResponse();
  await getForecasts(req, res);
  let forecasts = JSON.parse(res._getData());

  expect(forecasts.length).toBe(0);
});

it("Sends forecast after adding the forecast for a user", async () => {
  let req = httpMocks.createRequest({
    method: "POST",
    cookies: {
      uuid: "lynn-shawcroft"
    },
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      prediction: {
        name: "Ontario, CA, USA",
        placeid: "ChIJe2Ld6ts0w4ARkDFY-VrjAwc"
      }
    }
  });

  let res = httpMocks.createResponse();
  await postForecast(req, res);
  let { forecast } = JSON.parse(res._getData());

  expect(forecast.city).toEqual(expect.any(String));
  expect(forecast.low).toEqual(expect.any(Number));
  expect(forecast.high).toEqual(expect.any(Number));
  expect(forecast.pop).toEqual(expect.any(Number));
});

it("Sends error property when a city prediction is not provided", async () => {
  let req = httpMocks.createRequest({
    method: "POST",
    cookies: {
      uuid: "lynn-shawcroft"
    },
    headers: {
      "Content-Type": "application/json"
    }
  });

  let res = httpMocks.createResponse();
  await postForecast(req, res);
  let { error } = JSON.parse(res._getData());

  expect(error).toMatch(/You must choose a suggested city/);
});

it("Sends error property when it receives an invalid placeid", async () => {
  let req = httpMocks.createRequest({
    method: "POST",
    cookies: {
      uuid: "lynn-shawcroft"
    },
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      prediction: {
        name: "Ontario, CA, USA",
        placeid: "dfdgsddf"
      }
    }
  });

  let res = httpMocks.createResponse();
  await postForecast(req, res);
  let { error } = JSON.parse(res._getData());

  expect(error).toMatch(/Invalid placeid/);
});

afterAll(() => {
  User.destroyConnection();
});
