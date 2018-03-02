exports.up = function(knex, Promise) {
  function createUsersTable() {
    return knex.schema.createTable("users", function(table) {
      table.increments().primary();
      table
        .string("uuid")
        .unique()
        .notNullable();
    });
  }

  function createForecastsTable() {
    return knex.schema.createTable("forecasts", function(table) {
      table.increments("id").primary();
      table.string("city");
      table.float("low");
      table.float("high");
      table.float("pop");
      table.timestamp("created_at");
      table.integer("user_id").unsigned().notNullable();  // .references("users.id")
      table.foreign("user_id").references('id').inTable('users');
    });
  }

  return createUsersTable().then(createForecastsTable);
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("forecasts")
    .then(_ => knex.schema.dropTable("users"));
};
