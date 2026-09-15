/**
 * ============================================
 * SERVICE ROUTES - সার্ভিস সম্পর্কিত রাউট
 * ============================================
 * @route /api/services
 */

const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getSingleService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { auth, admin } = require('../middleware/auth');

/**
 * @route   GET /api/services
 * @desc    সব সার্ভিস দেখা
 * @access  Public
 */
router.get('/', getAllServices);

/**
 * @route   GET /api/services/:id
 * @desc    একটি সার্ভিস দেখা
 * @access  Public
 */
router.get('/:id', getSingleService);

/**
 * @route   POST /api/services
 * @desc    নতুন সার্ভিস তৈরি করা
 * @access  Private (Admin)
 */
router.post('/', auth, admin, createService);

/**
 * @route   PUT /api/services/:id
 * @desc    সার্ভিস আপডেট করা
 * @access  Private (Admin)
 */
router.put('/:id', auth, admin, updateService);

/**
 * @route   DELETE /api/services/:id
 * @desc    সার্ভিস ডিলিট করা
 * @access  Private (Admin)
 */
router.delete('/:id', auth, admin, deleteService);

module.exports = router;