const knex = require("knex");

const development = (test = {
  client: "sqlite3",
  connection: {
    filename: `${__dirname}/db/dev.sqlite3`
  },
  useNullAsDefault: true,
  migrations: {
    directory: `${__dirname}/db/migrations`
  },
  seeds: {
    directory: `${__dirname}/db/seeds`
  }
});

const production = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: `${__dirname}/db/migrations`
  }
};

const config = { development, test, production };

const connect = knex(config[process.env.NODE_ENV || "development"]);

module.exports = {
  development,
  test,
  production,
  connect
};
