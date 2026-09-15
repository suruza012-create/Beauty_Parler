/**
 * ============================================
 * BLOG ROUTES - ব্লগ সম্পর্কিত রাউট
 * ============================================
 * @route /api/blogs
 */

const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getFeaturedBlogs
} = require('../controllers/blogController');
const { auth, admin } = require('../middleware/auth');

/**
 * @route   GET /api/blogs
 * @desc    সব ব্লগ দেখা
 * @access  Public
 */
router.get('/', getAllBlogs);

/**
 * @route   GET /api/blogs/featured
 * @desc    ফিচার্ড ব্লগ দেখা
 * @access  Public
 */
router.get('/featured', getFeaturedBlogs);

/**
 * @route   GET /api/blogs/category/:category
 * @desc    ক্যাটেগরি অনুযায়ী ব্লগ দেখা
 * @access  Public
 */
router.get('/category/:category', getBlogsByCategory);

/**
 * @route   GET /api/blogs/:id
 * @desc    একটি ব্লগ দেখা
 * @access  Public
 */
router.get('/:id', getSingleBlog);

/**
 * @route   POST /api/blogs
 * @desc    নতুন ব্লগ তৈরি করা
 * @access  Private (Admin)
 */
router.post('/', auth, admin, createBlog);

/**
 * @route   PUT /api/blogs/:id
 * @desc    ব্লগ আপডেট করা
 * @access  Private (Admin)
 */
router.put('/:id', auth, admin, updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    ব্লগ ডিলিট করা
 * @access  Private (Admin)
 */
router.delete('/:id', auth, admin, deleteBlog);

module.exports = router;