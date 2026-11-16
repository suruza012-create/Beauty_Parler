const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getAdminCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getCoupons);
router.get('/manage', auth, admin, getAdminCoupons);
router.post('/validate', validateCoupon);
router.post('/', auth, admin, createCoupon);
router.put('/:id', auth, admin, updateCoupon);
router.delete('/:id', auth, admin, deleteCoupon);

module.exports = router;