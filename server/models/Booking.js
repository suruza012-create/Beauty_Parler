/**
 * ============================================
 * BOOKING MODEL - বুকিং ডেটাবেস স্কিমা
 * ============================================
 * এই মডেলটি কাস্টমারদের সার্ভিস বুকিংয়ের তথ্য সংরক্ষণ করে
 * যেমন: কোন সার্ভিস, কখন, কার জন্য ইত্যাদি
 */

const mongoose = require('mongoose');

/**
 * বুকিং স্কিমা ডেফিনিশন
 */
const BookingSchema = new mongoose.Schema({
  /**
   * বুকিংকারী ইউজারের আইডি
   * @required - এটি অবশ্যই দিতে হবে
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID']
  },

  /**
   * বুকিং করা সার্ভিসের আইডি
   * @required - এটি অবশ্যই দিতে হবে
   */
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please provide service ID']
  },
  customerName: {
    type: String,
    trim: true,
    maxlength: [100, 'Customer name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [30, 'Phone number cannot be more than 30 characters']
  },
  staff: {
    type: String,
    trim: true,
    maxlength: [100, 'Staff name cannot be more than 100 characters']
  },

  /**
   * বুকিংয়ের তারিখ
   * @required - এটি অবশ্যই দিতে হবে
   */
  bookingDate: {
    type: String,
    required: [true, 'Please provide booking date']
  },

  /**
   * বুকিংয়ের সময়
   * @required - এটি অবশ্যই দিতে হবে
   */
  bookingTime: {
    type: String,
    required: [true, 'Please provide booking time']
  },

  /**
   * অতিরিক্ত নোট
   * @optional
   */
  note: {
    type: String,
    required: false,
    maxlength: [500, 'Note cannot be more than 500 characters']
  },

  /**
   * বুকিংয়ের স্ট্যাটাস
   * @default 'pending'
   */
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },

  /**
   * বুকিং কনফর্ম করার সময়
   * @optional
   */
  confirmedAt: {
    type: Date,
    default: null
  },

  /**
   * বুকিং সম্পন্ন হওয়ার সময়
   * @optional
   */
  completedAt: {
    type: Date,
    default: null
  },

  /**
   * বুকিং বাতিলের কারণ
   * @optional
   */
  cancellationReason: {
    type: String,
    required: false,
    maxlength: [200, 'Reason cannot be more than 200 characters']
  },

  /**
   * কখন তৈরি করা হয়েছে
   */
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// মডেলটি এক্সপোর্ট করি
module.exports = mongoose.model('Booking', BookingSchema);