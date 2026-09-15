const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'default-staff.jpg'
  },
  address: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'beautician', 'receptionist', 'accountant'],
    default: 'beautician'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: [{
    module: {
      type: String,
      enum: ['booking', 'customer', 'service', 'payment', 'report']
    },
    canCreate: { type: Boolean, default: false },
    canRead: { type: Boolean, default: false },
    canUpdate: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Staff', StaffSchema);