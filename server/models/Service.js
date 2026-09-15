/**
 * ============================================
 * SERVICE MODEL - সার্ভিস ডেটাবেস স্কিমা
 * ============================================
 * এই মডেলটি বিউটি পার্লারের সমস্ত সার্ভিসের তথ্য সংরক্ষণ করে
 * যেমন: হেয়ার কাট, মেকআপ, স্পা, ফেসিয়াল ইত্যাদি
 */

const mongoose = require('mongoose');

/**
 * সার্ভিস স্কিমা ডেফিনিশন
 */
const ServiceSchema = new mongoose.Schema({
  /**
   * সার্ভিসের নাম
   * @required - এটি অবশ্যই দিতে হবে
   */
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },

  /**
   * সার্ভিসের বিস্তারিত বিবরণ
   * @required - এটি অবশ্যই দিতে হবে
   */
  description: {
    type: String,
    required: [true, 'Please provide a service description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },

  /**
   * সার্ভিসের মূল্য
   * @required - এটি অবশ্যই দিতে হবে
   * @min - ০ এর কম হতে পারে না
   */
  price: {
    type: Number,
    required: [true, 'Please provide a service price'],
    min: [0, 'Price cannot be negative']
  },

  /**
   * সার্ভিসের সময়কাল
   * @required - এটি অবশ্যই দিতে হবে
   * উদাহরণ: '30 minutes', '1 hour', '2 hours'
   */
  duration: {
    type: String,
    required: [true, 'Please provide service duration'],
    trim: true
  },

  /**
   * সার্ভিসের ছবি
   * @required - এটি অবশ্যই দিতে হবে
   */
  image: {
    type: String,
    required: [true, 'Please provide a service image'],
    default: 'default-service.jpg'
  },

  /**
   * সার্ভিসের ক্যাটেগরি
   * @default 'Other'
   */
  category: {
    type: String,
    enum: ['Hair', 'Skin', 'Makeup', 'Nail', 'Massage', 'Spa', 'Bridal', 'Other'],
    default: 'Other'
  },

  /**
   * সার্ভিসটি কি উপলব্ধ?
   * @default true
   */
  isAvailable: {
    type: Boolean,
    default: true
  },

  /**
   * সার্ভিসে কি বিশেষ অফার আছে?
   * @default false
   */
  isFeatured: {
    type: Boolean,
    default: false
  },

  /**
   * ডিসকাউন্ট পার্সেন্টেজ
   * @default 0
   */
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },

  /**
   * সার্ভিসের রেটিং (গড়)
   * @default 0
   */
  averageRating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },

  /**
   * মোট রিভিউ সংখ্যা
   * @default 0
   */
  totalReviews: {
    type: Number,
    default: 0
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
module.exports = mongoose.model('Service', ServiceSchema);