const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  word: String
});

module.exports = mongoose.model('foreign_languages', TaskSchema);
