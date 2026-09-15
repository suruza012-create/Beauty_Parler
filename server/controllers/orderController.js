/**
 * ============================================
 * ORDER CONTROLLER - অর্ডার সম্পর্কিত সব কাজ
 * ============================================
 */

const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @route   GET /api/orders
 * @desc    সব অর্ডার দেখা (Admin) / নিজের অর্ডার দেখা (User)
 * @access  Private
 */
exports.getAllOrders = async (req, res) => {
  try {
    let orders;
    
    // অ্যাডমিন সব অর্ডার দেখতে পারে
    if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('userId', 'name email phone')
        .populate('items.productId', 'name price image');
    } else {
      // সাধারণ ইউজার শুধু নিজের অর্ডার দেখতে পারে
      orders = await Order.find({ userId: req.user.id })
        .populate('items.productId', 'name price image');
    }
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    একটি অর্ডার দেখা
 * @access  Private
 */
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('items.productId', 'name price image');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // চেক করো ইউজার নিজের অর্ডার নাকি অ্যাডমিন
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get Single Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   POST /api/orders
 * @desc    নতুন অর্ডার তৈরি করা
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod, note } = req.body;
    
    // ভ্যালিডেশন
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one item to order'
      });
    }
    
    if (!deliveryAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide delivery address and phone'
      });
    }
    
    // প্রতিটি আইটেমের স্টক চেক করো
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
    }
    
    // মোট মূল্য ক্যালকুলেট করো
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
      
      // স্টক কমাও
      product.stock -= item.quantity;
      await product.save();
    }
    
    // অর্ডার তৈরি করো
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod: paymentMethod || 'cash',
      note: note || ''
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    অর্ডার স্ট্যাটাস পরিবর্তন করা (শুধু অ্যাডমিন)
 * @access  Private (Admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide orderStatus'
      });
    }
    
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // যদি অর্ডার ডেলিভারি হয়, ডেলিভারি তারিখ সেট করো
    const updateData = { orderStatus };
    if (orderStatus === 'delivered') {
      updateData.deliveredAt = Date.now();
    }
    
    order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   PUT /api/orders/:id/payment
 * @desc    অর্ডারের পেমেন্ট স্ট্যাটাস পরিবর্তন করা (শুধু অ্যাডমিন)
 * @access  Private (Admin)
 */
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide paymentStatus'
      });
    }
    
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const updateData = { paymentStatus };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    
    order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      order
    });
  } catch (error) {
    console.error('Update Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   DELETE /api/orders/:id
 * @desc    অর্ডার ডিলিট করা (শুধু অ্যাডমিন)
 * @access  Private (Admin)
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // ডিলিট করার আগে স্টক ফিরিয়ে দাও
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    await order.deleteOne();
    
    res.json({
      success: true,
      message: 'Order deleted successfully and stock restored'
    });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};