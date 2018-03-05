const uuidv4 = require("uuid/v4");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { uuid: "mitch-hedberg" },
        { uuid: "lynn-shawcroft" },
        { uuid: "jimi-hendrix" },
        { uuid: "chris-farley" },
        { uuid: "larry-david" }
      ]);
    });
};
