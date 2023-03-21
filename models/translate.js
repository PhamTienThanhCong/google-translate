const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  korea: String,
  foreign_languages:String,
  language: String,
  language_name: String,
  vote_down: {
    type: Number,
    default: 0
  },
  vote_up: {
    type: Number,
    default: 0
  },
  votes: {
    type: Array,
    default: []
  },
  description: {
    type: String,
    default: ''
  },
});

module.exports = mongoose.model('translates', TaskSchema);
