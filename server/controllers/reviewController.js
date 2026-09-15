const Review = require('../models/Review');
const Service = require('../models/Service');
const Beautician = require('../models/Beautician');

// ============================================
// GET ALL REVIEWS
// ============================================
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .populate('serviceId', 'name')
      .populate('beauticianId', 'name');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// GET REVIEWS BY SERVICE
// ============================================
exports.getReviewsByService = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate('userId', 'name email');

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get Reviews By Service Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// CREATE REVIEW
// ============================================
exports.createReview = async (req, res) => {
  try {
    const { serviceId, beauticianId, rating, comment, images } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment'
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      serviceId: serviceId || null,
      beauticianId: beauticianId || null,
      rating,
      comment,
      images: images || []
    });

    // Update average rating for service
    if (serviceId) {
      const avgRating = await Review.aggregate([
        { $match: { serviceId: serviceId } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      
      if (avgRating.length > 0) {
        await Service.findByIdAndUpdate(serviceId, {
          averageRating: avgRating[0].avg,
          totalReviews: avgRating[0].count
        });
      }
    }

    // Update average rating for beautician
    if (beauticianId) {
      const avgRating = await Review.aggregate([
        { $match: { beauticianId: beauticianId } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      
      if (avgRating.length > 0) {
        await Beautician.findByIdAndUpdate(beauticianId, {
          rating: avgRating[0].avg,
          totalReviews: avgRating[0].count
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// DELETE REVIEW (Admin Only)
// ============================================
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};