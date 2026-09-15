/**
 * ============================================
 * BLOG CONTROLLER - ব্লগ সম্পর্কিত সব কাজ
 * ============================================
 */

const Blog = require('../models/Blog');

/**
 * @route   GET /api/blogs
 * @desc    সব ব্লগ দেখা
 * @access  Public
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Get All Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/blogs/:id
 * @desc    একটি ব্লগ দেখা
 * @access  Public
 */
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // ভিউ কাউন্ট বাড়াও
    blog.views += 1;
    await blog.save();
    
    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get Single Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/blogs/category/:category
 * @desc    ক্যাটেগরি অনুযায়ী ব্লগ দেখা
 * @access  Public
 */
exports.getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({
      category: req.params.category,
      isPublished: true
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: blogs.length,
      category: req.params.category,
      blogs
    });
  } catch (error) {
    console.error('Get Blogs By Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/blogs/featured
 * @desc    ফিচার্ড ব্লগ দেখা
 * @access  Public
 */
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      isFeatured: true,
      isPublished: true
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Get Featured Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   POST /api/blogs
 * @desc    নতুন ব্লগ তৈরি করা
 * @access  Private (Admin)
 */
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   PUT /api/blogs/:id
 * @desc    ব্লগ আপডেট করা
 * @access  Private (Admin)
 */
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   DELETE /api/blogs/:id
 * @desc    ব্লগ ডিলিট করা
 * @access  Private (Admin)
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    await blog.deleteOne();
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};