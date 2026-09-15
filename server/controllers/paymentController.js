const Payment = require('../models/Payment');

// ============================================
// CREATE PAYMENT
// ============================================
exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, method, mobileNumber, transactionId } = req.body;

    if (!orderId || !amount || Number(amount) <= 0 || !method) {
      return res.status(400).json({
        success: false,
        message: 'Please provide orderId, amount and method'
      });
    }

    const payment = await Payment.create({
      orderId,
      userId: req.user.id,
      amount: Number(amount),
      method: String(method).toLowerCase(),
      mobileNumber: mobileNumber || '',
      transactionId: transactionId || `TXN${Date.now()}`,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// GET ALL PAYMENTS
// ============================================
exports.getPayments = async (req, res) => {
  try {
    let payments;
    if (req.user.role === 'admin') {
      payments = await Payment.find()
        .populate('userId', 'name email')
        .populate('orderId', 'totalAmount orderStatus');
    } else {
      payments = await Payment.find({ userId: req.user.id })
        .populate('orderId', 'totalAmount orderStatus');
    }

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// GET SINGLE PAYMENT
// ============================================
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('orderId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment
    if (payment.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// UPDATE PAYMENT STATUS (Admin Only)
// ============================================
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated',
      payment
    });
  } catch (error) {
    console.error('Update Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// DELETE PAYMENT (Admin Only)
// ============================================
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.deleteOne();

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};