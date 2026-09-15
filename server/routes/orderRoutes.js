/**
 * ============================================
 * ORDER ROUTES - অর্ডার সম্পর্কিত রাউট
 * ============================================
 * @route /api/orders
 */

const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
} = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

/**
 * @route   GET /api/orders
 * @desc    সব অর্ডার দেখা
 * @access  Private
 */
router.get('/', auth, getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    একটি অর্ডার দেখা
 * @access  Private
 */
router.get('/:id', auth, getSingleOrder);

/**
 * @route   POST /api/orders
 * @desc    নতুন অর্ডার তৈরি করা
 * @access  Private
 */
router.post('/', auth, createOrder);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    অর্ডার স্ট্যাটাস পরিবর্তন করা
 * @access  Private (Admin)
 */
router.put('/:id/status', auth, admin, updateOrderStatus);

/**
 * @route   PUT /api/orders/:id/payment
 * @desc    অর্ডারের পেমেন্ট স্ট্যাটাস পরিবর্তন করা
 * @access  Private (Admin)
 */
router.put('/:id/payment', auth, admin, updatePaymentStatus);

/**
 * @route   DELETE /api/orders/:id
 * @desc    অর্ডার ডিলিট করা
 * @access  Private (Admin)
 */
router.delete('/:id', auth, admin, deleteOrder);

module.exports = router;