const app = require(`../app.js`);
const request = require("supertest");
const db = require("../db/connection.js");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  return db.end();
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

  
    describe("GET /api/articles", () => {
        test( "return a 200: should respond with array of article objects ", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(12);
              body.articles.forEach((article) => {
                expect(article).toMatchObject({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String),
                });
              });
            });
        });
        test('return a 200: sorted by decednding data', () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
              expect(body.articles).toBeSortedBy("created_at", {descending: true})
            })
        });
      });
    })

 
      describe("GET /api/articles/:article_id", () => {
        test("return status 200 when successful", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200);
        });
        test("return an object of the requested article ", () => {
          return request(app)
            .get("/api/articles/1")
            .then(({ body }) => {
                const{article} = body
              expect(article).toEqual(
                expect.objectContaining({
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                article_id: 1 ,
                topic: 'mitch',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                }))
            });
        });
        test("400: responds with an error when passed an article_id of an incorrect type", () => {
          return request(app)
            .get("/api/articles/not-a-number")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid data");
            });
        });
        test("404: responds with an error when passed an article_id not present in our database", () => {
          return request(app)
            .get("/api/articles/100000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Id does not exisit");
            });
        });
      });

      describe("GET /api/articles/:article_id", () => {
        test("return status 200 when successful", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200);
        });
        test("return an object of the requested article with total comments", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .then(({ body }) => {
                const{comments} = body
                expect(comments).toBeSortedBy('created_at', {descending: true})
                comments.forEach((comment) => {
                expect(comment).toEqual(
                expect.objectContaining({
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                }))
            })
            });
        });
        test("200: should return empty array if article has no comments", () => {
            return request(app)
              .get("/api/articles/8/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).toHaveLength(0);
                expect(body.comments).toEqual([]);
              });
          });
        test("400: responds with an error when passed an article_id of an incorrect type", () => {
          return request(app)
            .get("/api/articles/not-a-number")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid data");
            });
        });
        test("404: responds with an error when passed an article_id not present in our database", () => {
          return request(app)
            .get("/api/articles/100000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Id does not exisit");
            });
        });
      });

      describe("POST /api/articles/:article_id/comments", () => {
        test("returns 201: should post a new comment", () => {
          const newComment = {
            username: "butter_bridge",
            body: "Bad article, 0 stars",
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(body.comment).toEqual({
                article_id: 1,
                comment_id: expect.any(Number),
                author: "butter_bridge",
                votes: 0,
                created_at: expect.any(String),
                body: "Bad article, 0 stars",
              });
            });
        });
       
  });

test("404: Should respond with 404 if passed an invalid id", () => {
const newComment = {
    username: "butter_bridge",
    body: "Bad article, 0 stars",
  }

return request(app)
  .post("/api/articles/500/comments")
  .send(newComment)
  .expect(404)
  .then(({ body }) => {
    expect(body.msg).toBe("Id does not exisit");
  })
})

test("400: Should respond with 400 if passed wrong id datatype", () => {
    const newComment = {
        username: "butter_bridge",
        body: "Bad article, 0 stars",
      }
return request(app)
  .post("/api/articles/Hi/comments")
  .send(newComment)
  .expect(400)
  .then(({ body }) => {
    expect(body.msg).toBe("invalid data");
  });
});
test("400: should respond with 400 if passed a comment with missing data", () => {
    const newComment = {
      };
return request(app)
  .post("/api/articles/1/comments")
  .send(newComment)
  .expect(400)
  .then(({ body }) => {
    expect(body.msg).toBe("more data required");
  });
});
test("404: if passed a username that isnt in the db", () => {
const newComment = {
  username: "paris",
  body: "4444",
};
return request(app)
  .post("/api/articles/1/comments")
  .send(newComment)
  .expect(404)
  .then(({ body }) => {
    expect(body.msg).toBe("bad request");
  })
})

