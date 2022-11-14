const app = require(`../app.js`);
const request = require("supertest");
const db = require("../db/connection.js");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("Handling erros", () => {
    test("404: responds with an error when passed a non valid end point", () => {
      return request(app)
        .get("/api/non-valid")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("End point not found");
        });
    });
  });

describe("GET /api/topics", () => {
    test("return status 200 when successful", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
    test("return an object with the expected values", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          const topicsArray = body.topics;
          expect(topicsArray).toHaveLength(3);
  
          topicsArray.forEach(topic => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
              })
            );
          });
        });
    });
  });