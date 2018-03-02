const knex = require(`${__dirname}/knexfile`).connect;

async function main() {
  let uuid = "mitch-hedberg";
  let user_id = 1;
  let city = "Sakarya";
  let low = 250;
  let high = 270;
  let pop = 10;

  let forecast = { city, low, high, pop };

  // let x = await knex("forecasts").insert(forecast);

  // let x = await knex("forecasts")
  //   .select()
  //   .where({ user_id });
}

// main()
//   .then(console.log)
//   .catch(console.log)
//   .then(knex.destroy);

// GET USER ID
// async function getUserId() {
//   let results = await knex("users")
//     .select("id")
//     .where({ uuid: "mitch-hedberg" });

//   if (results.length) {
//     return results[0].id;
//   } else {
//     return 0;
//   }
// }

// async function run() {
//   let id = await getUserId();
//   console.log(id);
// }

async function run() {
  let result = await knex("forecasts")
    .select("city")
    .whereIn("user_id", function() {
      this.select("id")
        .from("users")
        .where({ uuid: "mitch-hedberg" });
    });

  console.log(result);
}

run();
