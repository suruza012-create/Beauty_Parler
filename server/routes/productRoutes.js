/**
 * ============================================
 * PRODUCT ROUTES - প্রোডাক্ট সম্পর্কিত রাউট
 * ============================================
 * @route /api/products
 */

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getAdminProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');

/**
 * @route   GET /api/products
 * @desc    সব প্রোডাক্ট দেখা
 * @access  Public
 */
router.get('/', getAllProducts);
router.get('/manage', auth, admin, getAdminProducts);

/**
 * @route   GET /api/products/:id
 * @desc    একটি প্রোডাক্ট দেখা
 * @access  Public
 */
router.get('/:id', getSingleProduct);

/**
 * @route   POST /api/products
 * @desc    নতুন প্রোডাক্ট তৈরি করা
 * @access  Private (Admin)
 */
router.post('/', auth, admin, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    প্রোডাক্ট আপডেট করা
 * @access  Private (Admin)
 */
router.put('/:id', auth, admin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    প্রোডাক্ট ডিলিট করা
 * @access  Private (Admin)
 */
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;