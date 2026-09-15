const express = require('express');
const router = express.Router();
const { getGallery, getVideos, createContactMessage, getSettings, updateSettings, getContactMessages, updateContactMessage, createGallery, deleteGallery, createVideo, deleteVideo } = require('../controllers/contentController');
const { auth, admin } = require('../middleware/auth');

router.get('/gallery', getGallery);
router.get('/videos', getVideos);
router.post('/contact', createContactMessage);
router.get('/settings', getSettings);
router.put('/settings', auth, admin, updateSettings);
router.get('/contact', auth, admin, getContactMessages);
router.put('/contact/:id', auth, admin, updateContactMessage);
router.post('/gallery', auth, admin, createGallery);
router.delete('/gallery/:id', auth, admin, deleteGallery);
router.post('/videos', auth, admin, createVideo);
router.delete('/videos/:id', auth, admin, deleteVideo);

module.exports = router;
