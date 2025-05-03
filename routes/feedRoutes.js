const express = require('express');
const router = express.Router();
const {
  getRedditFeed,
  getLinkedInFeed,
  saveContent,
  reportContent,
  getSavedFeeds
} = require('../controllers/feedController');
const auth = require('../middlewares/authMiddleware');
const { shareContent } = require('../controllers/feedController');

router.get('/reddit', auth, getRedditFeed);
router.get('/linkedin', auth, getLinkedInFeed);
router.post('/save', auth, saveContent);
router.post('/report', auth, reportContent);
router.get('/saved', auth, getSavedFeeds);
router.post('/share', auth, shareContent);

module.exports = router;
