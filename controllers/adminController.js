const Feed = require('../models/Feed');
const User = require('../models/User');

// View all reported content
exports.getReportedContent = async (req, res) => {
  try {
    const reports = await Feed.find({ action: 'reported' }).populate('user', 'email');
    res.json(reports);
  } catch {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// View most saved content (top 5)
exports.getTopSavedContent = async (req, res) => {
  try {
    const top = await Feed.aggregate([
      { $match: { action: 'saved' } },
      { $group: { _id: "$link", title: { $first: "$title" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(top);
  } catch {
    res.status(500).json({ error: 'Failed to fetch top saved' });
  }
};

// View most active users (by credits)
exports.getTopUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ credits: -1 }).limit(5).select('name email credits');
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
