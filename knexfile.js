const knex = require("knex");

const development = (test = {
  client: "sqlite3",
  connection: {
    filename: `${__dirname}/dev.sqlite3`
  },
  useNullAsDefault: true,
  seeds: {
    directory: `${__dirname}/seeds`
  }
});

const production = {
  client: "mysql",
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
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
