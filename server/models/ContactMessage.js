const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, maxlength: 2000 },
  status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
