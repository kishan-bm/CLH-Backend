const Feed = require('../models/Feed');
const Credit = require('../models/Credit');
const axios = require('axios');

// 1. Fetch Reddit feed
exports.getRedditFeed = async (req, res) => {
  try {
    const response = await axios.get('https://www.reddit.com/r/learnprogramming.json?limit=10');
    const posts = response.data.data.children.map((post) => ({
      title: post.data.title,
      link: `https://reddit.com${post.data.permalink}`,
      source: 'Reddit'
    }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Reddit feed' });
  }
};

// 2. Simulated LinkedIn feed
exports.getLinkedInFeed = async (req, res) => {
  const dummy = [
    { title: '5 Tips for Learning React', link: 'https://linkedin.com/posts/1', source: 'LinkedIn' },
    { title: 'MongoDB for Beginners', link: 'https://linkedin.com/posts/2', source: 'LinkedIn' }
  ];
  res.json(dummy);
};

// 3. Save content + credit
exports.saveContent = async (req, res) => {
  const { title, link, source } = req.body;
  const userId = req.user.id;

  try {
    const feed = await Feed.create({ user: userId, title, link, source, action: 'saved' });

    // 💰 Credit +5 points
    await Credit.create({
      user: userId,
      amount: 5,
      purpose: 'Saved a post'
    });

    res.json({ message: 'Content saved', feed });
  } catch (err) {
    console.error("Share credit error:", err);  // log the real error
    res.status(500).json({ error: 'Failed to credit share' });
  }
  
};

// 4. Report content (no credit)
exports.reportContent = async (req, res) => {
  const { title, link, source } = req.body;
  const userId = req.user.id;

  try {
    const report = await Feed.create({ user: userId, title, link, source, action: 'reported' });
    res.json({ message: 'Content reported', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to report content' });
  }
};

// 5. Share content + credit
exports.shareContent = async (req, res) => {
  const { title, link, source } = req.body;
  const userId = req.user.id;

  try {
    await Credit.create({
      user: userId,
      amount: 3,
      purpose: 'Shared a post'
    });

    res.json({ message: 'Share credited' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to credit share' });
  }
};

// 6. Get user's saved content
exports.getSavedFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find({ user: req.user.id, action: 'saved' });
    res.json(feeds);
  } catch {
    res.status(500).json({ error: 'Could not fetch saved content' });
  }
};
