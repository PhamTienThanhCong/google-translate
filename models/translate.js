const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  id_tv: String,
  id_tt: String,
  vote_down: {
    type: Number,
    default: 0
  },
  vote_up: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model('translates', TaskSchema);
