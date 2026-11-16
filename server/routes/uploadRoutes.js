const express = require('express');
const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};
const hasCloudinaryConfig = Object.values(cloudinaryConfig).every(Boolean);

if (hasCloudinaryConfig) cloudinary.config(cloudinaryConfig);

const localStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const upload = multer({
  storage: hasCloudinaryConfig || process.env.NODE_ENV === 'production' ? multer.memoryStorage() : localStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) return callback(null, true);
    callback(new Error('Only image and video files are allowed'));
  }
});

const uploadToCloudinary = file => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({ folder: 'beauty-parlour', resource_type: 'auto' }, (error, result) => {
    if (error) return reject(error);
    resolve(result);
  });
  stream.end(file.buffer);
});

router.post('/', auth, admin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Please select a file' });
  if (!hasCloudinaryConfig && process.env.NODE_ENV === 'production') {
    return res.status(503).json({ success: false, message: 'Cloudinary upload is not configured on this server' });
  }

  try {
    if (hasCloudinaryConfig) {
      const result = await uploadToCloudinary(req.file);
      return res.status(201).json({ success: true, url: result.secure_url, file: { publicId: result.public_id } });
    }

    return res.status(201).json({ success: true, url: `/uploads/${req.file.filename}`, file: req.file });
  } catch (error) {
    console.error('Media upload failed:', error.message);
    return res.status(502).json({ success: false, message: 'Unable to upload media. Please try again.' });
  }
});

module.exports = router;
