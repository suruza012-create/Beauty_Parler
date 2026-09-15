const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  description: { type: String },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
