const express = require("express");
const app = express();
const {getTopics} = require ("./contorllors/getTopics");
const {getArticles, getArticleById, getArticleCommentsById} = require ("./contorllors/articles");


app.use(express.json());

app.get("/api/topics", getTopics);
app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/articles/:article_id/comments`, getArticleCommentsById);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "End point not found" });
  });

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400)
        .send({msg: "invalid article id"})}
      else next(err)
})

app.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else next(err)
})
  module.exports = app;