/**
 * ============================================
 * SERVICE CONTROLLER - সার্ভিস সম্পর্কিত সব কাজ
 * ============================================
 */

const Service = require('../models/Service');

/**
 * @route   GET /api/services
 * @desc    সব সার্ভিস দেখা
 * @access  Public
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    
    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get All Services Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/services/:id
 * @desc    একটি সার্ভিস দেখা
 * @access  Public
 */
exports.getSingleService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get Single Service Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};

/**
 * @route   POST /api/services
 * @desc    নতুন সার্ভিস তৈরি করা
 * @access  Private (Admin)
 */
exports.createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      image: req.body.image || 'default-service.jpg',
      description: req.body.description || req.body.name
    });
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create Service Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to create service'
    });
  }
};

/**
 * @route   PUT /api/services/:id
 * @desc    সার্ভিস আপডেট করা
 * @access  Private (Admin)
 */
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update Service Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Unable to update service'
    });
  }
};

/**
 * @route   DELETE /api/services/:id
 * @desc    সার্ভিস ডিলিট করা
 * @access  Private (Admin)
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    await service.deleteOne();
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete Service Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.'
    });
  }
};