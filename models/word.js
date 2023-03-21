const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  word: String,
  description: String,
  // language int 32
  language: String,
  language_name: String,
  // writeConcern
});

module.exports = mongoose.model('word', TaskSchema);
