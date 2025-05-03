const Credit = require('../models/Credit');
const User = require('../models/User');

// Earn or spend credits
exports.addTransaction = async (req, res) => {
  const { amount, purpose } = req.body;
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.credits += amount;
    await user.save();

    const tx = await Credit.create({ user: userId, amount, purpose });
    res.status(200).json({ message: 'Transaction recorded', tx });
  } catch (err) {
    res.status(500).json({ error: 'Transaction failed', details: err.message });
  }
};

// Get credit history
exports.getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await Credit.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch history' });
  }
};

// Spend credits for premium
exports.spendCredits = async (req, res) => {
  const userId = req.user.id;
  const amount = req.body.amount || 10;

  console.log("💳 spendCredits: req.user =", req.user); // Debug log
  console.log("💳 Amount to spend:", amount); // Debug log

  try {
    // Atomic operation to check and update credits
    const user = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: amount } },
      { $inc: { credits: -amount } },
      { new: true }
    );

    if (!user) {
      console.log("💥 Not enough credits or user not found");
      return res.status(400).json({ error: 'Not enough credits' });
    }

    console.log(`💳 Credits after spending: ${user.credits}`); // Debug log

    await Credit.create({
      user: userId,
      amount: -amount,
      purpose: 'Unlocked Premium Content'
    });

    res.json({ message: 'Premium content unlocked' });
  } catch (err) {
    console.error("💥 Spend Credits Error:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to process credit spend', details: err.message });
  }
};