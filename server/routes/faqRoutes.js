const express = require('express');
const router = express.Router();
const {
  getFAQs,
  getFAQsByCategory,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getFAQs);
router.get('/category/:category', getFAQsByCategory);
router.post('/', auth, admin, createFAQ);
router.put('/:id', auth, admin, updateFAQ);
router.delete('/:id', auth, admin, deleteFAQ);

module.exports = router;