const express = require("express");
const app = express();
const {getTopics} = require ("./contorllors/getTopics");
const {getArticles, getArticleById, getArticleCommentsById, postComment, patchVotes} = require ("./contorllors/articles");



app.use(express.json());

app.get("/api/topics", getTopics);
app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/articles/:article_id/comments`, getArticleCommentsById);

app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchVotes)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "End point not found" });
  });

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400)
        .send({msg: "invalid data"})}
      else next(err)
})

app.use((err, req, res, next) => {
    if(err.code === "23503"){
        res.status(404)
        .send({msg: "bad request"})}
      else next(err)
})

app.use((err, req, res, next) => {
    if(err.code === "23502"){
        res.status(400)
        .send({msg: "more data required"})}
      else next(err)
})

app.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else next(err)
})
  module.exports = app;