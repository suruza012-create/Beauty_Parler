/**
 * ============================================
 * ORDER MODEL - অর্ডার ডেটাবেস স্কিমা
 * ============================================
 * এই মডেলটি কাস্টমারদের পণ্য অর্ডারের তথ্য সংরক্ষণ করে
 */

const mongoose = require('mongoose');

/**
 * অর্ডার স্কিমা ডেফিনিশন
 */
const OrderSchema = new mongoose.Schema({
  /**
   * অর্ডারকারী ইউজারের আইডি
   * @required - এটি অবশ্যই দিতে হবে
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID']
  },

  /**
   * অর্ডারের আইটেমসমূহ
   * @required - এটি অবশ্যই দিতে হবে
   */
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    image: {
      type: String
    }
  }],

  /**
   * মোট অর্ডার মূল্য
   * @required - এটি অবশ্যই দিতে হবে
   */
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount'],
    min: [0, 'Total amount cannot be negative']
  },

  /**
   * ডেলিভারি ঠিকানা
   * @required - এটি অবশ্যই দিতে হবে
   */
  deliveryAddress: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code']
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
      default: 'Bangladesh'
    }
  },

  /**
   * ফোন নম্বর
   * @required - এটি অবশ্যই দিতে হবে
   */
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },

  /**
   * অর্ডার নোট
   * @optional
   */
  note: {
    type: String,
    required: false,
    maxlength: [500, 'Note cannot be more than 500 characters']
  },

  /**
   * পেমেন্ট মেথড
   * @default 'cash'
   */
  paymentMethod: {
    type: String,
    enum: ['cash', 'bkash', 'nagad', 'rocket', 'card', 'sslcommerz'],
    default: 'cash'
  },

  /**
   * পেমেন্ট স্ট্যাটাস
   * @default 'pending'
   */
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  /**
   * ট্রানজেকশন আইডি (পেমেন্ট গেটওয়ে থেকে)
   * @optional
   */
  transactionId: {
    type: String,
    required: false
  },

  /**
   * অর্ডার স্ট্যাটাস
   * @default 'pending'
   */
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },

  /**
   * ডেলিভারি তারিখ
   * @optional
   */
  deliveredAt: {
    type: Date,
    default: null
  },

  /**
   * অর্ডার বাতিলের কারণ
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
module.exports = mongoose.model('Order', OrderSchema);