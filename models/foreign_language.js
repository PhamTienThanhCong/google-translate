const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  word: String,
  description: String
});

module.exports = mongoose.model('foreign_languages', TaskSchema);
