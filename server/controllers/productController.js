/**
 * ============================================
 * PRODUCT CONTROLLER - প্রোডাক্ট সম্পর্কিত সব কাজ
 * ============================================
 */

const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    সব প্রোডাক্ট দেখা
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get All Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Get Admin Products Error:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    একটি প্রোডাক্ট দেখা
 * @access  Public
 */
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get Single Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   POST /api/products
 * @desc    নতুন প্রোডাক্ট তৈরি করা
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to create product'
    });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    প্রোডাক্ট আপডেট করা
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to update product'
    });
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    প্রোডাক্ট ডিলিট করা
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};