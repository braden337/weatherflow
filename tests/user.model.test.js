const User = require("../models/user");

// test users
const hedberg = { uuid: "mitch-hedberg", city: "Saint Paul, Minnesota" };
const hendrix = { uuid: "jimi-hendrix" };
const larry = { uuid: "larry-david" };
const farley = {
  uuid: "chris-farley",
  city: "Madison, Wisconsin",
  low: -10,
  high: -7,
  pop: 0
};
// hedberg has three forecasts, hendrix and farley don't have any

afterAll(() => {
  User.destroyKnex();
});


it("Creates new user and sets uuid and id on the user instance", () => {
  expect.assertions(2);

  let user = new User();

  return user.save().then(() => {
    expect(user.id).toEqual(expect.any(Number));
    expect(user.uuid).toEqual(expect.any(String));
  });
});

it("Throws error when you try to save a user that already exists", () => {
  expect.assertions(1);

  let user = new User(hedberg.uuid);

  return expect(user.save()).rejects.toThrow(/User already exists/);
});

it("Fetches the users forecasts", () => {
  expect.assertions(1);

  let user = new User(hedberg.uuid);

  return expect(user.initialize().then(_ => user.forecasts())).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        city: hedberg.city
      })
    ])
  );
});

it("Only fetches forecasts that belong to the user", () => {
  expect.assertions(1);

  let user = new User(hedberg.uuid);

  return expect(
    user.initialize().then(_ => user.forecasts())
  ).resolves.toHaveLength(3);
});

it("Returns empty array if user has no forecasts", () => {
  expect.assertions(1);

  let user = new User(larry.uuid);

  return expect(
    user.initialize().then(_ => user.forecasts())
  ).resolves.toHaveLength(0);
});

it("Throws error if the user does not exist", () => {
  expect.assertions(1);

  let user = new User("ryan-villopoto");

  return expect(user.initialize().then(_ => user.forecasts())).rejects.toThrow(
    /User ryan-villopoto does not exist/
  );
});

it("Sets the id as an instance variable of a User", () => {
  expect.assertions(1);

  let user = new User(farley.uuid);

  return expect(user.initialize().then(_ => user.id)).resolves.toBe(3);
  // farley's id is 3
});

it("Creates a forecast for a user", () => {
  expect.assertions(1);

  let user = new User(farley.uuid);

  delete farley.uuid;

  return expect(
    user.initialize().then(_ =>
      user.addForecast(
        Object.assign(farley, {
          user_id: user.id
        })
      )
    )
  ).resolves.toEqual(expect.objectContaining(farley));
});
