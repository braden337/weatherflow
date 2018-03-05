const knex = require(`${__dirname}/../knexfile`).connect;
const uuidv4 = require("uuid/v4");

class User {
  // Adds a unique UUID to the Users table and
  // returns the new users ID and UUID
  static async create() {
    let uuid,
      id = 0;

    while (!uuid) {
      try {
        uuid = uuidv4();
        id = (await knex("users").insert({ uuid }))[0];
      } catch (e) {
        uuid = 0;
      }
    }

    return { id, uuid };
  }

  // returns the ID of a user with the given UUID
  // or 0 if that UUID isn't in the database
  static async id(uuid) {
    try {
      let results = await knex("users")
        .select("id")
        .where({ uuid });

      return results[0].id;
    } catch (e) {
      return 0;
    }
  }

  // returns an array of forecasts for the given user_id
  static async forecasts(user_id) {
    let results = await knex("forecasts")
      .select("city", "low", "high", "pop", "created_at")
      .where({ user_id });

    return results;
  }

  // Saves a new forecast to the database
  // associated with the given user_id
  static async addForecast(user_id, forecast) {
    try {
      let result = await knex("forecasts").insert({ ...forecast, user_id });
      return result[0];
    } catch (e) {
      return 0;
    }
  }

  static destroyConnection() {
    knex.destroy();
  }
}

module.exports = User;
