const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    required: false,
    default: 'default-avatar.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// ============================================
// ✅ সঠিক উপায় ১: async/await ব্যবহার করো, কিন্তু next() ছাড়া
// ============================================
UserSchema.pre('save', async function() {
  // যদি পাসওয়ার্ড পরিবর্তন না হয় তাহলে এড়িয়ে যাও
  if (!this.isModified('password')) {
    return;
  }
  
  // পাসওয়ার্ড হ্যাশ করো
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// পাসওয়ার্ড ম্যাচ করার মেথড
// ============================================
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);