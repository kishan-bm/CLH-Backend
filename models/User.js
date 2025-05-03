const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: 'user'
  },
  credits: {
    type: Number,
    default: 100,
    min: 0
  }
});

module.exports = mongoose.model('User', userSchema);
