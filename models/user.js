const knex = require(`${__dirname}/../knexfile`).connect;
const uuidv4 = require("uuid/v4");

class User {
  constructor(uuid) {
    this.uuid = uuid || uuidv4();
  }

  // sets an instance variable for the id
  initialize() {
    return new Promise((resolve, reject) => {
      knex("users")
        .select("id")
        .where({ uuid: this.uuid })
        .then(result => {
          this.id = result[0].id;
          resolve();
        })
        .catch(_ => reject(new Error(`user ${this.uuid} does not exist`)));
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      knex("users")
        .insert({ uuid: this.uuid })
        .then(result => {
          this.id = result[0];
          resolve({ id: this.id, uuid: this.uuid });
        })
        .catch(_ => reject(new Error("user already exists")));
    });
  }

  forecasts() {
    return new Promise((resolve, reject) => {
      // const idQuery = knex('users').select('id').where({ uuid: this.uuid})
      knex("forecasts")
        .select("city", "low", "high", "pop")
        .where("user_id", this.id)
        .then(resolve) // array of forecasts
        .catch(_ => reject(new Error("could not fetch forecasts")));
    });
  }

  addForecast(forecast) {
    return new Promise((resolve, reject) => {
      knex("forecasts")
        .insert({
          city: forecast.city,
          low: forecast.low,
          high: forecast.high,
          pop: forecast.pop,
          created_at: new Date(),
          user_id: forecast.user_id
        })
        .then(result => resolve(result[0])) // resolve id number of new forecast
        .catch(e => reject(new Error("unable to add the new forecast")));
    });
  }
}

module.exports = User;
