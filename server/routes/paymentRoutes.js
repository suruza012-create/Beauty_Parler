const express = require('express');
const router = express.Router();
const {
  getPaymentConfig,
  createPayment,
  initiateSslCommerzPayment,
  handleSslCommerzSuccess,
  handleSslCommerzIpn,
  handleSslCommerzFailure,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment
} = require('../controllers/paymentController');
const { auth, admin } = require('../middleware/auth');

router.get('/config', getPaymentConfig);
router.post('/sslcommerz/initiate', auth, initiateSslCommerzPayment);
router.post('/sslcommerz/success', handleSslCommerzSuccess);
router.post('/sslcommerz/fail', handleSslCommerzFailure);
router.post('/sslcommerz/cancel', handleSslCommerzFailure);
router.post('/sslcommerz/ipn', handleSslCommerzIpn);
router.post('/', auth, createPayment);
router.get('/', auth, getPayments);
router.get('/:id', auth, getPaymentById);
router.put('/:id/status', auth, admin, updatePaymentStatus);
router.delete('/:id', auth, admin, deletePayment);

module.exports = router;