const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  id_tv: String,
  id_tt: String
});

module.exports = mongoose.model('translates', TaskSchema);
