const express = require('express');
const router = express.Router();
const {
  getReportedContent,
  getTopSavedContent,
  getTopUsers
} = require('../controllers/adminController');

const auth = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

router.get('/reports', auth, adminOnly, getReportedContent);
router.get('/top-saved', auth, adminOnly, getTopSavedContent);
router.get('/top-users', auth, adminOnly, getTopUsers);

module.exports = router;
