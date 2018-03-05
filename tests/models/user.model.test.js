require("dotenv").config({ path: `${__dirname}/../../.env` });

const User = require("../../models/User");

// database is seeded with 5 users

it("Creates a new user", async () => {
  let { id, uuid } = await User.create();

  expect(id).toBe(6);
  expect(uuid.length).toBeGreaterThan(20);
});

it("Returns the ID of a user that exists", async () => {
  let id = await User.id("chris-farley");
  expect(id).toBe(4);
});

it("Returns 0 for the ID if a user doesn't exist", async () => {
  let id = await User.id("carl-sagan");
  expect(id).toBe(0);
});

it("Returns an array with correct number of forecasts for a user", async () => {
  let hedberg_id = await User.id("mitch-hedberg");
  let forecasts = await User.forecasts(hedberg_id);

  expect(forecasts instanceof Array).toBe(true);
  expect(forecasts.length).toBe(3);
});

it("Returns an empty array if a user doesn't have any forecasts", async () => {
  let hendrix_id = await User.id("jimi-hendrix");
  let forecasts = await User.forecasts(hendrix_id);

  expect(forecasts instanceof Array).toBe(true);
  expect(forecasts.length).toBe(0);
});

it("Adds a forecast for a given user_id", async () => {
  let larry_id = await User.id("larry-david");

  let forecast_id = await User.addForecast(larry_id, {
    city: "Brooklyn, New York",
    low: 273.15,
    high: 280.15,
    pop: 0
  });

  let larrysForecasts = await User.forecasts(larry_id);

  expect(forecast_id).toEqual(expect.any(Number));
  expect(larrysForecasts.length).toBe(1);
});

it("Returns 0 when trying to add a forecast for a user that doesn't exist", async () => {
  let carl_id = await User.id("carl-sagan");

  let forecast_id = await User.addForecast(carl_id, {
    city: "Ithaca, New York",
    low: 266.15,
    high: 273.15,
    pop: 15
  });

  expect(forecast_id).toBe(0);
});

afterAll(() => {
  User.destroyConnection();
});
