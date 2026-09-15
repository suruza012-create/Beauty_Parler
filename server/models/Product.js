/**
 * ============================================
 * PRODUCT MODEL - প্রোডাক্ট ডেটাবেস স্কিমা
 * ============================================
 * এই মডেলটি বিউটি পার্লারের বিক্রয়যোগ্য পণ্যের তথ্য সংরক্ষণ করে
 * যেমন: স্কিনকেয়ার প্রোডাক্ট, মেকআপ আইটেম, হেয়ার প্রোডাক্ট ইত্যাদি
 */

const mongoose = require('mongoose');

/**
 * প্রোডাক্ট স্কিমা ডেফিনিশন
 */
const ProductSchema = new mongoose.Schema({
  /**
   * পণ্যের নাম
   * @required - এটি অবশ্যই দিতে হবে
   */
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },

  /**
   * পণ্যের বিস্তারিত বিবরণ
   * @required - এটি অবশ্যই দিতে হবে
   */
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },

  /**
   * পণ্যের মূল্য
   * @required - এটি অবশ্যই দিতে হবে
   */
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },

  /**
   * স্টকে কতটি পণ্য আছে
   * @required - এটি অবশ্যই দিতে হবে
   */
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },

  /**
   * পণ্যের ছবি
   * @required - এটি অবশ্যই দিতে হবে
   */
  image: {
    type: String,
    required: [true, 'Please provide a product image'],
    default: 'default-product.jpg'
  },

  /**
   * পণ্যের ক্যাটেগরি
   * @default 'Other'
   */
  category: {
    type: String,
    enum: ['Skincare', 'Haircare', 'Makeup', 'Nailcare', 'Fragrance', 'Supplements', 'Other'],
    default: 'Other'
  },

  /**
   * পণ্যের ব্র্যান্ড
   * @optional
   */
  brand: {
    type: String,
    required: false,
    trim: true
  },

  /**
   * পণ্যের ওজন বা সাইজ
   * @optional
   * উদাহরণ: '50ml', '100g', '200ml'
   */
  weight: {
    type: String,
    required: false
  },

  /**
   * পণ্যটি কি ফিচার্ড/প্রমোশনে আছে?
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
   * পণ্যের রেটিং (গড়)
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
module.exports = mongoose.model('Product', ProductSchema);