const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReviewsByService,
  createReview,
  deleteReview
} = require('../controllers/reviewController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getReviews);
router.get('/service/:serviceId', getReviewsByService);
router.post('/', auth, createReview);
router.delete('/:id', auth, admin, deleteReview);

module.exports = router;