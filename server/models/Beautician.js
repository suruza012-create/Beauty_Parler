const mongoose = require('mongoose');

const BeauticianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: 'default-beautician.jpg'
  },
  specialties: [{
    type: String,
    enum: ['Hair', 'Makeup', 'Skin', 'Nail', 'Massage', 'Bridal', 'Spa']
  }],
  experience: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '20:00' }
  },
  offDays: [{
    type: String,
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Beautician', BeauticianSchema);