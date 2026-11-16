const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getNotifications = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.userId = req.user._id;
    } else if (req.query.userId) {
      if (!mongoose.isValidObjectId(req.query.userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
      }
      filter.userId = req.query.userId;
    }

    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 50;
    const notificationQuery = Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);
    if (req.user.role === 'admin') notificationQuery.populate('userId', 'name email');

    const [notifications, unreadCount] = await Promise.all([
      notificationQuery,
      Notification.countDocuments({ ...filter, isRead: false })
    ]);

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, message: 'Unable to load notifications' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId, relatedType } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'A valid user ID is required' });
    }
    if (!await User.exists({ _id: userId, isActive: true })) {
      return res.status(404).json({ success: false, message: 'Active user not found' });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'in-app',
      relatedId,
      relatedType
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Unable to create notification' });
  }
};

exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, audience = 'All Clients', relatedId } = req.body;
    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const userFilter = { role: 'user', isActive: true };
    if (audience === 'New Clients') {
      userFilter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    } else if (audience !== 'All Clients') {
      return res.status(400).json({
        success: false,
        message: 'VIP targeting is unavailable because customer membership levels are not configured'
      });
    }

    const users = await User.find(userFilter).select('_id').lean();
    if (users.length === 0) {
      return res.json({ success: true, createdCount: 0, message: 'No active clients matched this audience' });
    }

    const notifications = await Notification.insertMany(users.map(user => ({
      userId: user._id,
      type: 'in-app',
      title: title.trim(),
      message: message.trim(),
      relatedId,
      relatedType: 'promotion'
    })));

    res.status(201).json({
      success: true,
      createdCount: notifications.length,
      message: 'In-app notifications created'
    });
  } catch (error) {
    console.error('Broadcast Notification Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Unable to send broadcast' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      filter,
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ success: false, message: 'Unable to update notification' });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Mark All Notifications Read Error:', error);
    res.status(500).json({ success: false, message: 'Unable to update notifications' });
  }
};