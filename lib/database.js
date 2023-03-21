const mongoose = require('mongoose');
const config = require('../config/index');
const connection = mongoose.connect(`${config.database.uri}/${config.database.database_name}`);

connection
  .then((db) => {
    console.log("connect DB done")
    return db;
  }, (err) => {
    if(err.message.code === 'ETIMEDOUT'){
      console.log("connect DB fail")
			mongoose.connect(config.database.uri);
    }
  })

module.exports = connection;
