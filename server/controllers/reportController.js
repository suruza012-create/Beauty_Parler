/**
 * ============================================
 * REPORT CONTROLLER - ড্যাশবোর্ড ও রিপোর্ট
 * ============================================
 */

const Order = require('../models/Order');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');

// ============================================
// DASHBOARD STATS
// ============================================
exports.getDashboardStats = async (req, res) => {
  try {
    // মোট ইউজার, বুকিং, অর্ডার
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalOrders = await Order.countDocuments();

    // মোট আয় (সফল পেমেন্ট থেকে)
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // পেন্ডিং বুকিং ও অর্ডার
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });

    // সাম্প্রতিক ৫টি বুকিং
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('serviceId', 'name price')
      .sort({ createdAt: -1 })
      .limit(5);

    // সাম্প্রতিক ৫টি অর্ডার
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // মাসিক আয়ের চার্ট ডেটা (বর্তমান বছর)
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalOrders,
        totalRevenue,
        pendingBookings,
        pendingOrders,
        monthlyRevenue,
        recentBookings,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// SALES REPORT (তারিখ অনুযায়ী)
// ============================================
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { status: 'success' };
    if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    }

    const payments = await Payment.find(filter)
      .populate('userId', 'name email')
      .populate('orderId');

    const totalSales = payments.reduce((sum, p) => sum + p.amount, 0);

    // পেমেন্ট মেথড অনুযায়ী গ্রুপ
    const byMethod = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$method',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      report: {
        totalSales,
        totalOrders: payments.length,
        payments,
        byMethod
      }
    });
  } catch (error) {
    console.error('Sales Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};