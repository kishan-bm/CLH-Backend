const mongoose = require('mongoose');

const creditTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number, // +ve for earn, -ve for spend
  purpose: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CreditTransaction', creditTransactionSchema);
