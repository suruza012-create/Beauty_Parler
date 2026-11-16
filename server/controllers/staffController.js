const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================
// STAFF LOGIN
// ============================================
exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email, isActive: true }).select('+password');

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Staff Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// GET ALL STAFF (Admin Only)
// ============================================
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().select('-password');
    res.json({
      success: true,
      count: staff.length,
      staff
    });
  } catch (error) {
    console.error('Get Staff Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// ============================================
// CREATE STAFF (Admin Only)
// ============================================
exports.createStaff = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A password of at least 6 characters is required'
      });
    }
    if (!rest.name || !rest.email || !rest.phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required'
      });
    }

    const staff = await Staff.create({
      ...rest,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Staff created successfully',
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error('Create Staff Error:', error);
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.code === 11000 ? 'A staff member already exists with this email' : (error.message || 'Unable to create staff'),
      error: error.message
    });
  }
};

// ============================================
// UPDATE STAFF (Admin Only)
// ============================================
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff updated successfully',
      staff
    });
  } catch (error) {
    console.error('Update Staff Error:', error);
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.code === 11000 ? 'A staff member already exists with this email' : (error.message || 'Unable to update staff'),
      error: error.message
    });
  }
};

// ============================================
// DELETE STAFF (Admin Only)
// ============================================
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    await staff.deleteOne();

    res.json({
      success: true,
      message: 'Staff deleted successfully'
    });
  } catch (error) {
    console.error('Delete Staff Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};