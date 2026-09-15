/**
 * ============================================
 * BOOKING CONTROLLER - বুকিং সম্পর্কিত সব কাজ
 * ============================================
 */

const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

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
    const { serviceId, serviceName, customerName, bookingDate, bookingTime, note, status } = req.body;
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
    if (!await Service.exists({ _id: resolvedServiceId })) {
      return res.status(400).json({
        success: false,
        message: 'Selected service was not found. Please refresh and select a live service.'
      });
    }
    const booking = await Booking.create({
      userId: resolvedUserId,
      serviceId: resolvedServiceId,
      bookingDate,
      bookingTime,
      note: note || '',
      status: status ? String(status).toLowerCase() : 'pending'
    });
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
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
    booking = await Booking.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    });
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