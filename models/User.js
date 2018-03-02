const knex = require(`${__dirname}/../knexfile`).connect;
const uuidv4 = require("uuid/v4");

// private method identifiers
const getUserId = Symbol("getUserId");
const save = Symbol("save");

class User {
  constructor(uuid) {
    this.uuid = uuid;
    this.id = null;
  }

  async init() {
    if (this.uuid) {
      try {
        let id = await this[getUserId]();
        if (id) {
          this.id = id;
          return this;
        } else {
          throw new Error("User doesn't exist, can't get any forecasts");
        }
      } catch (e) {
        return new Error(
          `THIS ERROR WAS THROWN BY user.getUserID() BEING CALLED IN user.init()!\n\n${
            e.message
          }`
        );
      }
    } else {
      this.uuid = uuidv4();
      try {
        this.id = await this[save]();
        return this;
      } catch (e) {
        return new Error(
          `THIS ERROR WAS THROWN BY user.save() BEING CALLED IN user.init()!\n\n${
            e.message
          }`
        );
      }
    }
  }

  async [getUserId]() {
    try {
      let user = await knex("users")
        .select("id")
        .where({ uuid: this.uuid })
        .first();
      return user.id || null;
    } catch (e) {
      return new Error(e.message);
    }
  }

  async [save]() {
    try {
      this.id = (await knex("users").insert({ uuid: this.uuid }))[0];
      return this.id;
    } catch (e) {
      return new Error(e.message);
    }
  }

  async addForecast(forecast) {
    try {
      Object.assign(forecast, { user_id: this.id });
      let id = (await knex("forecasts").insert(forecast))[0];

      return id;
    } catch (e) {
      return new Error("Unable to add the new forecast\n\n" + e.message);
    }
  }

  async forecasts() {
    try {
      let forecasts = await knex("forecasts")
        .select("city", "low", "high", "pop", "created_at")
        .where("user_id", this.id);

      return forecasts;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

module.exports = User;
