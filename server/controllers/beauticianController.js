const Beautician = require('../models/Beautician');

// ============================================
// GET ALL BEAUTICIANS
// ============================================
exports.getBeauticians = async (req, res) => {
  try {
    const beauticians = await Beautician.find({ available: true });
    res.json({
      success: true,
      count: beauticians.length,
      beauticians
    });
  } catch (error) {
    console.error('Get Beauticians Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// GET SINGLE BEAUTICIAN
// ============================================
exports.getBeauticianById = async (req, res) => {
  try {
    const beautician = await Beautician.findById(req.params.id);

    if (!beautician) {
      return res.status(404).json({
        success: false,
        message: 'Beautician not found'
      });
    }

    res.json({
      success: true,
      beautician
    });
  } catch (error) {
    console.error('Get Beautician Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// CREATE BEAUTICIAN (Admin Only)
// ============================================
exports.createBeautician = async (req, res) => {
  try {
    const beautician = await Beautician.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Beautician added successfully',
      beautician
    });
  } catch (error) {
    console.error('Create Beautician Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// UPDATE BEAUTICIAN (Admin Only)
// ============================================
exports.updateBeautician = async (req, res) => {
  try {
    const beautician = await Beautician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!beautician) {
      return res.status(404).json({
        success: false,
        message: 'Beautician not found'
      });
    }

    res.json({
      success: true,
      message: 'Beautician updated successfully',
      beautician
    });
  } catch (error) {
    console.error('Update Beautician Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// DELETE BEAUTICIAN (Admin Only)
// ============================================
exports.deleteBeautician = async (req, res) => {
  try {
    const beautician = await Beautician.findById(req.params.id);

    if (!beautician) {
      return res.status(404).json({
        success: false,
        message: 'Beautician not found'
      });
    }

    await beautician.deleteOne();

    res.json({
      success: true,
      message: 'Beautician deleted successfully'
    });
  } catch (error) {
    console.error('Delete Beautician Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};