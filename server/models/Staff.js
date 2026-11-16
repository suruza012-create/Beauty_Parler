const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters'],
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
  shift: {
    type: String,
    default: ''
  },
  salaryType: {
    type: String,
    default: ''
  },
  commissionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  emergencyContact: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String,
    trim: true
  }],
  role: {
    type: String,
    enum: ['admin', 'manager', 'beautician', 'receptionist', 'accountant'],
    default: 'beautician'
  },
  designation: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'Working', 'On Leave'],
    default: 'Available'
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

StaffSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

StaffSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate() || {};
  const password = update.password ?? update.$set?.password;
  if (password === undefined) return;
  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if (update.password !== undefined) {
    update.password = hashedPassword;
  } else {
    update.$set.password = hashedPassword;
  }
  this.setUpdate(update);
});

module.exports = mongoose.model('Staff', StaffSchema);