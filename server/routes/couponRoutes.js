const express = require('express');
const router = express.Router();
const {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/', auth, admin, createCoupon);
router.put('/:id', auth, admin, updateCoupon);
router.delete('/:id', auth, admin, deleteCoupon);

module.exports = router;