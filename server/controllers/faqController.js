const FAQ = require('../models/FAQ');

// ============================================
// GET ALL FAQs
// ============================================
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    console.error('Get FAQs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// GET FAQs BY CATEGORY
// ============================================
exports.getFAQsByCategory = async (req, res) => {
  try {
    const faqs = await FAQ.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    console.error('Get FAQs By Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// CREATE FAQ (Admin Only)
// ============================================
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq
    });
  } catch (error) {
    console.error('Create FAQ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// UPDATE FAQ (Admin Only)
// ============================================
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.json({
      success: true,
      message: 'FAQ updated successfully',
      faq
    });
  } catch (error) {
    console.error('Update FAQ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// DELETE FAQ (Admin Only)
// ============================================
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.deleteOne();

    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Delete FAQ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};