const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo', 'combo'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  offerPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    default: 'General'
  },
  targetAudience: {
    type: String,
    default: 'All Clients'
  },
  servicesIncluded: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  terms: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', OfferSchema);