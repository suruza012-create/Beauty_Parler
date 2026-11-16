/**
 * ============================================
 * BOOKING CONTROLLER - বুকিং সম্পর্কিত সব কাজ
 * ============================================
 */

const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { parseBookingTime, getDurationMinutes, intervalsOverlap } = require('../utils/bookingSchedule');
const { sendEmail } = require('../utils/mailer');

const emailBookingUpdate = async (userId, subject, text) => {
  try {
    const user = await User.findById(userId).select('email');
    if (user?.email) await sendEmail({ to: user.email, subject, text });
  } catch (error) {
    console.error('Booking email could not be sent:', error.message);
  }
};

const findScheduleConflict = async ({ service, bookingDate, bookingTime, staff, excludeBookingId }) => {
  const requestedStart = parseBookingTime(bookingTime);
  if (requestedStart === null) return { invalidTime: true, hasConflict: false };

  const normalizedStaff = String(staff || '').trim();
  const conflictScope = normalizedStaff ? { staff: normalizedStaff } : {};
  const query = {
    bookingDate,
    status: { $in: ['pending', 'confirmed'] },
    ...conflictScope
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const existingBookings = await Booking.find(query).populate('serviceId', 'duration');
  const requestedDuration = getDurationMinutes(service.duration);
  return {
    invalidTime: false,
    hasConflict: existingBookings.some(existing => {
      const existingStart = parseBookingTime(existing.bookingTime);
      if (existingStart === null) return existing.bookingTime === bookingTime;
      return intervalsOverlap(
        requestedStart,
        requestedDuration,
        existingStart,
        getDurationMinutes(existing.serviceId?.duration)
      );
    })
  };
};

// ============================================
// GET ALL BOOKINGS (Admin → সব, User → নিজের)
// ============================================
exports.getAllBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find()
        .populate('userId', 'name email phone')
        .populate('serviceId', 'name price duration');
    } else {
      bookings = await Booking.find({ userId: req.user.id })
        .populate('serviceId', 'name price duration');
    }
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get All Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

// ============================================
// GET SINGLE BOOKING
// ============================================
exports.getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name price duration');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.'
      });
    }
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get Single Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

// ============================================
// CREATE BOOKING
// ============================================
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, serviceName, customerName, phone, staff, bookingDate, bookingTime, note, status } = req.body;
    let resolvedServiceId = serviceId;
    let resolvedUserId = req.user.id;

    if (req.user.role === 'admin') {
      if (!resolvedServiceId && serviceName) {
        const escapedName = serviceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let service = await Service.findOne({ name: { $regex: `^${escapedName}$`, $options: 'i' } });
        if (!service) {
          service = await Service.create({
            name: serviceName.trim(),
            description: `Service added from admin booking for ${serviceName.trim()}`,
            price: Number(req.body.price) || 0,
            duration: req.body.duration || '60 minutes',
            image: req.body.image || 'default-service.jpg',
            category: 'Other'
          });
        }
        resolvedServiceId = service._id;
      }
      if (customerName) {
        const customer = await User.findOne({ name: customerName, role: 'user' });
        if (customer) resolvedUserId = customer._id;
      }
    }

    if (!resolvedServiceId || !bookingDate || !bookingTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid service, booking date and booking time'
      });
    }
    const service = await Service.findById(resolvedServiceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'Selected service was not found. Please refresh and select a live service.'
      });
    }

    const schedule = await findScheduleConflict({ service, bookingDate, bookingTime, staff });
    if (schedule.invalidTime) {
      return res.status(400).json({ success: false, message: 'Please provide a valid booking time' });
    }
    if (schedule.hasConflict) {
      return res.status(409).json({
        success: false,
        message: 'This time overlaps with another active booking. Please choose another time.'
      });
    }

    const booking = await Booking.create({
      userId: resolvedUserId,
      serviceId: resolvedServiceId,
      customerName: customerName || '',
      phone: phone || '',
      staff: staff || '',
      bookingDate,
      bookingTime,
      note: note || '',
      status: req.user.role === 'admin' && status ? String(status).toLowerCase() : 'pending'
    });

    try {
      await Notification.create({
        userId: resolvedUserId,
        title: 'Booking request received',
        message: `${service.name} is requested for ${bookingDate} at ${bookingTime}. The parlour will confirm it shortly.`,
        relatedId: booking._id,
        relatedType: 'booking'
      });
    } catch (notificationError) {
      console.error('Booking notification could not be created:', notificationError.message);
    }
    await emailBookingUpdate(
      resolvedUserId,
      'We received your booking request',
      `${service.name} is requested for ${bookingDate} at ${bookingTime}. The parlour will confirm it shortly.`
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

// ============================================
// UPDATE BOOKING (শুধু User নিজের & pending থাকলে)
// ============================================
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own bookings.'
      });
    }
    if (booking.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update booking. Status is not pending.'
      });
    }
    const updates = {
      serviceId: req.body.serviceId,
      bookingDate: req.body.bookingDate,
      bookingTime: req.body.bookingTime,
      note: req.body.note,
      customerName: req.body.customerName,
      phone: req.body.phone,
      staff: req.body.staff
    };
    if (req.user.role === 'admin' && req.body.status) {
      updates.status = String(req.body.status).toLowerCase();
    }
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const scheduleChanged = ['serviceId', 'bookingDate', 'bookingTime', 'staff'].some(key => updates[key] !== undefined);
    const targetStatus = updates.status || booking.status;
    if (scheduleChanged && ['pending', 'confirmed'].includes(targetStatus)) {
      const targetService = await Service.findById(updates.serviceId || booking.serviceId);
      if (!targetService) {
        return res.status(400).json({ success: false, message: 'Selected service was not found' });
      }
      const schedule = await findScheduleConflict({
        service: targetService,
        bookingDate: updates.bookingDate || booking.bookingDate,
        bookingTime: updates.bookingTime || booking.bookingTime,
        staff: updates.staff === undefined ? booking.staff : updates.staff,
        excludeBookingId: booking._id
      });
      if (schedule.invalidTime) {
        return res.status(400).json({ success: false, message: 'Please provide a valid booking time' });
      }
      if (schedule.hasConflict) {
        return res.status(409).json({ success: false, message: 'This time overlaps with another active booking. Please choose another time.' });
      }
    }

    const previousStatus = booking.status;
    booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (req.user.role === 'admin' && booking.status !== previousStatus) {
      try {
        await Notification.create({
          userId: booking.userId,
          title: `Booking ${booking.status}`,
          message: `Your booking status has been updated to ${booking.status}.`,
          relatedId: booking._id,
          relatedType: 'booking'
        });
      } catch (notificationError) {
        console.error('Booking status notification could not be created:', notificationError.message);
      }
      await emailBookingUpdate(
        booking.userId,
        `Your booking is ${booking.status}`,
        `Your booking status has been updated to ${booking.status}.`
      );
    }
    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

// ============================================
// GET MY BOOKING (শুধু নিজের বুকিং) - SINGULAR
// ============================================
exports.getMyBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('serviceId', 'name price duration image category')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get My Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
      error: error.message
    });
  }
};

// ============================================
// UPDATE BOOKING STATUS (শুধু Admin)
// ============================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    const nextStatus = String(status).toLowerCase();
    if (['pending', 'confirmed'].includes(nextStatus)) {
      const service = await Service.findById(booking.serviceId);
      if (!service) return res.status(400).json({ success: false, message: 'Selected service was not found' });
      const schedule = await findScheduleConflict({
        service,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        staff: booking.staff,
        excludeBookingId: booking._id
      });
      if (schedule.hasConflict) {
        return res.status(409).json({ success: false, message: 'This time overlaps with another active booking.' });
      }
    }
    const previousStatus = booking.status;
    booking = await Booking.findByIdAndUpdate(req.params.id, { status: nextStatus }, {
      new: true,
      runValidators: true
    });
    if (booking.status !== previousStatus) {
      try {
        await Notification.create({
          userId: booking.userId,
          title: `Booking ${booking.status}`,
          message: `Your booking status has been updated to ${booking.status}.`,
          relatedId: booking._id,
          relatedType: 'booking'
        });
      } catch (notificationError) {
        console.error('Booking status notification could not be created:', notificationError.message);
      }
      await emailBookingUpdate(
        booking.userId,
        `Your booking is ${booking.status}`,
        `Your booking status has been updated to ${booking.status}.`
      );
    }
    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

// ============================================
// DELETE BOOKING (শুধু Admin)
// ============================================
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    await booking.deleteOne();
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};