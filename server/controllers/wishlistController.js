const Wishlist = require('../models/Wishlist');

// ============================================
// GET WISHLIST
// ============================================
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate('items.itemId');

    if (!wishlist) {
      wishlist = { items: [] };
    }

    res.json({
      success: true,
      wishlist: wishlist.items || []
    });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// ADD TO WISHLIST
// ============================================
exports.addToWishlist = async (req, res) => {
  try {
    const { type, itemId } = req.body;

    if (!type || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type and itemId'
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user.id,
        items: []
      });
    }

    // Check if already exists
    const exists = wishlist.items.some(
      item => item.type === type && item.itemId.toString() === itemId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      });
    }

    wishlist.items.push({ type, itemId });
    await wishlist.save();

    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlist: wishlist.items
    });
  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// REMOVE FROM WISHLIST
// ============================================
exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = wishlist.items.filter(
      item => item.itemId.toString() !== itemId
    );
    await wishlist.save();

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist: wishlist.items
    });
  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};