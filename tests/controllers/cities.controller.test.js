require("dotenv").config({ path: `${__dirname}/../../.env` });

const httpMocks = require("node-mocks-http");
const { postCityInput } = require("../../controllers/cities");

it("Sends city suggestions for the input", async () => {
  let req = httpMocks.createRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      city: "Ontario"
    }
  });

  let res = httpMocks.createResponse();
  await postCityInput(req, res);
  let { predictions } = JSON.parse(res._getData());

  expect(predictions.length).toBeGreaterThan(2);
});

it("Sends error property when there aren't any city suggestions for the input", async () => {
  let req = httpMocks.createRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      city: "sadfsdfasdf"
    }
  });

  let res = httpMocks.createResponse();
  await postCityInput(req, res);
  let { error } = JSON.parse(res._getData());

  expect(error).toMatch(/Couldn't find any city suggestions/);
});
