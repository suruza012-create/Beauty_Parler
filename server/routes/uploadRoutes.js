const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) return callback(null, true);
    callback(new Error('Only image and video files are allowed'));
  }
});

router.post('/', auth, admin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Please select a file' });
  res.status(201).json({ success: true, url: `/uploads/${req.file.filename}`, file: req.file });
});

module.exports = router;
