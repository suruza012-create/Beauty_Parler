const express = require('express');
const {
  getNotifications,
  createNotification,
  broadcastNotification,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controllers/notificationController');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getNotifications);
router.post('/broadcast', auth, admin, broadcastNotification);
router.post('/', auth, admin, createNotification);
router.patch('/read-all', auth, markAllNotificationsRead);
router.patch('/:id/read', auth, markNotificationRead);

module.exports = router;