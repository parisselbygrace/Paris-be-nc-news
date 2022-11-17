const db = require('../connection.js');
const format = require('pg-format')

exports.checkExists = (table, column, value) => {
    const queryStr = format('SELECT * FROM %I WHERE %I = %L;', table, column, value)
    return db.query(queryStr).then((res) => {
         if (res.rows.length === 0) {
            return Promise.reject({status:404, msg: 'Id does not exisit'})
        }
        return res.rows[0]
        
    })
}

exports.checkArticleExists = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id =$1', [article_id]).then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status:404, msg: 'Id does not exisit'})
        }
        return res.rows[0]
    })
}


exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found" })
      }
    });
};