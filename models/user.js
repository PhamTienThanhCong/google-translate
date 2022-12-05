const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  fullname: String,
  email: String,
  gender: String,
  birthday: String,
  phoneNumber: String,
  address:String,
  password: String
});


module.exports = mongoose.model('users', TaskSchema);
