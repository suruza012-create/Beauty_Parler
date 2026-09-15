/**
 * ============================================
 * BLOG MODEL - ব্লগ ডেটাবেস স্কিমা
 * ============================================
 * এই মডেলটি বিউটি টিপস, হেয়ার কেয়ার, স্কিন কেয়ার ইত্যাদি ব্লগ পোস্ট সংরক্ষণ করে
 */

const mongoose = require('mongoose');

/**
 * ব্লগ স্কিমা ডেফিনিশন
 */
const BlogSchema = new mongoose.Schema({
  /**
   * ব্লগের শিরোনাম
   * @required - এটি অবশ্যই দিতে হবে
   */
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },

  /**
   * ব্লগের কন্টেন্ট (বিস্তারিত)
   * @required - এটি অবশ্যই দিতে হবে
   */
  content: {
    type: String,
    required: [true, 'Please provide blog content']
  },

  /**
   * ব্লগের সংক্ষিপ্ত বিবরণ (সারাংশ)
   * @required - এটি অবশ্যই দিতে হবে
   */
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },

  /**
   * ব্লগের কাভার ছবি
   * @required - এটি অবশ্যই দিতে হবে
   */
  image: {
    type: String,
    required: [true, 'Please provide a blog image'],
    default: 'default-blog.jpg'
  },

  /**
   * ব্লগের ক্যাটেগরি
   * @default 'Other'
   */
  category: {
    type: String,
    enum: ['Beauty Tips', 'Hair Care', 'Skin Care', 'Makeup Tips', 'Nail Care', 'Health', 'Other'],
    default: 'Other'
  },

  /**
   * ব্লগের ট্যাগসমূহ
   * @optional
   */
  tags: [{
    type: String,
    trim: true
  }],

  /**
   * ব্লগের লেখক
   * @default 'Admin'
   */
  author: {
    type: String,
    default: 'Admin'
  },

  /**
   * ব্লগটি কি পাবলিশ করা হয়েছে?
   * @default true
   */
  isPublished: {
    type: Boolean,
    default: true
  },

  /**
   * ব্লগটি কি ফিচার্ড?
   * @default false
   */
  isFeatured: {
    type: Boolean,
    default: false
  },

  /**
   * মোট ভিউ সংখ্যা
   * @default 0
   */
  views: {
    type: Number,
    default: 0
  },

  /**
   * মোট লাইক সংখ্যা
   * @default 0
   */
  likes: {
    type: Number,
    default: 0
  },

  /**
   * মোট কমেন্ট সংখ্যা
   * @default 0
   */
  comments: {
    type: Number,
    default: 0
  },

  /**
   * কখন তৈরি করা হয়েছে
   */
  createdAt: {
    type: Date,
    default: Date.now
  },

  /**
   * কখন আপডেট করা হয়েছে
   */
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// মডেলটি এক্সপোর্ট করি
module.exports = mongoose.model('Blog', BlogSchema);