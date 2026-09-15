const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['before_after', 'service', 'parlour', 'event'], 
    required: true 
  },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  beauticianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beautician' },
  description: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);