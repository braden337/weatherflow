exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("forecasts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("forecasts").insert([
        {
          city: "Saint Paul, Minnesota",
          low: 275.15,
          high: 283.15,
          pop: 15,
          user_id: 1
        },
        {
          city: "Ontario, California",
          low: 280.15,
          high: 285.15,
          pop: 0,
          user_id: 1
        },
        {
          city: "Montreal, Canada",
          low: 274.15,
          high: 268.15,
          pop: 70,
          user_id: 1
        }
      ]);
    });
};
