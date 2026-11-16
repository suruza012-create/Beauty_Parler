const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { isSslCommerzConfigured, createSslCommerzSession, validateSslCommerzPayment, isValidSslCommerzTransaction } = require('../utils/sslcommerz');

const getClientUrl = () => (process.env.CLIENT_URL || '').replace(/\/$/, '');

const getServerUrl = () => (process.env.API_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, '');

const hasSecureProductionUrls = () => process.env.NODE_ENV !== 'production'
  || (getClientUrl().startsWith('https://') && getServerUrl().startsWith('https://'));

exports.getPaymentConfig = (req, res) => {
  res.json({
    success: true,
    sslcommerzEnabled: process.env.PAYMENT_PROVIDER === 'sslcommerz'
      && isSslCommerzConfigured()
      && Boolean(getClientUrl())
      && hasSecureProductionUrls()
  });
};

exports.initiateSslCommerzPayment = async (req, res) => {
  try {
    if (process.env.PAYMENT_PROVIDER !== 'sslcommerz' || !isSslCommerzConfigured() || !getClientUrl() || !hasSecureProductionUrls()) {
      return res.status(503).json({ success: false, message: 'Online payment is not configured' });
    }

    const order = await Order.findById(req.body.orderId).populate('userId', 'name email address');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You cannot pay for this order' });
    }
    if (order.paymentMethod !== 'sslcommerz') {
      return res.status(400).json({ success: false, message: 'Order is not configured for online payment' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(409).json({ success: false, message: 'This order is already paid' });
    }
    if (order.totalAmount < 10 || order.totalAmount > 500000) {
      return res.status(400).json({ success: false, message: 'SSLCommerz accepts payments from ৳10 to ৳500,000' });
    }

    const recentPayment = await Payment.findOne({ orderId: order._id, method: 'sslcommerz', status: 'pending' }).sort({ createdAt: -1 });
    if (recentPayment?.gatewayRedirectUrl && Date.now() - recentPayment.createdAt.getTime() < 20 * 60 * 1000) {
      return res.json({ success: true, gatewayUrl: recentPayment.gatewayRedirectUrl });
    }
    if (recentPayment) {
      recentPayment.status = 'failed';
      await recentPayment.save();
    }

    const transactionId = `BP${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`.slice(0, 30);
    const payment = await Payment.create({
      orderId: order._id,
      userId: req.user.id,
      amount: order.totalAmount,
      method: 'sslcommerz',
      transactionId,
      status: 'pending'
    });
    const apiUrl = getServerUrl();
    const callbackBase = `${apiUrl}/api/payment/sslcommerz`;
    const address = order.deliveryAddress || {};
    const customer = order.userId || {};
    const session = await createSslCommerzSession({
      total_amount: order.totalAmount.toFixed(2),
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${callbackBase}/success`,
      fail_url: `${callbackBase}/fail`,
      cancel_url: `${callbackBase}/cancel`,
      ipn_url: `${callbackBase}/ipn`,
      cus_name: String(customer.name || 'Customer').slice(0, 50),
      cus_email: String(customer.email || 'customer@example.com').slice(0, 50),
      cus_add1: String(address.street || address.address || 'Dhaka').slice(0, 50),
      cus_add2: String(address.area || '').slice(0, 50),
      cus_city: String(address.city || 'Dhaka').slice(0, 50),
      cus_state: String(address.state || 'Dhaka').slice(0, 50),
      cus_postcode: String(address.postalCode || '1000').slice(0, 30),
      cus_country: 'Bangladesh',
      cus_phone: String(order.phone || '01700000000').slice(0, 20),
      shipping_method: 'NO',
      num_of_item: String(order.items.reduce((sum, item) => sum + item.quantity, 0)),
      product_name: order.items.map(item => item.name).join(', ').slice(0, 255) || 'Beauty service',
      product_category: 'Beauty and personal care',
      product_profile: 'physical-goods',
      value_a: String(order._id)
    });

    if (!session.GatewayPageURL) throw new Error('SSLCommerz did not return a checkout URL');
    const gatewayUrl = new URL(session.GatewayPageURL);
    const allowedHosts = process.env.SSLCOMMERZ_IS_LIVE === 'true'
      ? ['securepay.sslcommerz.com']
      : ['sandbox.sslcommerz.com'];
    if (gatewayUrl.protocol !== 'https:' || !allowedHosts.includes(gatewayUrl.hostname)) {
      throw new Error('SSLCommerz returned an unexpected checkout URL');
    }

    payment.gatewaySessionKey = session.sessionkey || '';
    payment.gatewayRedirectUrl = gatewayUrl.toString();
    await payment.save();
    res.status(201).json({ success: true, gatewayUrl: payment.gatewayRedirectUrl });
  } catch (error) {
    console.error('SSLCommerz initiation failed:', error.message);
    res.status(502).json({ success: false, message: 'Unable to start online payment. Please try again.' });
  }
};

const verifyAndRecordSslCommerzPayment = async payload => {
  if (!payload.val_id) return { valid: false, reason: 'Missing validation id' };
  const validation = await validateSslCommerzPayment(payload.val_id);
  const payment = await Payment.findOne({ transactionId: String(validation.tran_id || '') });
  if (!payment) return { valid: false, reason: 'Payment transaction not found' };
  if (payload.tran_id && String(payload.tran_id) !== payment.transactionId) {
    return { valid: false, reason: 'Transaction id does not match' };
  }
  const verification = isValidSslCommerzTransaction(validation, payment);
  if (!verification.valid) return { valid: false, reason: verification.reason, payment };
  if (verification.requiresReview) return { valid: false, reason: 'Payment requires manual risk review', payment, requiresReview: true };
  if (payment.status === 'success') return { valid: true, payment };

  const updatedPayment = await Payment.findOneAndUpdate(
    { _id: payment._id, status: { $ne: 'success' } },
    {
      $set: {
        status: 'success',
        validationId: String(validation.val_id),
        gatewayBankTransactionId: String(validation.bank_tran_id || ''),
        paymentDate: validation.tran_date ? new Date(validation.tran_date) : new Date()
      }
    },
    { new: true }
  );
  if (!updatedPayment) return { valid: false, reason: 'Payment status could not be updated' };

  await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'paid', transactionId: payment.transactionId });
  return { valid: true, payment: updatedPayment };
};

const redirectPaymentResult = (res, status, orderId = '') => {
  const query = new URLSearchParams({ status });
  if (orderId) query.set('orderId', String(orderId));
  return res.redirect(303, `${getClientUrl()}/payment/result?${query.toString()}`);
};

exports.handleSslCommerzSuccess = async (req, res) => {
  try {
    const result = await verifyAndRecordSslCommerzPayment(req.body);
    if (!result.valid) return redirectPaymentResult(res, result.requiresReview ? 'review' : 'failed', result.payment?.orderId);
    return redirectPaymentResult(res, 'success', result.payment.orderId);
  } catch (error) {
    console.error('SSLCommerz success validation failed:', error.message);
    return redirectPaymentResult(res, 'failed');
  }
};

exports.handleSslCommerzIpn = async (req, res) => {
  try {
    const result = await verifyAndRecordSslCommerzPayment(req.body);
    if (!result.valid) console.warn('SSLCommerz IPN was not accepted:', result.reason);
    return res.status(200).send('IPN received');
  } catch (error) {
    console.error('SSLCommerz IPN processing failed:', error.message);
    return res.status(503).send('Unable to verify IPN yet');
  }
};

exports.handleSslCommerzFailure = async (req, res) => {
  const status = req.path.endsWith('/cancel') ? 'cancelled' : 'failed';
  try {
    const payment = await Payment.findOne({ transactionId: String(req.body.tran_id || ''), method: 'sslcommerz' });
    if (payment?.status === 'pending') {
      payment.status = 'failed';
      await payment.save();
      await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'failed' });
    }
    return redirectPaymentResult(res, status, payment?.orderId);
  } catch (error) {
    console.error('SSLCommerz failure callback failed:', error.message);
    return redirectPaymentResult(res, status);
  }
};

// ============================================
// CREATE PAYMENT
// ============================================
exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, method, mobileNumber, transactionId } = req.body;

    if (!orderId || !method) {
      return res.status(400).json({
        success: false,
        message: 'Please provide orderId and method'
      });
    }

    const normalizedMethod = String(method).toLowerCase();
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You cannot submit payment for this order' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(409).json({ success: false, message: 'This order is already paid' });
    }
    if (order.paymentMethod !== normalizedMethod || ['cash', 'sslcommerz'].includes(normalizedMethod)) {
      return res.status(400).json({ success: false, message: 'Payment method does not match the order' });
    }
    if (Number.isFinite(Number(amount)) && Math.abs(Number(amount) - order.totalAmount) >= 0.01) {
      return res.status(400).json({ success: false, message: 'Payment amount does not match the order total' });
    }

    const existingPayment = await Payment.findOne({ orderId, status: 'pending' });
    if (existingPayment) {
      return res.status(409).json({ success: false, message: 'A payment is already awaiting review for this order' });
    }

    const payment = await Payment.create({
      orderId,
      userId: req.user.id,
      amount: order.totalAmount,
      method: normalizedMethod,
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