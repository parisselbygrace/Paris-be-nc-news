const express = require("express");
const app = express();
const {getTopics} = require ("./contorllors/getTopics");
const {getArticles} = require ("./contorllors/articles")


app.use(express.json());

app.get("/api/topics", getTopics);
app.get(`/api/articles`, getArticles);

app.all("/*", (request, response) => {
    response.status(404).send({ msg: "End point not found" });
  });

  module.exports = app;