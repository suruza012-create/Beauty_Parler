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