exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("forecasts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("forecasts").insert([
        {
          city: "Saint Paul, Minnesota",
          low: 2,
          high: 10,
          pop: 15,
          created_at: new Date(),
          user_id: 1
        },
        {
          city: "Ontario, California",
          low: 7,
          high: 12,
          pop: 0,
          created_at: new Date(),
          user_id: 1
        },
        {
          city: "Montreal, Canada",
          low: 1,
          high: -5,
          pop: 70,
          created_at: new Date(),
          user_id: 1
        }
      ]);
    });
};
