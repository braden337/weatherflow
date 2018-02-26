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

  // saves a new user
  save() {
    return new Promise((resolve, reject) => {
      knex("users")
        .insert({ uuid: this.uuid })
        .then(result => {
          this.id = result[0];
          resolve();
        })
        .catch(_ => reject(new Error("user already exists")));
    });
  }

  // gets the forecasts that belong to a user
  forecasts() {
    return new Promise((resolve, reject) => {
      knex("forecasts")
        .select("city", "low", "high", "pop", "created_at")
        .where("user_id", this.id)
        .then(resolve)
        .catch();
      // array of forecasts
    });
  }

  // adds a forecast that belongs to a user
  addForecast(forecast) {
    return new Promise((resolve, reject) => {
      knex("forecasts")
        .insert(forecast)
        .then(result => result[0])
        .then(id => {
          if (id) {
            delete forecast.user_id;
            resolve(forecast);
          }
        })
        // .then(result => resolve(result[0]))
        // resolve id number of new forecast
        .catch(e => reject(new Error("unable to add the new forecast")));
    });
  }
}

module.exports = User;
