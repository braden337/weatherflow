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
  async exists() {
    
  }
  async init() {
    if (this.uuid) {
      let id = await this[getUserId]();
      if (id) {
        this.id = id;
        return this;
      } else {
        throw null;
      }
    } else {
      this.uuid = uuidv4();
      try {
        this.id = await this[save]();
        return this;
      } catch (e) {
        console.log(e);
      }
    }
  }

  async init() {
    if (this.uuid) {
    }
  }

  async [getUserId]() {
    let results = await knex("users")
      .select("id")
      .where({ uuid: this.uuid });

    if (results.length) {
      return results[0].id;
    } else {
      return 0;
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
