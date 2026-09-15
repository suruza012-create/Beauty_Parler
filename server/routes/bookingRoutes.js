/**
 * ============================================
 * BOOKING ROUTES - বুকিং সম্পর্কিত রাউট
 * ============================================
 * @route /api/bookings
 */

const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getMyBooking          // ✅ Singular
} = require('../controllers/bookingController');
const { auth, admin } = require('../middleware/auth');

// ============================================
// রাউট অর্ডার (স্পেসিফিক → জেনেরিক)
// ============================================

// ১. স্পেসিফিক রাউট (সবার আগে) - Singular
router.get('/my-booking', auth, getMyBooking);

// ২. সব বুকিং
router.get('/', auth, getAllBookings);

// ৩. আইডি দিয়ে বুকিং (ডাইনামিক - সবশেষে)
router.get('/:id', auth, getSingleBooking);

// ৪. বুকিং তৈরি
router.post('/', auth, createBooking);

// ৫. বুকিং আপডেট (শুধু ইউজার নিজের)
router.put('/:id', auth, updateBooking);

// ৬. স্ট্যাটাস আপডেট (শুধু অ্যাডমিন)
router.put('/:id/status', auth, admin, updateBookingStatus);

// ৭. বুকিং ডিলিট (শুধু অ্যাডমিন)
router.delete('/:id', auth, admin, deleteBooking);

module.exports = router;