require("dotenv").config({ path: `${__dirname}/.env` });

const knex = require("knex");

const development = (test = {
  client: "mysql",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: `${__dirname}/db/migrations`
  },
  seeds: {
    directory: `${__dirname}/db/seeds`
  }
});

const production = {
  client: "mysql",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: `${__dirname}/db/migrations`
  }
};

const config = { development, test, production };

const connect = knex(config[process.env.NODE_ENV || "development"]);

module.exports = {
  development,
  production,
  connect
};
