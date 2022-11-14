const express = require("express");
const app = express();
const {getTopics} = require ("/home/srvadmin/northcoders/backend/be-nc-news/contorllors/getTopics");



app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (request, response) => {
    response.status(404).send({ msg: "End point not found" });
  });

  module.exports = app;