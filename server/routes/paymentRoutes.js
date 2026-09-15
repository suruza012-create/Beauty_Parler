const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment
} = require('../controllers/paymentController');
const { auth, admin } = require('../middleware/auth');

router.post('/', auth, createPayment);
router.get('/', auth, getPayments);
router.get('/:id', auth, getPaymentById);
router.put('/:id/status', auth, admin, updatePaymentStatus);
router.delete('/:id', auth, admin, deletePayment);

module.exports = router;