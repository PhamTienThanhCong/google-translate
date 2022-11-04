const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  word: String,
  description: String,
  // language int 32
  language: Number
});

module.exports = mongoose.model('foreign_languages', TaskSchema);
