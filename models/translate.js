const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  korea: {
    // object word
    type: Object,
    default: {}
  },
  foreign_languages:{
    type: Object,
    default: {}
  },
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
  }
});

module.exports = mongoose.model('translates', TaskSchema);
