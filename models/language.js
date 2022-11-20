const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model('languages', TaskSchema);
