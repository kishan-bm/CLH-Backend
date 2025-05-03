const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: String, // e.g., Reddit or LinkedIn
  title: String,
  link: String,
  action: { type: String, enum: ['saved', 'reported'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feed', feedSchema);
