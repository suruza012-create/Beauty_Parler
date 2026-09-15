const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    type: {
      type: String,
      enum: ['service', 'product'],
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Wishlist', WishlistSchema);