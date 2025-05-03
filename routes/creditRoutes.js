const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const {
  addTransaction,
  getTransactions,
  spendCredits
} = require('../controllers/creditController');

router.post('/add', auth, addTransaction);
router.get('/history', auth, getTransactions);
router.post('/spend', auth, spendCredits);

module.exports = router;
